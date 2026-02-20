# Vision Architecture Blueprint — Robotic Poker Dealer

A modular perception pipeline for a casino poker table. Each layer is an independent subsystem with defined inputs, outputs, and failure modes. No layer trusts the layer above it — every handoff includes confidence scores and fallback paths.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CAMERA ARRAY (Layer 0)                       │
│   Overhead 4K @ 60fps  ·  Side-angle 1080p × 2  ·  IR chip cam     │
└──────────────┬──────────────────────────────────┬───────────────────┘
               │                                  │
               ▼                                  ▼
┌──────────────────────────┐    ┌──────────────────────────────────┐
│  DETECTION ENGINE (L1)   │    │  SPATIAL CALIBRATION (L1b)       │
│  RF-DETR-S @ 640         │    │  Keypoint model → Homography     │
│  Cards · Chips · Hands   │    │  Camera coords → Table coords    │
│  Button · Community zone │    │  Recalibrate on camera shift     │
└──────────┬───────────────┘    └──────────────┬───────────────────┘
           │                                   │
           ▼                                   ▼
┌──────────────────────────┐    ┌──────────────────────────────────┐
│  TRACKING ENGINE (L2)    │    │  ZONE MANAGER (L2b)              │
│  SAM 2 Tiny (cards)      │    │  PolygonZone per seat (1-10)     │
│  ByteTrack (chips)       │    │  Community zone · Pot zone       │
│  Stable ID per object    │    │  Burn pile · Rake box · Deck     │
└──────────┬───────────────┘    └──────────────┬───────────────────┘
           │                                   │
           ▼                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                    CLASSIFICATION ENGINE (L3)                     │
