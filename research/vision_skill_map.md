# Vision Skill Map — Robotic Poker Dealer

Derived from 20 Roboflow video transcripts. Every skill listed below was demonstrated in at least one transcript and has been translated to the poker dealing domain.

---

## 1. DATA — Building the Perception Foundation

### 1.1 Dataset Construction
**What it solves**: You need labeled images of cards, chips, hands, and table regions before any model can learn.
**Why it matters for poker**: Casino environments have unique lighting (overhead spots, felt reflections, chip glare). Generic card datasets from the internet will fail on Day 1.
**Failure scenario**: Model trained on clean card photos misidentifies every card under yellow casino lighting. 100% of hands dealt incorrectly.

| Skill | Source Transcript | Poker Application |
|---|---|---|
| Annotation format standardization (YOLO: class_id x_center y_center w h normalized) | T1, T2, T5 | Card/chip bounding boxes, consistent format across annotation team |
| 34+ import format conversion | T10 (Roboflow intro) | Ingest annotations from any labeling tool without reformatting |
| Model-assisted labeling (bootstrap with pretrained model, correct manually) | T10, T17 | Use initial card detector to pre-label 10K frames, human corrects only errors |
| Self-labeling with VLM | T17 (SmallVLM2) | Use base VLM to auto-label card value crops, then manually fix misreads |
| Data health checks (zero-area, out-of-frame, class imbalance) | T10 | Detect if "Ace of Spades" has 5× more samples than "2 of Clubs" |
| Annotation heatmaps | T10 | Verify card annotations cluster in the dealing zone, not random noise |
| Train/test split distribution matching | T1, T5 | Ensure test set has same proportion of face cards, suits, lighting conditions |
| Resize strategy: fill vs stretch vs letterbox | T1, T17 | Fill-with-padding for detection (preserves aspect ratio), stretch for OCR crops |
| Augmentation strategy selection | T1, T5, T17 | Aggressive augmentation for YOLO-based detectors; minimal for DINOv2/RF-DETR backbone |

### 1.2 Active Learning Loop
**What it solves**: Model improves over time by selecting the most informative samples to label next.
**Why it matters for poker**: New chip sets, new card decks, new table felts — the model must adapt without full retraining.
**Failure scenario**: Casino switches from Copag to KEM cards. Model confidence drops on the new back pattern. Without active learning, nobody notices until 50 misdeals later.

| Skill | Source Transcript | Poker Application |
|---|---|---|
| Confidence-based sample selection | T10 | Route low-confidence card reads to human review queue |
| Edge case mining from production inference | T9 (Workflows) | Flag frames where card detection confidence < 0.7 for labeling |
| Version-controlled dataset iteration | T10 | Track dataset versions: v1 (Copag only) → v2 (Copag + KEM) → v3 (+ worn cards) |

---

## 2. MODELS — Detection, Classification, and Segmentation

### 2.1 Object Detection
**What it solves**: Locate every card, chip, hand, and table landmark in each frame.
**Why it matters for poker**: Everything downstream (tracking, counting, state estimation) depends on accurate detection.
**Failure scenario**: Detector misses a face-down card during the deal. The system thinks 8 players received cards when 9 did. Hand proceeds with ghost player.

| Skill | Source Transcript | Poker Application |
|---|---|---|
| YOLO family (v5, v8, v11) training and deployment | T1, T2, T3, T5 | Fast card/chip detection; Nano for edge, Large for accuracy |
| RF-DETR (NMS-free, DINOv2 backbone) | T16, T17 | Smoother tracking (no NMS jitter), better generalization to new card decks |
| Model size selection (Nano → X tradeoff) | T1, T2, T16 | Nano (120 FPS) for real-time card tracking, Large for post-hand verification |
| Action subclass detection | T17 | `card_face_down`, `card_in_motion`, `card_exposed`, `chip_bet`, `chip_pot` |
| Confidence + IOU threshold tuning | T1, T3, T16 | High confidence (0.6+) for card identity, lower (0.3) for chip area scanning |
| Agnostic NMS for overlapping classes | T3 | Prevent double-detecting a card as both `card_face_up` and `card_community` |
| Multi-resolution inference from single checkpoint (RF-DETR) | T16 | 640 for real-time, 1024 for disputed showdowns — same model weights |

### 2.2 Segmentation
**What it solves**: Pixel-level masks instead of bounding boxes — know exactly which pixels are card vs felt.
**Why it matters for poker**: Cards overlap at edges. Bounding boxes can't distinguish "this pixel is card A" from "this pixel is card B."
**Failure scenario**: Two community cards touch. Bounding boxes overlap 30%. System merges them into one detection. Flop shows 2 cards instead of 3.

