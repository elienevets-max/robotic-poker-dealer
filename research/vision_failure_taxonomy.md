# Failure Taxonomy — Top 20 Perception Failures in Casino Poker

Every failure is ranked by severity (how bad it is when it happens) and frequency (how often it will happen). Failures are ordered by **risk score** = severity × frequency.

Severity scale: 1 (cosmetic) → 5 (catastrophic — regulatory violation or financial loss)
Frequency scale: 1 (rare edge case) → 5 (every session)

---

## Rank 1: Card Misidentification at Showdown
**Risk: 25 (Severity 5 × Frequency 5)**

**What happens**: VLM reads 7♥ as 7♦, or Q♠ as Q♣. Pot awarded to wrong player.
**Why it happens**: Suit symbols are small (~4mm on standard cards), colors are similar (♥/♦ both red, ♠/♣ both black), and cards may be partially covered by player's hand.
**Roboflow tooling helps**: SmallVLM2 fine-tuning (T17) pushes accuracy from ~56% to ~86% on similar OCR tasks. Constrained output vocabulary (52 cards) further reduces errors.
**Roboflow tooling fails**: 86% means 14% error rate. At 30 hands/hour with 5 showdowns/hour and 2 cards per player — that's still multiple misreads per hour.
**Hardening**: Multi-frame consensus (T17): never commit to card ID on a single frame. Require 3+ agreeing frames. Resolution upscaling at showdown (RF-DETR multi-resolution, T16). Dual-camera cross-verification. Human escalation below 0.95 confidence.

---

## Rank 2: Chip Count Error in Pot Calculation
**Risk: 20 (Severity 5 × Frequency 4)**

**What happens**: System counts $2,200 in the pot when the actual amount is $2,400. Player disputes.
**Why it happens**: Chip stacks occlude each other. Same-color chips from different angles look like different denominations. Chips stacked 20-high can't be individually counted by overhead camera.
**Roboflow tooling helps**: SigLIP clustering (T17) identifies denominations. PolygonZone (T3, T6) isolates pot area.
**Roboflow tooling fails**: No transcript addresses chip STACK counting. All counting examples are individual objects, not stacked objects where only the top is visible.
**Hardening**: Side-angle cameras for stack height estimation. Assume standard stack heights (20 chips = known height per denomination). Track chips IN (bets) rather than counting pot directly — cumulative tracking is more reliable than snapshot counting.

---

## Rank 3: Tracker ID Swap Between Cards
**Risk: 20 (Severity 5 × Frequency 4)**

**What happens**: SAM 2 swaps the identity of two face-down cards during a close overlap. Card dealt to seat 3 is now registered as belonging to seat 5.
**Why it happens**: Face-down cards look identical (same card back). When two cards briefly overlap or pass close together, the tracker's visual embeddings can't distinguish them — they share the same texture/color.
**Roboflow tooling helps**: SAM 2's pixel-level tracking is better than ByteTrack for occlusion (T17).
**Roboflow tooling fails**: SAM 2 tracks by visual appearance. Identical card backs = identical embeddings = inevitable ID swaps. T15 explicitly noted SAM's re-ID weakness.
**Hardening**: Zone-based assignment — once a card enters a seat zone, lock its assignment regardless of subsequent tracking artifacts. Cards don't teleport between seats. If tracker says card moved from seat 3 to seat 5 without passing through intermediate zones, override the tracker.

---

## Rank 4: Exposed Card Not Detected (Misdeal Missed)
**Risk: 16 (Severity 4 × Frequency 4)**

**What happens**: A card flashes face-up during the deal. System doesn't detect it. Hand plays out. Player later claims they saw a card.
**Why it happens**: Card is face-up for 1-2 frames only (50-100ms at 30fps). Detection model needs the card to be face-up for multiple frames to register with confidence. Motion blur during pitch makes rank/suit unreadable.
**Roboflow tooling helps**: Higher FPS cameras (T3, T7 webcam demos). Lower confidence threshold for card_exposed class.
**Roboflow tooling fails**: No transcript addresses detecting objects that exist for only 1-2 frames. All examples assume objects persist for many frames.
**Hardening**: 60 FPS minimum camera. Ultra-low confidence threshold (0.2) for card_exposed — better to flag false positives (human reviews) than miss a real exposure. Track card ORIENTATION (face-up vs face-down) as a continuous angle, not a binary class.