│  Card Reader: SmallVLM2 fine-tuned (constrained to 52 outputs)   │
│  Chip Reader: SigLIP embeddings → KMeans per casino chip set     │
│  Multi-frame consensus: 3 agreeing frames before identity lock   │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    STATE MACHINE (L4)                             │
│  Hand Phase: idle → shuffle → deal → preflop → flop → turn →    │
│              river → showdown → pot_push → cleanup                │
│  Bet Tracker: temporal event detection (chip_motion → bet_conf)  │
│  Pot Calculator: zone-based chip counting + denomination × count │
│  Side Pot Engine: all-in detection → stack isolation → pot split  │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    RULE ARBITRATION (L5)                          │
│  Hand evaluator: best 5 of 7 (Hold'em) / must-use-2 (PLO)       │
│  Misdeal detector: exposed card rules, stub count verification   │
│  Action validator: string bet detection, out-of-turn prevention  │
│  Winner determination + pot push authorization                   │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    OUTPUT / ACTUATION (L6)                        │
│  Dealer robot commands: pitch card, push pot, make change        │
│  Player display: pot size, action prompt, hand result            │
│  Surveillance feed: annotated video stream to security           │
│  Audit log: every detection, every state transition, timestamped │
└──────────────────────────────────────────────────────────────────┘
```

---

## Layer 0: Camera Array

### Configuration
| Camera | Position | Resolution | FPS | Purpose |
|---|---|---|---|---|
| Primary overhead | Centered 4ft above table | 3840×2160 (4K) | 60 | Card detection, community board, player zones |
| Side-angle left | Table edge, 30° down | 1920×1080 | 30 | Chip stack height estimation, card pitch tracking |
| Side-angle right | Table edge, 30° down | 1920×1080 | 30 | Redundant chip view, player hand region |
| IR chip camera | Below table glass (if applicable) | 1920×1080 | 30 | RFID/IR chip denomination reading (future) |

### Design Decisions (from transcripts)
- **60 FPS overhead minimum**: Cards move ~20 inches/second during pitch (T3, T7). At 30 FPS, card moves ~0.67 inches between frames — tracker may lose identity. At 60 FPS, ~0.33 inches — manageable.
- **4K resolution**: At 640×640 model input, 4K allows cropping specific table regions at full resolution without quality loss (T16: RF-DETR supports multiple resolutions from single checkpoint).
- **Fixed cameras, not PTZ**: Basketball AI (T17) spent massive effort on dynamic camera homography. Fixed cameras eliminate this entirely. Homography matrix computed once at installation, verified daily.
- **RTSP protocol**: Confirmed compatible with Jetson edge deployment pipeline (T12).

---

## Layer 1: Detection Engine

### Primary Model: RF-DETR-S
**Why RF-DETR over YOLO** (from T16, T17):
- NMS-free architecture → no detection jitter between frames → smoother tracking downstream
- DINOv2 backbone → better generalization to new card decks and chip sets without retraining
- Single checkpoint serves multiple resolutions → 640 for real-time, 1024 for showdown verification
- Foundation model backbone preserves general visual knowledge even after fine-tuning

### Detection Classes (22 total)
```
CARDS (6):
  card_face_down          # In player's hand or on table, back visible
  card_face_up            # Revealed card, rank+suit visible
  card_community          # On the board (flop/turn/river)
  card_burn               # In burn pile
  card_in_motion          # Being pitched or turned
  card_exposed            # Accidentally revealed (misdeal trigger)

CHIPS (5):
  chip_stack              # Vertical stack in player's area
  chip_single             # Individual chip
  chip_in_pot             # Chips in center pot zone
  chip_bet                # Chips pushed forward as bet/raise
  chip_rake               # Chips in rake box

TABLE LANDMARKS (5):
  dealer_button           # The button
  small_blind_marker      # SB position indicator
  big_blind_marker        # BB position indicator
  community_zone          # The 5-card board area
  pot_zone                # Center of table

HANDS/ACTIONS (4):
  dealer_hand             # Robot arm or human hand over table
  player_hand_reaching    # Player moving chips (bet/call action)
  player_hand_cards       # Player touching their hole cards
  player_hand_muck        # Player pushing cards forward (fold)

GAME OBJECTS (2):
  deck                    # The remaining stub
  cut_card                # Plastic cut card
```

### Inference Configuration
```python
detection_config = {
    "model": "rf-detr-s",
    "input_resolution": 640,        # Real-time default
    "showdown_resolution": 1024,    # Triggered at showdown phase
    "confidence_thresholds": {
        "card_face_up": 0.70,       # High — misread is catastrophic
        "card_face_down": 0.40,     # Lower — just need to know it exists
        "card_community": 0.75,     # Very high — board cards are game-critical
        "chip_stack": 0.30,         # Low — overcounting preferred over missing
        "chip_bet": 0.50,           # Medium — triggers state transitions
        "dealer_button": 0.60,      # Medium — position is important
        "card_exposed": 0.35,       # Low threshold — safety-critical, don't miss
    },
    "iou_threshold": 0.45,
    "agnostic_nms": True,           # Prevent card detected as both face_up and community
}
```

### Fallback: YOLO11-Nano
If RF-DETR latency exceeds 25ms per frame, auto-switch to YOLO11-Nano (T1, T2). Lower accuracy but guaranteed real-time. Alert ops center that table is running in degraded mode.

---

## Layer 1b: Spatial Calibration

### Keypoint Detection Model: YOLO11-Medium
**From T17 (Basketball AI)**: 33 court keypoints for homography. Poker table adaptation:

### Table Keypoints (16 defined)
```
0: table_center               # Dead center of table
1-10: seat_positions           # Center of each player's area
11: community_left_edge        # Left edge of 5-card board zone
12: community_right_edge       # Right edge of 5-card board zone
13: pot_center                 # Center of pot area
14: dealer_position            # Where deck/robot sits
15: rake_box                   # Rake collection point
```

### Homography Computation
```
1. Run keypoint model on calibration frame
2. Filter keypoints with confidence > 0.5 (T17 threshold)
3. Match detected keypoints to known table coordinates (fixed geometry)
4. Compute 3×3 homography matrix (minimum 4 point pairs)
5. Store matrix — recalibrate only if camera position shifts
6. Verify daily: project known point, measure error < 2mm
```

**Poker advantage over basketball**: Camera is FIXED. Homography computed once at installation. Basketball needed per-frame recomputation. This eliminates the largest source of mapping error from T17.

---

## Layer 2: Tracking Engine

### Dual-Tracker Architecture

**Cards: SAM 2 Tiny**
- Initialized from RF-DETR detections at deal start (T17 pattern: detector boxes → SAM 2 prompts)
- Pixel-level masks survive card overlap and partial occlusion
- Memory bank per tracked card — maintains identity even when card briefly hidden by player's hand
- SAM 2 Tiny (39M params) chosen over Large (224M) for speed (T17: SAM 2 is "by far the slowest part")
- Mask cleanup function active: remove disconnected fragments (T17)
- Re-initialize tracking at each new hand (clear memory bank, fresh start)

**Chips: ByteTrack**
- Lighter weight than SAM 2 — chips move predictably (linear motion during bets)
- `new_instances` trigger from ByteTrack (T4) → detect when new chips enter pot zone → bet event
- Kalman filter prediction handles brief occlusion from player hands
- Re-initialize per betting round (chips don't need persistent identity across rounds)

### Why Two Trackers
Cards need pixel-level precision and long-term identity. Chips need speed and zone-crossing detection. Using SAM 2 for everything would be too slow (T17 explicitly states this). Using ByteTrack for everything would lose card identity during player hand peeking.

---

## Layer 2b: Zone Manager

### Zone Definitions (Supervision PolygonZone, from T3, T6)
```python
zones = {
    # Per-seat zones (10 players max)
    "seat_1": PolygonZone(polygon=seat_1_coords),
    "seat_2": PolygonZone(polygon=seat_2_coords),
    # ... through seat_10

    # Table zones
    "community": PolygonZone(polygon=community_board_coords),
    "pot": PolygonZone(polygon=pot_area_coords),
    "burn_pile": PolygonZone(polygon=burn_pile_coords),
    "deck": PolygonZone(polygon=deck_area_coords),
    "rake_box": PolygonZone(polygon=rake_box_coords),

    # Crossing lines (LineZone from T4)
    "bet_line_seat_1": LineZone(start=seat1_near, end=seat1_far),
    # ... per seat
}
```

### Zone Events
| Event | Trigger | Downstream Action |
|---|---|---|
| Card enters `seat_N` | SAM 2 tracker + zone check | Register card dealt to player N |
| Card enters `community` | SAM 2 tracker + zone check | Flop/turn/river card placed |
| Card enters `burn_pile` | SAM 2 tracker + zone check | Burn card registered |
| Chips cross `bet_line_seat_N` | ByteTrack + LineZone | Bet/raise action initiated |
| Chips enter `pot` | ByteTrack + PolygonZone | Bet confirmed, update pot total |
| Card count in `community` changes | Zone counting | Phase transition (0→3=flop, 3→4=turn, 4→5=river) |

---

## Layer 3: Classification Engine

### Card Reader: SmallVLM2 Fine-Tuned
**From T17**: Base SmallVLM2 reached 56% on jersey OCR, fine-tuned to 86%. Poker cards are MORE constrained (52 valid outputs), so expect higher accuracy.

```python
card_reader_config = {
    "model": "small-vlm2-finetuned-poker-cards",
    "crop_size": 224,               # Stretched to fill (T17 OCR pattern)
    "crop_padding": 10,             # Extra context pixels around detection
    "prompt": "What card is this? Respond with rank and suit only.",
    "valid_outputs": FULL_DECK_52,  # Hard constrain to valid cards
    "consensus_frames": 3,          # Minimum agreeing frames before lock (T17)
    "confidence_floor": 0.85,       # Below this → re-scan or escalate
}
```

### Chip Reader: Unsupervised Clustering
**From T17 (SigLIP + UMAP + KMeans)**: No pre-labeled chip data needed per casino.

```python
chip_classifier_config = {
    "embedding_model": "siglip",
    "dimensionality_reduction": "umap",
    "umap_dimensions": 3,
    "clustering": "kmeans",
    "n_clusters": None,             # Auto-detect from casino's chip set (4-8 denominations)
    "calibration": "per_session",   # Run clustering on first 100 chip crops, then lock
    "denomination_mapping": {       # Human provides once per casino
        0: 1, 1: 5, 2: 25, 3: 100, 4: 500
    }
}
```

### IOS Matching (from T17)
Card classification and card tracking produce separate outputs. IOS (Intersection over Smaller area) matches them:
- Card mask from SAM 2 tracking
- Card crop from RF-DETR detection
- IOS = 1.0 → classification definitively belongs to that tracked card

---

## Layer 4: State Machine

### Hand Phase Progression
```
IDLE → SHUFFLE → DEAL_PREFLOP → BETTING_PREFLOP → DEAL_FLOP →
BETTING_FLOP → DEAL_TURN → BETTING_TURN → DEAL_RIVER →
BETTING_RIVER → SHOWDOWN → POT_PUSH → CLEANUP → IDLE
```

### Phase Transition Triggers
| Transition | Vision Trigger | Validation |
|---|---|---|
| IDLE → SHUFFLE | Deck detected in dealer zone + motion | — |
| SHUFFLE → DEAL_PREFLOP | Cards begin leaving deck zone | Deck present, button placed |
| DEAL_PREFLOP → BETTING_PREFLOP | 2 cards in each active seat zone | Card count = 2 × active players |
| BETTING_PREFLOP → DEAL_FLOP | Chip motion stops + pot zone stable | All bets matched or folds complete |
| DEAL_FLOP → BETTING_FLOP | 3 cards in community zone + 1 burn | Exactly 3 community cards detected |
| DEAL_TURN → BETTING_TURN | 4 cards in community zone + 2 burns | Exactly 4 community cards |
| DEAL_RIVER → BETTING_RIVER | 5 cards in community zone + 3 burns | Exactly 5 community cards |
| BETTING_RIVER → SHOWDOWN | Action complete, no more bets | All remaining players accounted for |
| SHOWDOWN → POT_PUSH | Winner determined | Hand evaluation verified |
| POT_PUSH → CLEANUP | Pot zone empty | Chips distributed to winner zone |
| CLEANUP → IDLE | All cards collected, deck reformed | Card count = 52 (stub verification) |

### Bet Event Tracker (from T17 Shot Event pattern)
```python
bet_tracker_config = {
    "chip_motion_frames": 3,        # Consecutive frames of chip movement = bet start
    "bet_confirm_window": 15,       # Frames after motion stops to confirm bet landed
    "cooldown_frames": 10,          # Minimum frames between distinct bets from same seat
    "events": ["bet_start", "bet_confirmed", "raise_start", "raise_confirmed",
               "call_confirmed", "fold_detected"]
}
```

### Pot Calculator
```
pot_total = Σ (chip_count_per_denomination × denomination_value) for all chips in pot_zone
side_pots = computed when all-in detected with unequal stacks (Deployment Bible Section 6)
```

---

## Layer 5: Rule Arbitration

### Responsibilities
- **Hand evaluation**: Compute best 5-of-7 (Hold'em), enforce must-use-2 (PLO)
- **PLO framing**: Computationally trivial for robot — enumerate all C(4,2)×C(5,3) = 60 combinations (the "framing" technique from Deployment Bible)
- **Misdeal detection**: card_exposed class detected during deal → apply exposed card rules
- **Stub count**: After every hand, count remaining deck. Must equal 52 - dealt - community - burns
- **String bet detection**: Player pushes chips in multiple motions without verbal declaration → flag
- **Out-of-turn prevention**: Track whose action it is, alert if wrong seat moves chips

---

## Layer 6: Output and Actuation

### Robot Commands
- Pitch card to seat N (actuator)
- Push pot to seat N (actuator)
- Make change from chip stack (actuator)
- Display community cards (physical board or screen)

### Player Display (per seat)
- Pot size (updated in real-time)
- Action prompt ("Your turn — check, bet, or fold")
- Hand result at showdown

### Surveillance Feed (via WebRTC, from T11)
- Annotated video stream: bounding boxes on all detected objects
- Real-time to security room
- JSON data channel with structured events (bets, folds, pot changes)

### Audit Log
Every detection, every state transition, every confidence score — timestamped and stored.
Regulatory requirement (Deployment Bible Section 12). Minimum 30-day retention.

---

## Hardware Stack (Per Table)

| Component | Specification | Justification |
|---|---|---|
| Compute | NVIDIA Jetson Orin NX 16GB | T12: proven for multi-model edge inference |
| Primary camera | Allied Vision Alvium 4K USB3, 60fps | Fixed overhead, industrial grade |
| Side cameras (×2) | 1080p USB3 industrial | Chip height + redundancy |
| Network | Wired Ethernet (no WiFi) | Zero network dependency for real-time path |
| Storage | 512GB NVMe | 72+ hours of audit video buffer |
| UPS | 15-minute battery backup | Complete current hand if power fails |

### Deployment (from T12 Fleet Management)
```
1. Provision device via Roboflow Edge Manager (one command)
2. Push Docker container with all models + inference server
3. TensorRT optimization runs on first boot (~10 min)
4. RTSP cameras auto-discovered on local network
5. Heartbeat monitoring begins → ops center dashboard
6. Model updates pushed during 4 AM maintenance window
```