| Skill | Source Transcript | Poker Application |
|---|---|---|
| SAM 2/3 prompted segmentation | T15, T17 | Precise card boundaries when cards overlap or touch |
| Visual exemplar prompting (one box → all instances) | T15 | Show one chip → segment all chips of same color on table |
| Text-prompt segmentation | T15 | "poker chip" → segment all chips without training |
| Mask cleanup (remove disconnected fragments) | T17 | Remove mask artifacts when card partially occluded by hand |
| Fine-tuning SAM with 50-100 images | T15 | Specialize for casino-specific card back patterns |

### 2.3 Classification and OCR
**What it solves**: Read what's on the card or chip after detecting it.
**Why it matters for poker**: Detection finds the card; classification tells you it's the Ace of Spades.
**Failure scenario**: VLM reads "Q♠" as "Q♣" because suit symbols are small and similar at low resolution. Pot awarded to wrong player.

| Skill | Source Transcript | Poker Application |
|---|---|---|
| SmallVLM2 for visual OCR | T17 | Read card rank + suit from detected crops |
| VLM fine-tuning on domain crops | T17 | 56% → 86% accuracy gain by fine-tuning on jersey crops; expect similar for cards |
| Constrained output vocabulary | T17 | Cards have only 52 valid identities — hard-constrain VLM output to valid cards |
| SigLIP embeddings for visual similarity | T17 | Chip denomination clustering by visual appearance without labeled chip data |

---

## 3. INFERENCE — Running Models in Production

### 3.1 Inference Pipeline Architecture
**What it solves**: How models receive frames and return predictions in real-time.
**Why it matters for poker**: The dealing cycle has hard time constraints. A 500ms delay between deal and detection means the system is always one beat behind.
**Failure scenario**: Cold-start latency on serverless inference causes 3-second delay. Player acts before system registers the flop cards. State machine falls out of sync.

| Skill | Source Transcript | Poker Application |
|---|---|---|
| Local inference via `inference` Python package | T1, T13, T17 | Primary path: on-device inference, no network dependency |
| Roboflow Workflows (visual DAG pipeline) | T8, T9 | Chain detection → classification → tracking in a managed pipeline |
| Custom Python blocks with state persistence | T9 | Track pot size across frames (variable survives between frame callbacks) |
| Confidence threshold optimization | T1, T3, T6 | Per-class thresholds: high for card ID (0.7), lower for chip area (0.3) |
| Batch inference for non-real-time tasks | T13 | Post-hand chip counting verification, end-of-session analytics |

### 3.2 Inference Optimization
**What it solves**: Getting prediction speed fast enough for real-time dealing.
**Why it matters for poker**: Target = 30 FPS minimum for smooth card tracking during the pitch.
**Failure scenario**: Model runs at 12 FPS. During a fast pitch, cards move 3+ inches between frames. Tracker loses card identity.

| Skill | Source Transcript | Poker Application |
|---|---|---|
| TensorRT optimization on Jetson | T12 | 2-3× speedup on edge hardware |
| Model size vs accuracy tradeoff selection | T1, T16 | RF-DETR Nano (120 FPS iPhone) vs Large (higher accuracy) |
| Resolution scaling (640 vs 1024) | T1, T16 | 640 for real-time tracking, 1024 for showdown verification |
| Browser-based inference (inference.js) | T14 | Player-facing display showing pot size, no server round-trip |

---

## 4. TRACKING — Maintaining Identity Across Frames

### 4.1 Object Tracking
**What it solves**: Knowing that card X in frame N is the same physical card as card X in frame N+1.
**Why it matters for poker**: Without tracking, the system re-detects 52 anonymous cards every frame. With tracking, it knows "this specific card was dealt to seat 3."
**Failure scenario**: Tracker loses identity on a face-down card during the pitch. System can't determine which player received which card. The entire hand is untrackable.

| Skill | Source Transcript | Poker Application |
|---|---|---|
| ByteTrack (motion-based, Kalman filter) | T4 | Lightweight chip tracking during betting rounds |
| YOLO native tracking (BoT-SORT) | T7 | Quick-start option for card tracking without external libraries |
| SAM 2 pixel-level tracking | T17 | Highest quality card tracking — maintains identity through occlusion |
| Tracker initialization from detector prompts | T17 | RF-DETR detects cards → each detection seeds SAM 2 tracker |
| IOS (Intersection over Smaller area) matching | T17 | Match card classification to card tracking ID across models |
| Multi-frame consensus for identification | T17 | Lock card identity only after 3+ consistent reads across frames |