---

## Rank 5: Lighting Change Causes Cascade Failure
**Risk: 15 (Severity 3 × Frequency 5)**

**What happens**: Casino changes light bulbs. New lighting shifts color temperature. Red chips now look orange. Suit colors shift. Model confidence drops across all classes.
**Why it happens**: All models are trained on specific lighting conditions. Color-dependent classifications (suits, chip denominations) are especially vulnerable.
**Roboflow tooling helps**: DINOv2 backbone in RF-DETR (T16) is more robust to domain shift than YOLO. Data augmentation during training can simulate lighting variation (T1, T5).
**Roboflow tooling fails**: No transcript addresses runtime lighting adaptation. All assume static lighting conditions.
**Hardening**: Re-run chip clustering (SigLIP + KMeans, T17) whenever lighting changes — unsupervised, takes seconds. Include diverse lighting in training data. Monitor per-class confidence averages — if they drop 10%+ from baseline, trigger recalibration alert.

---

## Rank 6: NMS Jitter Causes Ghost Cards
**Risk: 12 (Severity 4 × Frequency 3)**

**What happens**: YOLO's NMS suppresses a card detection in frame N, includes it in frame N+1, suppresses again in N+2. Tracker sees card appearing and disappearing. State machine registers phantom card events.
**Why it happens**: NMS is non-deterministic when confidence scores hover near the threshold. Two overlapping detections trade "winner" status frame to frame (T16 explicitly identifies this problem).
**Roboflow tooling helps**: RF-DETR is NMS-free (T16). Eliminates this entire failure class.
**Roboflow tooling fails**: If using YOLO as fallback, jitter returns.
**Hardening**: Use RF-DETR as primary detector. If YOLO fallback required, add temporal smoothing: suppress detections that don't persist for 3+ consecutive frames.

---

## Rank 7: SAM 2 Slowdown Under Load
**Risk: 12 (Severity 3 × Frequency 4)**

**What happens**: SAM 2 tracking 20+ objects (10 players × 2 cards) exceeds Jetson Orin's capacity. Frame rate drops below 15 FPS. System falls behind real-time.
**Why it happens**: SAM 2's memory bank grows linearly per tracked object (T15). Each object stores high-dimensional embeddings across frames. 20 objects = 20× memory cost.
**Roboflow tooling helps**: SAM 2 Tiny (39M params) is 5-6× faster than Large (T17).
**Roboflow tooling fails**: T17 explicitly states SAM 2 is "by far the slowest part of the entire pipeline." Even Tiny may be insufficient for 20+ objects at 30+ FPS.
**Hardening**: Only track cards with SAM 2 (max 10 in play). Track chips with ByteTrack (lighter). Clear SAM 2 memory bank between hands. Consider SAM 2 for deal phase only, switch to zone-based tracking once cards are stationary.

---

## Rank 8: Homography Error from Chip Stack Height
**Risk: 10 (Severity 2 × Frequency 5)**

**What happens**: Chip stack top is detected as the chip position. Homography (which assumes flat plane) projects the top of a tall stack to the wrong table coordinate. A chip stack at seat 3 appears to be in the pot zone.
**Why it happens**: T17 explicitly identified this: homography breaks when objects leave the flat plane (basketball players jumping). Chip stacks are the poker equivalent — they have significant height.
**Roboflow tooling helps**: Bottom-center anchor point selection (T17 used this for players).
**Roboflow tooling fails**: Bottom of a chip stack is occluded by the stack itself. Can't detect what you can't see.
**Hardening**: Use bottom edge of chip stack bounding box, not center. Side-angle camera for direct stack measurement. Calibrate known chip stack heights per denomination.

---

## Rank 9: Player Hand Occludes Cards During Peek
**Risk: 10 (Severity 2 × Frequency 5)**

**What happens**: Player cups hands over hole cards to peek. Overhead camera can't see cards. Tracker loses visual features. When player removes hands, tracker may fail to re-associate.
**Why it happens**: This is standard player behavior — happens 2+ times per hand per player. The cards are completely invisible for 2-5 seconds each time.
**Roboflow tooling helps**: SAM 2 memory bank preserves identity through temporary disappearance (T17). Zone-locked tracking — card was in seat 3 zone before occlusion, still in seat 3 zone after.
**Roboflow tooling fails**: If occlusion lasts too long, SAM 2 memory degrades.
**Hardening**: Zone-lock: once a card is assigned to a seat, it stays assigned until it physically leaves that seat zone (muck or showdown). Card assignment is EVENT-based (deal event), not continuously re-verified.

