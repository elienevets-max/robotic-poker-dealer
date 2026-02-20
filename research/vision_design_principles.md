# Design Principles — Non-Obvious Lessons from 20 Roboflow Transcripts

These are not summaries of what the videos teach. These are the principles you WOULDN'T know unless you built the systems the videos describe, applied them to poker, and discovered where the assumptions break.

---

## Principle 1: Tracking Matters More Than Detection Accuracy

**The intuition**: Build the most accurate detector possible, then everything downstream works.

**The reality**: A 99% accurate detector that loses track of which card is which across frames is worse than a 90% accurate detector with bulletproof tracking. Detection tells you "there is a card here." Tracking tells you "this is the SAME card that was dealt to seat 3 six seconds ago." The second question is harder and more important.

**Evidence**: T17 (Basketball AI) used RF-DETR for detection but spent 3× more engineering effort on SAM 2 tracking integration, multi-frame consensus, IOS matching, and trajectory cleanup. T4 showed that adding ByteTrack to identical YOLO detection immediately made the system useful — detection alone was just a demo. T7 confirmed that native YOLO tracking (BoT-SORT) gave tracking "for free" but with lower quality than purpose-built solutions.

**Poker implication**: Invest more in tracking architecture than in squeezing an extra 2% out of the detector. A card misidentified in one frame is recoverable (multi-frame consensus). A card whose IDENTITY is lost mid-hand is not.

---

## Principle 2: Zone Logic Beats Pixel Logic

**The intuition**: Track every pixel precisely and derive game state from pixel-level information.

**The reality**: Define zones on the table (seat zones, pot zone, community zone, burn pile) and reduce the problem to "which zone is this object in?" This is orders of magnitude more robust than continuous spatial tracking.

**Evidence**: T3 and T6 demonstrated PolygonZone — arbitrary regions where counting happens. T4 showed LineZone for crossing detection. T17 used zone-based reasoning to associate jersey numbers with players (IOS containment). In every case, the zone abstraction eliminated classes of spatial error that pixel-level tracking couldn't handle.

**Poker implication**: Don't continuously compute card positions in millimeters. Instead: card enters seat_3 zone → card belongs to seat 3. Period. Even if tracker glitches and says the card moved to seat 5 for one frame, the zone-lock overrides the tracker. Events (zone entry/exit) are more reliable than continuous state (position).

---

## Principle 3: NMS-Free Detection is Not Optional for Stateful Systems

**The intuition**: NMS (Non-Maximum Suppression) is a standard post-processing step. All detectors have it. It's fine.

**The reality**: NMS introduces non-deterministic flickering when detection confidence hovers near the threshold. In a single-frame demo, this is invisible. In a multi-frame system with tracking and state management, it creates phantom events: objects appearing and disappearing frame-to-frame, triggering false state transitions.

**Evidence**: T16 (RF-DETR) was explicitly designed to be NMS-free and the presenters identified NMS jitter as a core problem. The Basketball AI pipeline (T17) chose RF-DETR specifically for this reason — smoother input to SAM 2 tracking. YOLO-based videos (T1-T5) never mentioned this because they were single-frame demos.

**Poker implication**: Use RF-DETR, not YOLO, as the primary detector. A "ghost card" appearing for one frame and disappearing is not just a cosmetic glitch — it can trigger a misdeal detection, an incorrect card count, or a phase transition error. NMS jitter in a casino = regulatory risk.

---

## Principle 4: Unsupervised Methods Generalize; Supervised Methods Memorize

**The intuition**: Label everything meticulously and train supervised classifiers for maximum accuracy.

**The reality**: Supervised models learn the specific dataset they were trained on. New chip colors, new card decks, new table felts — each requires new labeled data and retraining. Unsupervised methods (clustering, embedding similarity) adapt to new domains with zero labeling.