### 4.2 Counting and Zone Management
**What it solves**: How many objects are in a defined region.
**Why it matters for poker**: Chip counting IS pot calculation. Card counting per zone IS deal verification.
**Failure scenario**: Zone miscounts pot at showdown. $2,400 pot registered as $2,200. Player disputes. Casino liability.

| Skill | Source Transcript | Poker Application |
|---|---|---|
| PolygonZone (arbitrary geometry regions) | T3, T6 | Define pot zone, player zones, community card zone, burn pile zone |
| LineZone (crossing detection) | T4 | Detect when chips cross the betting line (bet confirmed) |
| Per-zone counting with multiple zones | T6 | Separate counts for each player's stack, the pot, and the rake box |
| `new_instances` event triggering | T4 | Fire event when new card enters community zone (flop/turn/river dealt) |
| Stateful counting with Redis | T9 | Persistent chip counts across system restarts |

---

## 5. DEPLOYMENT — Edge, Cloud, and Hybrid

### 5.1 Edge Deployment
**What it solves**: Running inference on hardware at the table, not in a remote data center.
**Why it matters for poker**: Network latency is unacceptable for real-time dealing. Edge = sub-10ms inference.
**Failure scenario**: WiFi drops for 2 seconds during a hand. Cloud-dependent system goes blind. Cards dealt with no detection. Entire hand corrupted.

| Skill | Source Transcript | Poker Application |
|---|---|---|
| NVIDIA Jetson deployment (Docker + TensorRT) | T12 | Primary compute unit per table |
| One-command device provisioning | T12 | Deploy to 100 tables in a casino floor simultaneously |
| Fleet management (heartbeat, logs, remote preview) | T12 | Monitor all tables from casino operations center |
| Device duplication for scaling | T12 | Clone configuration from Table 1 to Tables 2-50 |
| RTSP camera integration | T12 | Connect to existing casino surveillance cameras |
| Maintenance windows for model updates | T12 | Update card detection model at 4 AM, zero downtime during operation |

### 5.2 Cloud and Hybrid
**What it solves**: Offloading non-real-time tasks to the cloud.
**Why it matters for poker**: Edge handles real-time dealing; cloud handles analytics, model retraining, fleet-wide updates.
**Failure scenario**: Edge device runs out of storage. 48 hours of chip count data lost. No audit trail for regulatory compliance.

| Skill | Source Transcript | Poker Application |
|---|---|---|
| Serverless inference (auto-scaling, cold-start tradeoff) | T13 | Post-session hand history analysis |
| Dedicated deployment (pre-loaded models, low latency) | T13 | Backup inference path if edge device degrades |
| Batch processing (async, cost-efficient) | T13 | Nightly model evaluation across all recorded hands |
| WebRTC streaming (peer-to-peer video + JSON data) | T11 | Stream table view to floor manager with real-time annotations |

---

## 6. FAILURE HANDLING — When Perception Breaks

### 6.1 Detection and Tracking Failures
**What it solves**: Gracefully handling the inevitable moment when the model gets it wrong.
**Why it matters for poker**: A misread card is not a minor bug — it's a potential misdeal, a player dispute, or a regulatory violation.
**Failure scenario**: Model confidently (0.92) identifies 7♥ as 7♦. Pot awarded to wrong player. Casino eats a $5,000 loss.

| Skill | Source Transcript | Poker Application |
|---|---|---|
| Confidence-gated decisions | T1, T3, T16 | Card reads below 0.85 → re-scan or human verification |
| Mask cleanup for segmentation artifacts | T17 | Remove false card mask fragments after hand contact |
| MAD-based outlier detection | T17 | Flag chip counts that jump unrealistically between frames |
| Linear interpolation for missing data | T17 | Fill tracking gaps when card briefly occluded by dealer's hand |
| Temporal smoothing (sliding window) | T17 | Smooth chip stack height measurements across jittery frames |
| Multi-frame consensus before commitment | T17 | Never commit to card identity on single frame |
| Stub count verification | Deployment Bible | After every hand: count remaining deck to verify 52-card integrity |

### 6.2 System-Level Resilience
**What it solves**: Keeping the system running when individual components fail.
**Why it matters for poker**: A casino table generates $200-500/hour in rake. Every minute of downtime costs money.
**Failure scenario**: SAM 2 tracking crashes mid-hand. System has no fallback. Table stops dealing. 9 angry players. Floor manager called.

| Skill | Source Transcript | Poker Application |
|---|---|---|
| Graceful degradation (multiple model sizes) | T1, T16 | If Large model lags, auto-fallback to Nano |
| Edge device health monitoring | T12 | Alert ops center if GPU temperature exceeds threshold |
| Heartbeat + remote diagnostics | T12 | Detect and respond to table-level failures before players notice |
| State persistence across restarts (Redis) | T9 | Resume mid-hand after system restart without losing game state |
| Human-in-the-loop escalation | Skills/robotics-vision-control.md | Sub-threshold confidence → alert human dealer for verification |