---

## Rank 10: Fold Detection Ambiguity
**Risk: 9 (Severity 3 × Frequency 3)**

**What happens**: Player pushes cards forward but doesn't clearly muck. System can't determine if this is a fold or just card repositioning.
**Why it happens**: No clear visual boundary between "cards pushed slightly forward" and "cards mucked." Human dealers rely on verbal declaration + physical gesture together. Vision alone is ambiguous.
**Roboflow tooling helps**: Zone-based detection — if cards cross bet line (LineZone from T4), register as fold.
**Roboflow tooling fails**: No transcript addresses the ambiguity of continuous motion vs discrete action. All examples have clear binary states.
**Hardening**: Define fold_zone polygon beyond the bet line. Cards must enter fold_zone AND stay for 1+ second. Combine with audio detection (verbal "fold") if available. When ambiguous, prompt player for confirmation.

---

## Rank 11: Burn Card Visibility Leak
**Risk: 9 (Severity 3 × Frequency 3)**

**What happens**: Burn card is briefly face-up during the burn motion. System detects the card value. Even though it's not in play, the detection contaminates the hand state.
**Why it happens**: Deployment Bible emphasizes that burn cards must NEVER be visible. But robot arm movement isn't perfectly opaque — camera may catch a flash.
**Roboflow tooling helps**: card_exposed detection class (very low confidence threshold).
**Roboflow tooling fails**: Same 1-2 frame detection problem as Rank 4.
**Hardening**: Physical solution: burn card mechanism that physically covers the card during the burn motion. Software: detect burn card zone entries, explicitly exclude those cards from hand state unless card_exposed trigger fires.

---

## Rank 12: Duplicate Card Detection (52-Card Integrity Failure)
**Risk: 8 (Severity 4 × Frequency 2)**

**What happens**: System reads two different physical cards as the same card (e.g., two K♠ detected). Impossible in a standard deck. Indicates a misread.
**Why it happens**: Classification error. Two visually similar cards (K♠ and K♣, or worn/damaged cards) both classified as the same card.
**Roboflow tooling helps**: Constrained output vocabulary. Multi-frame consensus reduces error rate.
**Roboflow tooling fails**: No transcript addresses logical consistency checks on classification outputs.
**Hardening**: Real-time 52-card constraint engine: maintain a set of detected cards. If a duplicate appears, flag BOTH detections for re-verification. The deck is a closed system — exploit this.

---

## Rank 13: Fast Pitch Causes Tracking Dropout
**Risk: 8 (Severity 2 × Frequency 4)**

**What happens**: Card pitched at high speed crosses 3+ seat zones between frames. Tracker can't determine which seat received it.
**Why it happens**: At 30 FPS with cards moving 20+ inches/second, the card can travel its own length between frames. Motion blur makes mid-flight detection unreliable.
**Roboflow tooling helps**: Higher FPS (60 FPS camera), motion-based prediction in ByteTrack (T4).
**Roboflow tooling fails**: No transcript demonstrates tracking objects moving at poker-pitch speeds (20-30 inches/second).
**Hardening**: 60 FPS camera. Don't track cards IN FLIGHT — track card DEPARTURES from deck zone and card ARRIVALS in seat zones. The flight path doesn't matter; only origin and destination do.

---

## Rank 14: Multi-Deck Confusion (Card Back Pattern)
**Risk: 8 (Severity 4 × Frequency 2)**

**What happens**: Casino uses two decks (alternating hands). Cards from previous hand's deck are misidentified as current deck. System counts 104 cards.
**Why it happens**: Two decks with different back colors/patterns. If tracker doesn't reset cleanly between hands, residual detections from the off-deck persist.
**Roboflow tooling helps**: Hard tracking reset between hands (clear all SAM 2 memory).
**Roboflow tooling fails**: No transcript addresses multi-deck rotation protocols.
**Hardening**: Detect deck-back-color as a class attribute. Ignore detections matching the off-deck pattern. Hard-reset all tracking state between hands.

---

## Rank 15: Chip Splash (Unstructured Bet)
**Risk: 6 (Severity 3 × Frequency 2)**