**Evidence**: T17's team clustering (SigLIP + UMAP + KMeans) required zero labeled team data and worked on any game with any jerseys. The Basketball AI team explicitly rejected supervised team classification because "if the team showed up in new pink jerseys for the first time, our model wouldn't know how to handle this." T10 showed how supervised models need careful class-balanced datasets.

**Poker implication**: Use unsupervised clustering for chip denomination detection. Each casino has different chip colors. Each chip set ages differently. A supervised "this shade of red = $5" model will fail at every new casino. A SigLIP embedding + clustering approach works everywhere, calibrated in seconds at session start.

---

## Principle 5: The VLM Needs Guardrails, Not Trust

**The intuition**: Fine-tuned vision-language models are smart enough to read cards and chips accurately.

**The reality**: VLMs hallucinate. T17 showed SmallVLM2 producing impossible jersey numbers (011, 3000) even after fine-tuning to 86% accuracy. They will read cards that don't exist, report suits that are wrong, and do so with high confidence.

**Poker implication**: Never use raw VLM output as ground truth. Every VLM read must pass through:
1. **Output constraint**: Only 52 valid card values. Reject anything else.
2. **Deck constraint**: No duplicates in a single deck. If Ace of Spades is already detected, a second Ace of Spades is a misread.
3. **Multi-frame consensus**: 3+ agreeing frames before locking identity.
4. **Confidence gating**: Below 0.85 → re-scan with higher resolution or escalate to human.

---

## Principle 6: Real-Time Means No Post-Processing

**The intuition**: Build the best pipeline possible, optimize later.

**The reality**: Many powerful techniques demonstrated in the transcripts explicitly cannot run in real-time. T17's trajectory cleanup (MAD outlier detection + interpolation + smoothing) needs the FULL trajectory before it can process. SAM 2 Large runs far below real-time. Batch inference (T13) is designed for async processing.

**Poker implication**: Split the pipeline into two paths:
- **Real-time path** (must complete within 33ms per frame): Detection (RF-DETR Nano or S) → Lightweight tracking (ByteTrack or SAM 2 Tiny) → Zone counting → State machine updates → Action prompts
- **Verification path** (runs async, 1-5 second latency acceptable): High-resolution card re-scan → Multi-frame consensus → Pot calculation verification → Audit logging

The real-time path makes the game flow. The verification path catches the real-time path's mistakes.

---

## Principle 7: Fixed Cameras Are a Massive Competitive Advantage

**The intuition**: Our computer vision problem is as hard as sports analytics.

**The reality**: It's significantly EASIER in one critical dimension. Basketball AI (T17) spent enormous effort on dynamic camera homography — computing a new 3×3 matrix every frame because the camera pans and tilts. Poker tables have fixed, overhead cameras. Homography computed once at installation. Verified daily. Recalibrated only if hardware moves.

**Poker implication**: This is poker's secret advantage over every sports vision system. Don't over-engineer the spatial mapping layer. A static homography matrix with periodic verification is sufficient. Invest the engineering budget saved here into card classification accuracy instead.

---

## Principle 8: Occluded Objects Should Be Event-Locked, Not Re-Detected

**The intuition**: When an object is occluded, wait for it to reappear and re-detect it.

**The reality**: Re-detection after occlusion is unreliable, especially for identical-looking objects (face-down cards). T17's SAM 2 handles re-entry well for visually distinct objects but struggles when tracked objects look similar (same jersey color, noted in T15's re-ID weakness discussion).

**Poker implication**: Once a card is dealt to a seat, that assignment is an EVENT stored in the state machine. It does not need to be continuously re-verified by vision. The card was seen entering seat 3's zone → it belongs to seat 3 until it leaves seat 3's zone (fold or showdown). If vision loses the card during a player's peek (hands covering cards), the state machine knows the card is still there. Don't let tracking failures override event history.

---

## Principle 9: Edge Deployment is Non-Negotiable for Casino Operations

**The intuition**: Cloud inference is easier to deploy and maintain.