---

## 7. PIPELINE ARCHITECTURE — Patterns from Production Systems

### 7.1 Multi-Model Pipeline Design
**What it solves**: Coordinating many specialized models into a coherent, reliable system.
**Why it matters for poker**: A poker vision system requires 10+ models. Without principled pipeline design, errors compound and debugging becomes impossible.
**Failure scenario**: 15-model pipeline fails silently. One model routes frames incorrectly and every downstream model produces wrong outputs. No error log. No alarm.

| Skill | Source Transcript | Poker Application |
|---|---|---|
| Classification-first routing (frame type → pipeline branch) | T20 (Blueprint Pro AI) | Classify frame as deal/betting/showdown before running any detection model |
| Task decomposition into specialized models (Blueprint Pro: 29 models) | T20 | Separate models for card detection, chip detection, player presence, card rank, chip denomination |
| Keypoint model repurposed for non-human geometric graphs | T20 | Encode card positional relationships (burn→community, flop cluster) as keypoint skeleton |
| Augmentation strategy by architecture type (OD vs segmentation) | T20 | 90° rotations for YOLO detectors; 5° rotations for instance segmentation masks |
| DPI/resolution matching between training and inference | T20 | Fix camera resolution at session start; assert it matches training resolution at pipeline init |
| Model version naming (API endpoint = dataset version number) | T20 | Every model in the pipeline carries its dataset version; mismatches are immediately visible |
| Domain expert as task decomposition partner, not just labeler | T20 | Poker expert defines what game states and edge cases matter; CV engineer implements them |
| Custom tiling inference when SAHI doesn't generalize | T20 | Build tile overlap strategy tuned to poker table geometry; don't assume SAHI defaults work |
| VLM as localized text extractor on detected region crops | T20 | After detecting pot zone, query VLM on the crop to extract chip denomination text |

### 7.2 Spatial Reasoning Patterns
**What it solves**: Determining relationships between objects (is this chip in the pot? is this seat occupied?) without requiring a dedicated classification model for every spatial query.
**Why it matters for poker**: Spatial relationships (chip in zone, card in seat, player at table) are the game state. Getting them right is the whole job.
**Failure scenario**: Proximity detection fails. Chip resting on zone boundary is not counted. Pot total is wrong by one chip's denomination. Player disputes.

| Skill | Source Transcript | Poker Application |
|---|---|---|
| Set-difference occupancy (all zones − occupied zones = empty zones) | T19 (Smart Parking) | all_seats − player_detected_seats = empty_seats; empty is never a trained class |
| Bounding box padding as proximity heuristic | T19 | Expand chip bbox horizontally to test overlap with zone boundary; tune padding as config constant |
| Non-class-aware detection consensus for set-difference deduplication | T19 | When merging renamed detection sets across a set-difference operation, disable class-awareness to prevent duplicate boxes |
| Static infrastructure from calibration, not real-time detection | T19 | Table zones, seat positions, pot area defined once at calibration; never re-detected per frame |
| OCR preprocessing pipeline order (contrast → rotation → crop → read) | T19 | For card rank/suit OCR: contrast stretch first, then deskew, then pass to classifier |
| Schema-first output design (typed, versioned JSON contract) | T19 | Define game-state output schema before writing pipeline; breaking the schema is a breaking change |

### 7.3 Production Reliability Patterns
**What it solves**: Building systems that degrade gracefully and learn from real-world failures.
**Why it matters for poker**: Casino deployment is not a demo. 8-12 hours continuous, real money, regulatory scrutiny.
**Failure scenario**: System detects correctly but downstream logic calculates wrong pot. No external validator catches it because nobody built one.

| Skill | Source Transcript | Poker Application |
|---|---|---|
| Expected-count validation (game-logic oracle compares vision output against known constraints) | T18 (PlayVision) | active_players + community_cards + burn_cards + stub_count must always sum to 52; violations halt dealing |
| Value transformation chain (boxes → geometry → events → statistics → decisions) | T18 | Never deliver bounding boxes as output; deliver structured game state |
| Controlled failure harvesting (version 1 = data collection event) | T18 | Instrument production deployment to capture every correction; that corpus becomes the retraining dataset |
| Threshold-based active learning routing | T20 | When human corrections exceed N per processed blueprint/hand, pre-annotate and route to reviewer queue |
| Detection stabilizer for video jitter before state machine events | T19 | Run temporal stabilization on all zone-membership decisions before triggering any game-state change |