**What happens**: Player throws chips into the pot in an unstructured manner ("splashing the pot"). Chips scatter, overlap, and can't be individually counted.
**Why it matters**: Casino rules prohibit splashing the pot, but players do it. Human dealers reconstruct the bet amount; the vision system must too.
**Roboflow tooling helps**: Object counting within PolygonZone (T3, T6).
**Roboflow tooling fails**: Counting examples assume separated, non-overlapping objects. Splashed chips are piled and overlapping.
**Hardening**: Track chips BEFORE the splash (in player's hand as a stack) and count them then. Track the delta in the player's visible stack before/after. Use the pre-splash stack count, not the post-splash pot count.

---

## Rank 16: Glare/Reflection on Card Surface
**Risk: 6 (Severity 2 × Frequency 3)**

**What happens**: Overhead light creates a white glare spot on a card's surface, obscuring the rank or suit.
**Why it happens**: Casino cards have a slight gloss. At certain angles, overhead lighting produces specular reflection.
**Roboflow tooling helps**: Data augmentation with brightness/contrast variation during training (T1, T5). Multi-angle camera can see past the glare from a different position.
**Roboflow tooling fails**: No transcript addresses specular reflection on small objects.
**Hardening**: Matte-finish cards (already common in casinos). Diffused overhead lighting. Side-angle camera as backup view. Polarizing filter on camera lens.

---

## Rank 17: Side Pot Miscalculation
**Risk: 6 (Severity 3 × Frequency 2)**

**What happens**: Three-way all-in with unequal stacks. System incorrectly calculates side pot amounts. Wrong player receives wrong pot.
**Why it happens**: This is a state machine error, not a pure vision error. But it's triggered by vision: incorrect chip count → incorrect stack sizes → incorrect side pot math.
**Roboflow tooling helps**: Zone-based chip counting per seat (T6).
**Roboflow tooling fails**: No transcript demonstrates multi-zone chip counting for pot isolation.
**Hardening**: Use the Deployment Bible Section 6 algorithm: sort stacks smallest-first, isolate pots by stack size. Cross-verify vision count against cumulative bet tracking.

---

## Rank 18: Dealer Button Detection Failure
**Risk: 4 (Severity 2 × Frequency 2)**

**What happens**: System loses track of the dealer button. Doesn't know which seat is the button, so blinds and action order are wrong.
**Why it happens**: Button is small, sometimes obscured by chips or player's arm. If detection fails for several frames, the system may lose button position.
**Roboflow tooling helps**: Object detection with low confidence threshold.
**Roboflow tooling fails**: Trivial detection problem — button is a known object in a predictable location.
**Hardening**: Button position is event-driven (moves one seat left per hand). Vision CONFIRMS button position; it doesn't determine it. If vision can't find the button, use last known position + 1.

---

## Rank 19: Background Player/Spectator Interference
**Risk: 4 (Severity 1 × Frequency 4)**

**What happens**: Spectators or passing players are detected as seated players. Their hands/chips are incorporated into game state.
**Why it happens**: Detection model can't distinguish seated players from bystanders.
**Roboflow tooling helps**: PolygonZone (T3, T6) restricts detections to the table area.
**Roboflow tooling fails**: Spectators leaning over the rail may enter the table zone polygon.
**Hardening**: Define tight seat zones. Only track objects within defined seat polygons. Ignore detections outside the table boundary. Require minimum detection persistence (3+ seconds) before registering new player.

---

## Rank 20: Model Confidence Drift Over Time
**Risk: 4 (Severity 2 × Frequency 2)**

**What happens**: Over weeks/months, model accuracy silently degrades. Cards get worn and dirty. Lighting bulbs age. Felt color changes from use.
**Why it happens**: The real world changes; the model doesn't. This is distributional drift.
**Roboflow tooling helps**: Active learning loop (T10) catches low-confidence samples. Fleet monitoring (T12) tracks performance metrics.
**Roboflow tooling fails**: No transcript demonstrates automated drift detection or model retraining triggers.
**Hardening**: Monitor mean confidence per class per day. If 7-day rolling average drops 5%+, trigger recalibration pipeline: (1) collect 500 new frames, (2) run model-assisted labeling, (3) human review, (4) fine-tune, (5) A/B deploy. Automate this cycle.