**The reality**: Cloud inference has three casino-killing problems: (1) Network dependency — WiFi drops or latency spikes halt the game. (2) Privacy — streaming unencrypted card values over the network is a security catastrophe. (3) Latency — even 100ms cloud round-trip (T13 cold-start) is perceptible during fast dealing.

**Evidence**: T12 (Jetson deployment) showed the full edge stack: Docker container, TensorRT optimization, RTSP cameras, fleet management. T11 (WebRTC) demonstrated peer-to-peer streaming that stays local. T13 (Cloud) explicitly positioned serverless as having "cold-start" latency problems.

**Poker implication**: All real-time inference runs on a Jetson Orin (or equivalent) mounted under or near the table. Cloud is for: model training, fleet-wide updates, analytics dashboards, long-term audit storage. Never for real-time game decisions. The edge device must operate fully autonomously during network outages.

---

## Principle 10: Multi-Model Pipelines Are Inevitable — Plan for the Glue Code

**The intuition**: Find one model that does everything.

**The reality**: T17 required SIX models (RF-DETR + SAM 2 + SigLIP + SmallVLM2 + YOLO11 Keypoint + Homography math). Each model is excellent at its specific task and terrible at everything else. The engineering effort is not in the models — it's in the glue between them.

**Evidence**: T17 spent months on: matching RF-DETR outputs to SAM 2 inputs (prompt format conversion), matching SAM 2 masks to SmallVLM2 crops (IOS matching), matching keypoint outputs to homography math (coordinate system conversion), and temporal event tracking (state machine wrapping around detections).

**Poker implication**: Budget 70% of engineering effort on integration, not models. The models are (mostly) solved. The hard problems are:
- Detection format → Tracking prompt format (RF-DETR boxes → SAM 2 prompts)
- Tracking IDs → Classification associations (IOS matching)
- Classification outputs → State machine inputs (constrained card identity)
- State machine events → Actuator commands (when to pitch, when to push pot)
- Error propagation management (one model's mistake cascading through the chain)

---

## Principle 11: Self-Labeling Bootstraps Data Collection

**The intuition**: You need a large manually-labeled dataset before you can train anything.

**The reality**: Use a pre-trained model to auto-label your data, then manually correct only the mistakes. T17 used base SmallVLM2 to auto-annotate 3,600 jersey number crops, then manually reviewed and fixed errors. T10 showed model-assisted labeling as a core Roboflow feature.

**Poker implication**: Bootstrap the card dataset:
1. Use a generic card detection model (even a basic one) to auto-label 10,000 frames
2. Human reviews and corrects ~15% error rate = 1,500 manual fixes instead of 10,000 manual labels
3. Fine-tune on corrected dataset
4. Use improved model to re-label next batch with ~5% error rate
5. Iterate until error rate < 1%

This collapses months of annotation work into days.

---

## Principle 12: The Closed-World Advantage

**The intuition**: Poker vision is just another object detection problem.

**The reality**: Poker is a CLOSED system. 52 cards in a deck. Known number of players (2-10). Known table geometry. Known chip denominations. Known game rules. This is radically different from open-world detection (T15: SAM 3 designed for arbitrary objects in arbitrary scenes).

**Poker implication**: Exploit every constraint:
- If 51 cards are accounted for, the 52nd is deterministic — you don't even need vision for it
- If 9 players are dealt 2 cards each = 18 cards, 3 burns, 5 community = 26 known cards, 26 remaining in stub. Verify.
- Chip denominations are finite and known per casino. Classification is a lookup, not open-ended
- Table geometry is fixed. Zone boundaries are constant. No dynamic scene understanding needed.

Open-world CV is hard. Closed-world CV with domain constraints is dramatically easier. Every poker-specific constraint you encode is a free accuracy boost that requires zero additional training data.

---

## Principle 13: The Deliverable Is Never a Bounding Box

**The intuition**: Build a good detector, output the detections, let the application consume them.

**The reality**: Bounding boxes are the rawest, most error-prone, least useful output a vision system can produce. Every production system demonstrated in the transcripts transforms detections through multiple layers before the output is usable: detection → zone assignment → event → count → statistic → decision. PlayVision (T18) made this explicit: the product is coaching analytics, not player bounding boxes. Blueprint Pro AI (T20) outputs a material quantity list, not detected wall polygons.

**Poker implication**: Define the output schema before writing the pipeline. The game-state schema — `{hand_id, street, community_cards, pot, active_seats, current_action}` — is the product. Every model, every tracker, every zone counter exists to produce that schema accurately. If a model can't contribute to that schema, it's the wrong model.

---

## Principle 14: Empty Is Not a Class — It's the Absence of Occupancy

**The intuition**: Train a model to detect empty seats, empty pot zones, empty card positions.

**The reality**: Training an "empty" class creates a labeling problem without a solution: how do you annotate the absence of something? What does an "empty seat" look like vs a "seat about to be occupied"? The Smart Parking transcript (T19) made this concrete: the system never trains an "empty stall" class. It detects cars, subtracts occupied stalls from all known stalls, and derives empty as the residual.

**Poker implication**: Never train an "empty" class for any zone. Define all zones at calibration (they're static). Detect objects. Zone state = detected objects within zone boundaries. Empty = no detections. This eliminates an entire category of labeling ambiguity and training data cost.

---

## Principle 15: Give the Model an Easy Task

**The intuition**: One large, powerful model handles everything better than many small specialized models.

**The reality**: Blueprint Pro AI (T20) arrived at 29 models not by design but by necessity. Each time a new object category was added (walls, windows, plumbing, electrical), a new specialized model was required. The CTO stated the design principle explicitly: "give the model an easy task and your success rate of keeping consistency will increase." Models trained to do one thing well produce more reliable, debuggable outputs than multi-task models.

**Poker implication**: Don't try to train one model that detects cards AND counts chips AND identifies players AND reads denominations. Each task is visually distinct. Each has different error consequences. Each has different accuracy requirements. Decompose into: card detector, chip detector, player detector, card classifier, chip denomination classifier. Test and improve each independently. The integration is your engineering challenge — but the models themselves should each be easy.

---

## Principle 16: Match Training Resolution to Inference Resolution

**The intuition**: Train on available data at whatever resolution is convenient. Resize at inference.

**The reality**: Blueprint Pro AI (T20) controls the DPI at which PDFs are rasterized and uses the exact same DPI for both training and inference. This eliminates training-inference distribution mismatch at the source. The Audi car manual app (mentioned in T20) failed initially because DSLR-trained models deployed to phone cameras — same mismatch, different cause. Resolution is not a free variable.

**Poker implication**: Fix your camera resolution, focal length, and mounting height before generating training data. All training frames must be captured from the same camera configuration that will run in production. If you must use a different camera during development, calibrate the pixel-per-mm ratio and assert it matches at inference time. A resolution mismatch degrades every model in the pipeline simultaneously with no obvious error signal.

---

## Principle 17: The First Production Deployment Is a Data Collection Event

**The intuition**: Build the best possible system, then deploy it. Fix bugs as they appear.

**The reality**: PlayVision's Marc Zoghby (T18) stated it directly: "your first product's encounter with reality is probably not going to go well — that's how you learn the most." The failure cases that production reveals are the most valuable training data you will ever collect. They are more diverse, more realistic, and more representative than anything you can simulate or collect in a lab.

**Poker implication**: Design the logging infrastructure before the model. Every production inference run should capture: the raw frame, the detection outputs, the confidence scores, any human override, and the final ground truth (which player actually won). A production deployment without comprehensive logging is burning the most valuable data you will ever see. The first pilot table is not where you prove the system works. It is where you collect the data that makes the system work on the second table.
