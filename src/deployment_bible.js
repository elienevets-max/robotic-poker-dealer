const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, LevelFormat, PageBreak, PageNumber } = require("docx");

// ── Styles ──
const NAVY = "1B3A5C";
const DARK = "2C3E50";
const ACCENT = "C0392B";
const LIGHT_BG = "F0F4F8";
const WHITE = "FFFFFF";

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, font: "Arial", color: NAVY })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, bold: true, size: 26, font: "Arial", color: DARK })]
  });
}

function h3(text) {
  return new Paragraph({
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, bold: true, size: 22, font: "Arial", color: ACCENT })]
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160, line: 276 },
    children: [new TextRun({ text, size: 21, font: "Arial", color: "333333", ...opts })]
  });
}

function boldPara(label, text) {
  return new Paragraph({
    spacing: { after: 160, line: 276 },
    children: [
      new TextRun({ text: label, size: 21, font: "Arial", bold: true, color: DARK }),
      new TextRun({ text, size: 21, font: "Arial", color: "333333" })
    ]
  });
}

function specRow(task, detail, robotReq) {
  return new TableRow({
    children: [
      new TableCell({
        borders, width: { size: 2400, type: WidthType.DXA }, margins: cellMargins,
        children: [new Paragraph({ children: [new TextRun({ text: task, size: 20, font: "Arial", bold: true })] })]
      }),
      new TableCell({
        borders, width: { size: 4000, type: WidthType.DXA }, margins: cellMargins,
        children: [new Paragraph({ children: [new TextRun({ text: detail, size: 20, font: "Arial" })] })]
      }),
      new TableCell({
        borders, width: { size: 2960, type: WidthType.DXA }, margins: cellMargins,
        children: [new Paragraph({ children: [new TextRun({ text: robotReq, size: 20, font: "Arial", color: ACCENT })] })]
      }),
    ]
  });
}

function headerRow(c1, c2, c3) {
  return new TableRow({
    children: [c1, c2, c3].map((text, i) =>
      new TableCell({
        borders, width: { size: [2400, 4000, 2960][i], type: WidthType.DXA }, margins: cellMargins,
        shading: { fill: NAVY, type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun({ text, size: 20, font: "Arial", bold: true, color: WHITE })] })]
      })
    )
  });
}

function classified() {
  return new Paragraph({
    spacing: { after: 80 },
    alignment: AlignmentType.CENTER,
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: ACCENT } },
    children: [new TextRun({ text: "CONFIDENTIAL \u2014 NOT FOR DISTRIBUTION", size: 18, font: "Arial", bold: true, color: ACCENT })]
  });
}

// ── Document Content ──
const sections = [];

// ── COVER PAGE ──
sections.push({
  properties: {
    page: {
      size: { width: 12240, height: 15840 },
      margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
    }
  },
  headers: { default: new Header({ children: [classified()] }) },
  footers: {
    default: new Footer({
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Page ", size: 18, font: "Arial" }), new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Arial" })]
      })]
    })
  },
  children: [
    new Paragraph({ spacing: { before: 3000 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "ROBOTIC POKER DEALER", size: 56, bold: true, font: "Arial", color: NAVY })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: "DEPLOYMENT SPECIFICATION", size: 44, bold: true, font: "Arial", color: ACCENT })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: NAVY } },
      children: [new TextRun({ text: "Technical Requirements for Autonomous Casino Poker Dealing", size: 24, font: "Arial", color: DARK })]
    }),
    new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "A Domain Expert\u2019s Guide for Robotics Engineering Teams", size: 22, font: "Arial", italics: true, color: "666666" })]
    }),
    new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Compiled from 10,000+ hours of live casino poker observation,", size: 20, font: "Arial", color: "666666" })]
    }),
    new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "professional dealer training materials (TruePokerDealer curriculum), and operator interviews.", size: 20, font: "Arial", color: "666666" })]
    }),
    new Paragraph({ spacing: { before: 800 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Version 2.0 \u2014 February 2026", size: 20, font: "Arial", color: "999999" })]
    }),
    new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "CONFIDENTIAL \u2014 Prepared for authorized recipients only", size: 18, font: "Arial", bold: true, color: ACCENT })]
    }),
  ]
});

// ── MAIN BODY ──
const body = [];

// ── 1. PURPOSE ──
body.push(h1("1. Purpose of This Document"));
body.push(para("This specification translates the complete operational reality of professional casino poker dealing into technical requirements that a robotics engineering team can use to design, build, and deploy an autonomous poker dealing system. It is not a rulebook. Rulebooks exist. This document captures what rulebooks miss: the physical mechanics, edge cases, failure modes, player psychology, and regulatory context that only exist in the heads of people who have spent thousands of hours at casino poker tables."));
body.push(para("No robotics company currently building humanoid or robotic arm systems has internal expertise on what a poker dealer actually does at the level of detail required to build a product that would survive contact with real casino players. This document fills that gap."));
body.push(para("The document is organized around the complete dealing cycle, from shuffle to pot push, with each section structured as: what the dealer does, why they do it, what goes wrong when it is done incorrectly, and what a robotic system must be capable of to replicate or exceed the task."));

// ── 2. THE COMPLETE SHUFFLE SEQUENCE ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("2. The Complete Shuffle Sequence"));
body.push(para("The shuffle is the first thing a dealer does when they sit down at a table and the first thing they do at the start of every hand when no automatic shuffler is present. It is also one of the primary areas where game integrity is established or compromised. A robotic dealer must execute this sequence with perfect consistency every time."));

body.push(h2("2.1 The Casino Poker Shuffle (Standard Sequence)"));
body.push(para("The professional casino poker shuffle follows a strict sequence: Wash, Collect, Square, Riffle, Riffle, Box, Riffle, Cut, Place in Deal Position. Each step serves a specific randomization or security purpose. As demonstrated in the TruePokerDealer curriculum (Lessons 1-2), the shuffle is the single skill that requires the most repetition to master. Training involves doing each step slowly and correctly hundreds of times until the finger positions become automatic. Speed comes only after form is locked in; rushing the learning process creates bad habits that are extremely difficult to unlearn later."));

body.push(h3("Wash"));
body.push(para("The wash (also called a scramble) is performed by spreading all 52 cards face-down across the felt and mixing them with both hands in a circular swirling motion. Every card face must touch the felt at least once. A standard wash lasts approximately 7 seconds. A mini-wash (used between hands when time is a factor) lasts 2 to 3 seconds. The wash is the primary randomization step. It ensures that cards which were grouped together from the previous hand are separated before the mechanical shuffle begins. A full wash is only required when the deck is 100% suited (all cards in sequential order, such as a brand new deck). Between hands, the mini-wash is standard."));
body.push(para("The wash is also the single most important anti-cheating step in the shuffle. As demonstrated by professional magicians in TruePokerDealer\u2019s security analysis, if the wash were not mandatory, a skilled card manipulator could scoop up cards from a completed hand, go straight into the riffle sequence, and retain specific high-value cards in known positions throughout the entire shuffle. The wash is what defeats this. Without it, a dealer with card manipulation skills could stack the deck using only the riffle-box-riffle sequence. This is why casinos mandate the wash and why surveillance monitors its execution."));
body.push(boldPara("Robotic Requirement: ", "System must be able to spread all 52 cards across a felt surface and execute a randomizing motion that contacts every card. Must verify (via vision or tactile sensing) that all cards have been moved from their starting positions. Duration must be controllable and consistent. The wash is the primary defense against deck stacking and must not be skippable or abbreviated by the system."));

body.push(h3("Collect and Square"));
body.push(para("After the wash, the dealer scoops all cards together using both hands, either pushing inward from the edges or closing the fingers on them to pull them in. Once gathered, they take one card from the top and place it on the bottom. This seemingly minor step serves a practical purpose: it helps establish a grip on the full 52-card stack. Then the dealer turns the deck away from themselves so no card faces are visible. This is a critical distinction from table games (blackjack, etc.) where the deck faces toward the dealer. In poker, the deck always faces away from the dealer so the dealer cannot see or manipulate card values."));
body.push(para("To square the deck, the dealer drops it onto the felt to create a flat bottom edge, then finds any horizontal cards on the left side, creates a small inlet with one hand, and uses the other hand to push the deck while the thumb spins and squares everything into a neat rectangular block. The squaring motion may need to be repeated a couple of times. After squaring, the dealer clears their hands (shows palms to camera) before proceeding to the riffle."));
body.push(boldPara("Robotic Requirement: ", "Must gather 52 scattered cards into a single squared stack. Cards must never face toward any camera or sensor that could identify values during collection. Deck orientation must be consistently away from all observable angles. Must verify the deck is properly squared (no protruding cards) before proceeding to the riffle."));

body.push(h3("Riffle"));
body.push(para("The riffle is the core mechanical shuffle step and the most physically demanding part of the shuffle to learn. The standard sequence calls for two riffles before the box and one riffle after (riffle-riffle-box-riffle). The detailed finger mechanics, as taught in the TruePokerDealer curriculum, are as follows:"));
body.push(para("Grip: Both hands mirror each other. The middle finger and ring finger come toward the top edge of the deck, with the thumb opposite them on the inside edge. The forefinger floats free (it will be used later). The pinkies go toward the outside edges of the deck to prevent cards from sliding out sideways. From this grip, the dealer splits the deck approximately in half."));
body.push(para("Positioning: With fingers in position on each half, the forefingers go to the center (between the two halves). The deck halves are pushed together until the forefingers touch. The halves are angled slightly toward each other (not parallel). This angle is critical: it ensures the cards will interleave onto each other cleanly during the riffle."));
body.push(para("Thumb slide: The thumbs slide up toward the inner corners of each half, getting underneath the cards. The thumbs should be nearly touching at this point. The grip must be strong enough that the dealer could lift their thumbs without the cards falling. This grip strength is essential."));
body.push(para("The riffle itself: The dealer flattens all fingers on top of the cards and leaves only the thumbs underneath. The pinkies remain flat on the sides securing the cards. Then the dealer simply lets the cards fall from each thumb in alternating sequence. The cards should cascade quietly onto each other. A loud riffle means too much force is being applied, which damages the cards. The entire motion is controlled by releasing thumb pressure, not by forcing cards together."));
body.push(para("Reassembly: After the riffle, the dealer keeps the middle finger, ring finger, and thumb in the riffle position. The forefinger presses down to maintain pressure so the interlaced cards do not separate. The pinkies on the outside then push the two halves together. Less pressure from the top fingers makes this easier. If the dealer grips too tightly from the top during this push, the halves resist merging."));
body.push(para("Common riffle errors: Riffling too loudly (damages cards, indicates poor technique). Leaving clumps of 3 or more cards from the same half grouped together (reduces randomization). Lifting the deck halves instead of keeping them parallel to the table (exposes card faces to players at seats 1 and 9/10). Riffling from the back of the deck instead of near the corners (a technique that allows card manipulation, as demonstrated by professional magicians in security analysis sessions)."));
body.push(boldPara("Robotic Requirement: ", "Must split a 52-card deck into approximately equal halves and interleave them card-by-card. Must achieve true interleaving (no clumps of 3+ cards from the same half remaining together). Must complete three riffles per shuffle cycle. Cards must remain parallel to the table surface throughout (never angled where faces could be visible). This is a high-dexterity manipulation task requiring precise force control on individual cards approximately 0.3mm thick. The riffle motion should be quiet and controlled, not forceful."));
body.push(h3("Riffle Adaptation: Long Fingernails"));
body.push(para("A practical consideration documented in the TruePokerDealer curriculum: dealers with long fingernails require one additional step at the beginning of each riffle. Because long nails prevent the standard finger grip from pulling the deck apart, the dealer must first get their thumb under the cards (the felt\u2019s cushion allows the nail to slide underneath), lift the deck approximately a quarter to half inch, and then use the middle and ring fingers to establish a grip for splitting. Once the cards are elevated and gripped, the standard riffle procedure is identical. The nail itself is not used for any part of the grip; it is only used to get under the cards initially. This adaptation applies to chip cutting as well: the nail replaces the fingertip as the contact point when sliding across chip stacks. This is relevant for robotic design because it demonstrates that the riffle can be executed with different end-effector geometries, as long as the fundamental grip and force patterns are maintained."));

body.push(h3("Box"));
body.push(para("The box (also called a strip) is performed between the second and third riffles. Using the riffle grip in one hand, the dealer uses the thumb and middle finger of the other hand (with wrist flat on the table) to take the top quarter of the deck and place it on the felt. The next quarter goes on top, then the next, then the final quarter. The cards from the top end up on the bottom, reversing the order of the four sections. There are two methods: (1) lifting each quarter off with thumb and middle finger and placing it down, or (2) placing each quarter onto the table and then stacking the next one on top. Both achieve the same result."));
body.push(para("Critical detail: During the box, the dealer must keep the deck halves parallel to the table at all times. Lifting the deck at an angle during the strip could expose the bottom card to players. This is one of the operations where professional magicians have demonstrated the ability to perform a \u2018fake box\u2019: stripping from the bottom instead of the top, which leaves the card order unchanged while appearing legitimate. Surveillance and floor supervisors are trained to watch for this, and the correct top-to-bottom direction of the strip is important for game integrity."));
body.push(boldPara("Robotic Requirement: ", "Must divide the deck into approximately equal quarters and restack them in reverse order (top to bottom). Portion sizes do not need to be exact but should be roughly equal. The direction of the strip (top quarters to felt) must be consistent and verifiable. This adds a non-riffle randomization step that defeats card-tracking techniques."));

body.push(h3("Cut"));
body.push(para("After the final riffle, the dealer cuts the deck using one hand only. The cut card (a solid-colored plastic card) is placed in front of the deck with the dull side up (the shiny side could reflect a card face). The dealer takes either one-third off the top or leaves one-third on the bottom and places the lifted portion onto the cut card. Then the remaining portion goes on top. This prevents anyone from being able to follow a specific card through the entire shuffle sequence. The cut card remains at the bottom of the deck throughout dealing, preventing the bottom card from being visible."));
body.push(para("Important timing note: After the final riffle and before the cut is the appropriate time for the dealer to perform any non-dealing administrative tasks (collecting antes in a tournament, processing a buy-in in a cash game). Once the cut begins, the dealer should complete the cut and proceed directly to pitching cards. Interrupting the dealing sequence after the cut creates opportunities for deck manipulation and is considered a procedural vulnerability."));
body.push(para("The cut is also where professional card manipulators face the most difficulty. As demonstrated in security analysis sessions, false riffles and false boxes can retain card positions through the shuffle, but the cut is harder to fake with one hand. Two-handed cuts are a red flag for surveillance: a legitimate casino cut is always performed with one hand. Magicians have developed one-handed false cuts (using a blocking finger on the bottom to appear to cut while retaining positions), but these are detectable by trained observers."));
body.push(boldPara("Robotic Requirement: ", "Must execute a clean single-motion deck cut. The cut card must remain at the bottom of the deck throughout the dealing process. If the system is designed to interact with players who cut the deck, it must be able to offer and accept a cut card from a player. The cut must be verifiably random (not to the same position each time) to prevent exploitation."));

body.push(h3("Hands Clear"));
body.push(para("After squaring the deck, the riffle sequence, and the cut, the dealer clears their hands by briefly showing both palms to the table and any surveillance cameras. This is a security measure that proves the dealer is not palming any cards. It happens at least twice during the shuffle: once after squaring, once after the cut before placing the deck in deal position."));
body.push(boldPara("Robotic Requirement: ", "A robotic system may not need this gesture in the traditional sense, but the equivalent requirement is that the system must provide verifiable proof at each stage that no cards have been retained, hidden, or duplicated. This could be achieved through card-counting verification, transparent mechanisms, or real-time audit logging."));

// ── SPEC TABLE: SHUFFLE ──
body.push(h2("2.2 Shuffle Specification Summary"));
body.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [2400, 4000, 2960],
  rows: [
    headerRow("Step", "Human Dealer Action", "Robot Requirement"),
    specRow("Wash", "Spread all 52 cards face-down, swirl 5-7 sec, every card touches felt", "Randomize all card positions; verify complete coverage"),
    specRow("Collect", "Scoop cards inward, square deck, face cards away from dealer", "Gather into single stack; no card values exposed at any angle"),
    specRow("Riffle 1", "Split deck in half, interleave by thumb release", "Split and interleave 52 cards; no clumps >2 from same half"),
    specRow("Riffle 2", "Repeat riffle", "Same specification; randomization compounds"),
    specRow("Box", "Divide into 4 quarters, restack in reverse order", "Quarter-cut and restack; defeats sequence tracking"),
    specRow("Riffle 3", "Final interleave after box", "Final interleave pass"),
    specRow("Cut", "Lift 1/3 to 2/3 from top, swap with bottom portion", "Single deck cut; place cut card at bottom"),
    specRow("Clear Hands", "Show both palms to table and cameras", "Provide verifiable audit that no cards retained"),
  ]
}));

// ── 3. THE PITCH ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("3. The Card Pitch"));
body.push(para("The pitch is how the dealer delivers cards to each player. It is arguably the most skill-dependent physical task in dealing and the one that separates professional dealers from amateurs most visibly. A poor pitch results in exposed cards, misdeals, player complaints, and slowed game pace. An excellent pitch is fast, flat, accurate, and completely conceals every card until the player looks at it."));

body.push(h2("3.1 Grip and Mechanics"));
body.push(para("The pitch is taught in the TruePokerDealer curriculum as the skill that benefits most from learning correctly the first time. Mark Shumer emphasizes: it is extremely important to learn the pitch correctly from the start, because once the body trains muscle memory for an incorrect pitch, unlearning it is an enormous effort. Dealers who learn wrong develop chronic injuries and have to essentially start over."));
body.push(h3("Body Position"));
body.push(para("Elbows must be in by the sides, not flared out. Palms face the ceiling (or tilted very slightly inward). The deck hand (non-dominant, typically left) holds the deck with a slight angle, tilted approximately 15 to 20 degrees from horizontal. This angle allows the thumb to push the top card off smoothly. The deck must NOT be held flat (makes card removal harder) and must NOT be tilted toward players. A deck tilted toward any player exposes card faces on every single pitch. Players who can see the flash will not say anything because they benefit from the information, so the dealer may never know they are exposing cards."));
body.push(h3("Deck Hand Grip"));
body.push(para("The forefinger rests on the front edge of the deck, protecting the front card from sliding forward and exposing. However, the forefinger must not press too high: if it rides up on the card face, every card pushed off the deck will bend upward against the finger and flash its value. The three remaining fingers (middle, ring, pinky) rest along the side of the deck, feeling for how many cards are being pushed off (must always be exactly one). The thumb is positioned on top of the deck in a flexible position, ready to push cards off."));
body.push(h3("The Primary Pitch (Top Corner Grab)"));
body.push(para("Step 1: The thumb pushes the top card slightly off the deck toward the upper-right corner. Do not push the card too far off. Step 2: The throwing hand grabs the card at the top-right corner with the thumb underneath and the index finger on top. The grip is loose, not tight. If the thumb and index finger squeeze too hard, the card will bend upward during projection and flash. Step 3: The middle finger finds its \u2018divot\u2019 \u2014 a comfortable grip point along the card edge that is slightly different for every dealer. This middle finger is what propels the card. Step 4: The card is projected by opening the hand. The middle finger extends outward, pushing the card, while the thumb and index finger release simultaneously. The follow-through is the hand opening fully with all fingers extended."));
body.push(para("Critical: There is NO wrist flick and NO arm motion. The entire pitch comes from opening the hand. This is not a suggestion for better form \u2014 it is a medical necessity. Dealers who pitch with wrist action develop ganglion cysts (a fluid-filled bump on the wrist caused by repetitive strain). Multiple dealers in the TruePokerDealer community have reported developing ganglion cysts specifically from incorrect pitch mechanics, with the cysts persisting for years. Dealers who pitch with arm motion are slower, less accurate, and fatigue faster."));
body.push(h3("The Secondary Pitch (Center Grab)"));
body.push(para("An alternative grip for situations where the primary pitch is insufficient. The card is pushed further off the deck and grabbed toward the center of the card (slightly above center) rather than the top corner. The middle finger goes to the back of the card. This grip allows the card to project more easily and travel further, which is useful when dealing on tables with poor felt (where cards do not glide well) or when the dealer needs extra distance. The center grab is slower than the top corner grab, which is why it is taught as a secondary technique. Professional dealers learn both grips and switch between them as table conditions require."));
body.push(h3("Directional Pitching and Chair Position"));
body.push(para("To pitch to different positions around the table, the dealer turns their entire body in the chair (a swivel chair is essential). The dealer should always try to be as centered as possible toward the target position. Pitching straight ahead is the most accurate trajectory. Pitching sideways (reaching to the far left or right without turning) causes cards to fly off-angle, increases exposure risk, and accelerates shoulder strain. In extreme cases where a player is at the very edge of the table, the dealer may need to angle their body rather than relying on the arm alone."));
body.push(h3("Keeping Cards Face-Down During Pitch"));
body.push(para("The most common pitch failure is a card flipping face-up during delivery. The primary cause is the wrist being angled downward rather than upward. As noted in TruePokerDealer training: to keep cards down when pitching, turn the wrist up toward the ceiling more. This simple adjustment changes the card\u2019s trajectory from a tumbling arc to a flat glide. Dealers who consistently flip cards have their wrist position corrected first before any other adjustment is attempted."));
body.push(boldPara("Common Pitch Errors (observed in real casino environments): ", "Pitching with wrist action (causes ganglion cysts and chronic wrist injuries). Holding the deck tilted toward players (flashes every card dealt). Gripping the card too tightly with thumb and index finger (causes it to bend upward and flash). Using arm motion instead of finger extension (slower, less accurate, more fatiguing). Not turning the body in the chair when pitching to edge positions (causes inaccuracy and shoulder strain). Forefinger riding too high on the front of the deck (bends every card pushed off)."));
body.push(boldPara("Robotic Requirement: ", "Must deliver individual cards from a held deck to specific positions around a semicircular table (up to 10 player positions). Cards must travel flat (no flutter or flip) and land face-down at each player position. Card faces must not be visible at any point during the pitch. System must be capable of delivering 2 cards to each of 10 positions (20 pitches) in under 15 seconds for competitive speed. Each card must land within approximately 6 inches of the target position. The pitching mechanism must be able to vary trajectory angle to reach all table positions without moving the entire base unit."));

body.push(h2("3.2 Pitch Situations and Edge Cases"));
body.push(h3("Exposed Cards During Pitch"));
body.push(para("If a card flips face-up during the pitch (due to poor technique, table obstruction, or player interference), the rules vary by casino. In most cardrooms, if the exposed card is the first card dealt to a player, it becomes the burn card for the first betting round and the player receives a replacement. If it happens on the second card, the exposed card is shown to the entire table, set aside, and becomes the first burn card. The dealer must announce any exposure immediately."));
body.push(boldPara("Robotic Requirement: ", "System must detect (via computer vision) if any card flips or exposes during delivery. Must have error-recovery protocol that identifies the exposed card, announces it to the table, removes it from the hand, and follows the applicable replacement procedure. This requires real-time card identification capability."));

body.push(h3("Card Leaves the Table"));
body.push(para("If a pitched card flies off the table entirely, it is treated as an exposed card. The dealer calls the floor (supervisor) if there is any dispute. The card is typically killed and the player receives a replacement after the deal is complete."));

body.push(h3("Card Lands on Another Player\u2019s Cards"));
body.push(para("If a card lands on or near another player\u2019s hole cards, the dealer must ensure neither player can see the other\u2019s cards. This is a \u201Cone player per hand\u201D integrity issue. The floor may be called if there is any suspicion of information leakage."));

// ── 4. BRINGING COMMUNITY CARDS ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("4. Community Cards: Flop, Turn, and River"));
body.push(para("After the preflop betting round is complete, the dealer must bring the community cards in a specific sequence. This is one of the most rule-dense procedures in dealing and one of the highest-risk moments for error."));

body.push(h2("4.1 The Pre-Flop to Flop Transition"));
body.push(para("The transition from preflop to the flop is one of the most procedurally dense moments in dealing. As taught in TruePokerDealer Lesson 18, the exact sequence is:"));
body.push(para("Step 1: Bring all bets in. After all preflop action is complete, the dealer sweeps all bets into the center pot. The pot should be gathered neatly."));
body.push(para("Step 2: Tap the table. This is a gentle tap, not a slap or a hammer. At the World Series of Poker in particular, loud taps are actively discouraged. The tap serves as an audible notification that the flop is coming. This is critical because it is possible that a player has not acted and nobody at the table realized it. The most common case: the big blind is last to act preflop, often only needs to check, and sometimes the dealer or table assumes they have checked when they have not. The tap gives that player a final moment to act before community cards are exposed."));
body.push(para("Step 3: Burn a card. The burn card procedure requires precise hand mechanics to prevent any exposure. The dealer pushes the top card off the deck with the thumb of the deck hand. Then the throwing hand takes the card with the index finger underneath and the thumb on top. The dealer opens their full hand against the card, creating a shield. The deck is brought close to the felt, and the burn card is pulled down underneath the hand so that it is completely covered throughout the entire motion from deck to felt. The burn card goes underneath the pot or in a diagonal pattern toward the dealer."));
body.push(boldPara("Critical detail: ", "Many inexperienced dealers grab the burn card with just the thumb and finger (like a pinch grip) and pull it down in a way that briefly exposes the corner. Players positioned to the dealer\u2019s left or right can see this flash. Those players will not say anything because seeing the burn card is free information for them. The correct technique involves opening the full hand over the card as a complete shield while bringing it to the felt. The card must be invisible from the moment it leaves the deck to the moment it is on the felt. A robotic system must ensure zero exposure of the burn card during removal."));
body.push(para("Step 4: Deal three flop cards. For each card, the dealer places the index finger underneath the card and the thumb on top, then brings it down to the felt face-down. All three cards are dealt this way, roughly aligned in a row. The dealer then slides their thumb along one edge and the other fingers along the opposite edge to push the three cards neatly together. This creates a single block of three cards."));
body.push(para("Step 5: Spread the flop. The dealer places their thumb on the edge of the three-card block and pulls/slides the cards apart so there is visible felt between each card. This is the display position. Every card must be clearly visible to all player positions. Cards that are touching or overlapping are a sign of an inexperienced dealer and make it harder for players to read the board."));
body.push(boldPara("Robotic Requirement: ", "Must deal 3 cards face-down, align them into a block, then spread them face-up with visible felt separation between each card. Cards must be readable from all player positions simultaneously. The spread spacing and orientation must be consistent every time. The burn card must be completely shielded during removal \u2014 zero exposure tolerance."));

body.push(h2("4.2 Turn and River"));
body.push(para("The turn and river each follow the same pattern: tap the table (gently), burn one card (fully shielded using the same hand-over-card technique), deal one card face-down, then flip it face-up. For the flip: the dealer pushes the card out from the deck, turns their hand upside down so the index finger is on top and the thumb is underneath on the top corner, then flips the card face-up. The dealer may flip it directly into position next to the existing community cards, or flip it in front of themselves and then slide it into position. Both methods are accepted; the choice is often a matter of dealer preference or supervisor instruction."));
body.push(para("The turn card goes to the right of the flop. The river card goes to the right of the turn. Burn cards are placed in a diagonal pattern angled toward the dealer, away from the community cards. This diagonal placement serves a critical purpose: if a player accidentally mucks a card onto the burn pile area, the diagonal orientation makes it easy to distinguish burn cards from mucked cards. This protects the hand in case of any dispute about which cards belong where."));
body.push(boldPara("Robotic Requirement: ", "Must execute the burn-and-turn sequence 3 times per hand (flop, turn, river) with zero card exposure on burns. Must maintain a clean, consistent community card layout that is visible from all 10 player positions simultaneously. Burn cards must be physically separated from community cards in a distinguishable pattern."));

// ── 5. BETTING ROUND MANAGEMENT ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("5. Betting Round Management"));
body.push(para("Managing the betting rounds is the most cognitively demanding task a poker dealer performs. It requires simultaneously tracking who has acted, how much each player has bet, whether any bets are outstanding, making change, and managing the pot. This is where the majority of dealer errors occur and where robotic precision would deliver the highest value."));

body.push(h2("5.1 Following the Action"));
body.push(para("The dealer must always know whose turn it is to act. Preflop, action starts with the player to the left of the big blind (under the gun) and proceeds clockwise. On all subsequent streets, action starts with the first remaining player to the left of the dealer button. The dealer must track verbal declarations (check, bet, call, raise, fold, all-in) and physical actions (placing chips forward, pushing cards toward the muck, sliding their entire stack forward). When verbal and physical actions conflict, the verbal declaration takes priority in most cardrooms."));
body.push(boldPara("Robotic Requirement: ", "Must track the action state of every player (has not acted, has acted, has folded, is all-in) in real time. Must process both verbal commands (via speech recognition) and physical chip/card movements (via computer vision). Must resolve conflicts between verbal and physical actions according to house rules. Must prompt the correct player when it is their turn and detect out-of-turn action."));

body.push(h2("5.2 Bets, Calls, and Making Change"));
body.push(para("Players place their bets in front of them, not directly into the pot (splashing the pot is prohibited because it makes it impossible to verify the bet amount). The dealer must verify each bet amount, ensure raises meet the minimum (typically double the previous bet in no-limit), and make change when a player puts out a chip larger than their intended bet. For example, if the bet is $15 and a player puts out a single $25 chip, the dealer must determine if this is a call (change of $10 back) or a raise. Under the oversized chip rule, a single chip without a verbal declaration is a call."));
body.push(boldPara("Robotic Requirement: ", "Must identify chip denominations by color and/or RFID. Must count bet amounts in real time. Must apply the oversized chip rule and minimum raise rules automatically. Must calculate and deliver correct change. Must detect and reject invalid bet sizes (under-calls, insufficient raises) and prompt the player for correction."));

body.push(h2("5.3 Pot Management"));
body.push(para("After each betting round is complete (all active players have put in equal amounts or are all-in), the dealer sweeps all bets into the center pot. This must be done cleanly with one hand pushing chips inward while the other guards the pot. The pot should be a neat stack, not a scattered pile, though it does not need to be counted unless a player requests a count (in pot-limit games, the dealer must be able to state the pot size at any time)."));

// ── 6. SIDE POTS AND ALL-INS ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("6. Side Pots and Multi-Way All-Ins"));
body.push(para("This is the single most complex procedural challenge in poker dealing and the scenario that causes the most dealer errors in live casino environments. It is also the scenario that would be most dramatically improved by robotic precision, because the math is deterministic but the physical execution under pressure is where human dealers fail."));

body.push(h2("6.1 The Core Principle"));
body.push(para("A player can only win from each opponent an amount equal to what they have put in. If Player A goes all-in for $200 and Player B calls with a $800 stack and Player C calls with a $1,500 stack, Player A cannot win more than $200 from each opponent. The excess chips that Player A cannot compete for are separated into a side pot."));

body.push(h2("6.2 Procedure: Three-Way All-In with Unequal Stacks"));
body.push(para("Scenario: Player A has $200, Player B has $800, Player C has $1,500. All three go all-in preflop. Assume $50 already in the pot from blinds."));
body.push(h3("Step 1: Build the Main Pot (Starting with the Smallest Stack)"));
body.push(para("Take $200 from each of the three players. Combined with the $50 in blinds, the main pot is $650. All three players are eligible to win this pot."));
body.push(h3("Step 2: Build Side Pot 1"));
body.push(para("Player B has $600 remaining after the main pot. Player C has $1,300 remaining. Take $600 from each. Side Pot 1 is $1,200. Only Player B and Player C are eligible to win this pot. Player A is dead to it."));
body.push(h3("Step 3: Return Excess"));
body.push(para("Player C has $700 remaining that no one can match. This is returned to Player C immediately."));
body.push(h3("Step 4: Physical Separation"));
body.push(para("The dealer must physically separate the main pot and side pot on the table so they are visually distinct. The main pot is typically placed in the center. Side pots are placed to the side, often near the dealer."));
body.push(h3("Step 5: All-In Buttons"));
body.push(para("The all-in button has become a standard tool in casino poker rooms over the last decade, recommended by the Tournament Directors Association (TDA Recommended Procedure 1). The dealer keeps one or two all-in buttons in their chip tray. When a player goes all-in, the dealer pulls the button from the tray and places it clearly in front of the player\u2019s betting area, then verbally announces \u2018all-in\u2019 to the table. The verbal announcement is mandatory; the button does not replace it. The button says ALL-IN on one side and CALL on the other."));
body.push(para("Placement rules: The button must be fully visible to all players. It must NOT be placed underneath chips, on top of chips, or in any position where it could be obscured. Placing the button on top of a player\u2019s chips is considered unprofessional and can create unintentional tells about the dealer\u2019s perception of the situation. The button should not interact with the player\u2019s chips at all."));
body.push(para("Multiple all-ins: If a second player goes all-in, the dealer uses a second button if available. If only one button exists, the dealer slides the button from the first all-in player to the most recent all-in player (the most recent all-in is the most relevant to the current action). If a third player goes all-in, the first button can be moved to them."));
body.push(para("The CALL side: In tournament play, the call button is especially valuable. When a player calls an all-in in a tournament, it is crucial information for all other players at the table because it affects their tournament equity calculations. In cash games, the call button is used less frequently because the stakes are contained to that hand. This is a judgment call for the dealer: in tournaments, always use the call side; in cash games, use judgment."));
body.push(para("Player confirmation: The all-in button alone is not sufficient to confirm a player is all-in. Best practice is to have the player push at least one chip into the pot in addition to the button placement. This prevents situations where a miscommunication results in a player being committed all-in when they did not intend it. Some poker rooms have this as an official or unofficial rule."));
body.push(h3("Step 6: Showdown"));
body.push(para("At showdown, the dealer resolves the LAST side pot first, then works backward to the main pot. If Player C has the best hand, they win Side Pot 1 ($1,200) and the Main Pot ($650). If Player A has the best hand overall, they win only the Main Pot ($650), and the side pot is awarded to whichever of Player B or C has the better hand between them."));

body.push(h2("6.3 Common Dealer Errors in Side Pot Scenarios"));
body.push(para("Putting chips into the wrong pot. When action continues after one player is all-in, subsequent bets must go into the side pot, not the main pot. Dealers who lose track of which pot is which will misallocate chips, resulting in incorrect payouts."));
body.push(para("Incorrect payouts when running it twice. If the table agrees to run the board twice (deal two separate sets of community cards), and one player is already all-in and eligible only for the main pot, that player is playing for one board on the main pot while the remaining players split the side pot across two boards. Dealers frequently miscalculate which player gets what from which pot on which board."));
body.push(para("Freezing under pressure. A four-way all-in with different stack sizes requires creating three side pots under the gaze of players with tens of thousands of dollars at stake. Many dealers visibly slow down, make arithmetic errors, and lose the confidence of the table. This single scenario is the strongest argument for robotic dealing in terms of accuracy improvement."));

body.push(boldPara("Robotic Requirement: ", "Must calculate side pots instantly and correctly for any number of all-in players with any stack sizes. Must physically separate pot amounts on the table and maintain tracking of which players are eligible for which pots. Must handle running-it-twice scenarios with multi-pot eligibility. Must display pot totals and eligibility either physically or on a digital display. This is a pure computational task that a robotic system would handle with zero errors, eliminating the single most common source of dealer mistakes in live poker."));

body.push(h2("6.4 Split Pots and Quartering"));
body.push(para("When two or more players tie for the best hand, the pot is split equally between them. Splitting is straightforward in a two-way tie: the dealer divides the pot into two equal stacks. Odd chips are awarded to the player closest to the left of the button (the standard tiebreaker in most cardrooms). However, the complexity escalates dramatically in games with high-low splits and multiple boards."));

body.push(h3("Quartering in PLO Double Board Bomb Pots"));
body.push(para("In Pot-Limit Omaha double board bomb pots (an increasingly common format in casino cash games), each board receives exactly half the pot. If one player wins the top board outright and two players tie on the bottom board, the top board winner receives 50% of the pot, and the two bottom board winners each receive 25%. This is called quartering. The player who gets quartered ends up with significantly less than they may expect, which is a frequent source of confusion and disputes."));
body.push(para("The dealing procedure for quartering: First, the dealer separates the total pot into two equal halves, one for each board. The winning player on Board 1 receives their half immediately. Then the dealer takes the remaining half and splits it again into two equal portions for the tied players on Board 2. This means the dealer is performing nested pot division: split the total pot, then split half of that split. With odd chips, the same left-of-button rule applies at each level of division."));
body.push(h3("River Bet Shortcut for Quartering"));
body.push(para("When there are bets on the final street before a quartering situation, the standard method of collecting everything into a central pot and then performing the nested division is slow and error-prone. Experienced dealers use a shortcut: they push the river bets directly to the winner of one board, then split the remaining pre-river pot between the other board\u2019s tied winners. This works because the river bets will mathematically end up in the same place regardless of whether you merge first or pay directly. The shortcut avoids combining and re-separating, which is the operation where chips most commonly end up in the wrong pile. Players get visibly nervous when a dealer has never handled a quartering situation before, and the confidence of the shortcut method matters for table trust."));
body.push(para("In PLO high-low split games (like Big O / PLO8), the complexity compounds further. Each board already splits between high and low winners. If two players tie for the low on one board while another player scoops the high, that board\u2019s half is first split high/low, then the low half is split again between the tying players. A single pot can be divided four, six, or even eight ways in extreme scenarios. Dealers report that these multi-way split calculations are the single most stressful dealing situation they encounter, and errors are common even among experienced dealers."));
body.push(boldPara("Robotic Requirement: ", "Must handle nested pot divisions with arbitrary numbers of winners per board per direction (high/low). Must correctly apply odd-chip tiebreaker rules at each level of division. Must clearly display to all players exactly how much each person receives and from which pot portion. This multi-dimensional split calculation is trivial for software but extraordinarily error-prone for human dealers."));

// ── 7. ERROR RECOVERY ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("7. Error Recovery and Misdeals"));
body.push(para("Error recovery is where the gap between experienced and inexperienced dealers is most visible. A seasoned dealer handles a misdeal smoothly in seconds. An inexperienced dealer freezes, calls the floor, and kills the table\u2019s energy for several minutes. A robotic system has an opportunity to handle most errors automatically and instantly, but must know the complete ruleset."));

body.push(h2("7.1 Misdeal Conditions"));
body.push(para("A misdeal is declared (and the hand is restarted) when any of the following occur during the initial deal: the first or second card of the hand is exposed due to dealer error, two or more cards are exposed during the deal, a player receives an incorrect number of cards, cards are dealt to a seat with no player, cards are dealt out of sequence (wrong player receives first card), or the deck is found to be incomplete before action begins."));

body.push(h2("7.2 Exposed Card Procedures (After Action Has Started)"));
body.push(para("Once meaningful action has occurred (any player has made a voluntary wager), the hand cannot be declared a misdeal in most cardrooms. Instead, specific procedures apply. If a card is exposed during dealing after action, it is shown to the entire table, set aside as the first burn card, and the player receives a replacement card after the deal is complete. If a community card is turned up prematurely (dealer brings the turn before action is complete), the premature card is shuffled back into the remaining stub, a new burn card is dealt, and the proper community card is then dealt."));
body.push(boldPara("Robotic Requirement: ", "Must detect exposed cards in real time, execute the correct recovery procedure based on the stage of the hand, and do so without operator intervention. Must be able to shuffle a single card back into the stub and re-deal. Must log all irregularities for floor supervisor review."));

body.push(h2("7.3 The Stub Count"));
body.push(para("The stub count is a game protection measure that verifies all 52 cards are accounted for. Dealers are expected to count the stub at least once per down (a down is a 30-minute dealing session, after which the dealer rotates to a break or another table). The count should ideally be done during one of the first few hands at the table, because discovering a card discrepancy later in the down is far more problematic than catching it early."));
body.push(para("The math: In a 10-player Texas Hold\u2019em hand that goes to the river, 28 cards have been used (20 hole cards + 3 burn cards + 5 community cards). The stub should contain exactly 24 cards (52 minus 28). The dealer counts the stub by taking cards off the top of the deck and dropping them in groups of 8. Three groups of 8 equals 24, confirming the count. The counting is done silently during river action while players are betting. The dealer never announces the count out loud, as it would be distracting and reveal information about game protection procedures."));
body.push(para("Adjustments for different player counts: With 9 players, 26 cards are used (18 hole cards + 8 community/burn), leaving 26 in the stub. Three groups of 8 equals 24, plus 2 remaining cards. With 8 players, 24 cards are used, leaving 28 in the stub (three groups of 8 plus 4 remaining). The dealer adjusts the expected remainder based on player count."));
body.push(para("Adjustments for incomplete hands: If the hand ends before the river (e.g., everyone folds on the turn), the dealer must account for the missing burn card and community card. For a hand that ended on the turn: add 2 to the expected stub count (one burn and one river card that were never dealt). The count still works; you just have 2 extra cards in the stub."));
body.push(para("If the count is wrong, it indicates a card is missing. Possible causes: a card stuck to another card (the most common cause), a card on the floor, a card palmed by a player or dealer (the most serious cause), or a card left in a player\u2019s possession (sometimes players accidentally pocket a card). The floor must be called immediately if the count is off. The table may need to be searched, and in serious cases, the hand may be voided."));
body.push(boldPara("Robotic Requirement: ", "Must maintain a real-time count of all cards dealt, burned, and remaining. Must verify 52-card integrity at configurable intervals (recommended: every hand, since this is trivial for a computer). Must alert operators immediately if any discrepancy is detected. Should track the exact identity of every card dealt and remaining (not just count), enabling immediate identification of which specific card is missing. This is a trivial task for a computer but a non-trivial game protection task for a human dealer, making it one of the clearest advantages of robotic dealing."));

// ── 8. CHIP HANDLING ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("8. Chip Handling and Bank Management"));
body.push(para("Chip handling is a core physical skill that every dealer must master. It involves cutting chips (separating a stack into specific quantities), making change, processing buy-ins, managing the chip bank (the dealer\u2019s chip tray), and executing color-ups (exchanging small denomination chips for larger ones). The standards exist for speed, accuracy, and surveillance verification."));

body.push(h2("8.1 Cutting Chips"));
body.push(para("Chips are broken down (cut) in standardized groupings for verification. A full stack in any casino is 20 chips of a single denomination. The breakdown groupings are industry standard and exist to make visual verification instantaneous for the dealer, surveillance, and players:"));
body.push(para("Cut in groups of 5: $1 chips ($5 per group, $100 per full stack), $2 chips ($10 per group, $40 per full stack), $5 chips ($25 per group, $100 per full stack), $100 chips ($500 per group, $2,000 per full stack). Cut in groups of 4: $0.50 chips ($2 per group, $10 per full stack), $25 chips ($100 per group, $500 per full stack), $500 chips ($2,000 per group, $10,000 per full stack). These groupings are chosen so that each cut-group equals a clean dollar amount, making pot calculations and change-making faster."));
body.push(h3("The Bump-and-Prove Technique"));
body.push(para("The physical chip cutting technique, as detailed in TruePokerDealer Lesson 5a, follows a specific sequence called \u2018bump and prove\u2019:"));
body.push(para("Step 1 (Grip): The dealer uses their index finger (considered the most professional method; some dealers use their thumb, but the index finger provides a higher speed ceiling and greater range of motion). The grip has the thumb on one side of the stack, middle finger on the other side, and pinky behind the stack protecting it from shifting backward. The index finger is lifted and positioned flat on top."));
body.push(para("Step 2 (Initial cut): The dealer picks up all chips except the bottom 5 (or 4, depending on denomination). If they accidentally take one too many or one too few, they simply adjust. With practice, dealers get the correct count on the first try most of the time."));
body.push(para("Step 3 (Placement): The lifted stack is placed slightly behind the remaining stack (during training; at speed, it is placed close). This is where the pinky protecting the back becomes critical: without it, the stack will shift backward when pushed forward."));
body.push(para("Step 4 (Bump): The dealer pushes the held stack forward into the stationary stack. This is the \u2018bump.\u2019 The physical contact between the two stacks stabilizes them and creates a reference point for the next step."));
body.push(para("Step 5 (Prove): The dealer slides the index finger flat across the top of the held stack toward the stationary stack. When the index finger makes contact with the stationary stack at the same height as the held stack, this \u2018proves\u2019 that both stacks are the same height (and therefore the same count). The dealer then lifts the proved portion and drops the next group of 5 (or 4)."));
body.push(para("Step 6 (Repeat): Bump and prove all the way down. After the final drop, the dealer proves one more time even though there are no more chips to pull up. This final prove verifies that the last dropped group matches all the others. Without this final prove, the last group could be off by one chip and the error would go undetected."));
body.push(para("Step 7 (Splash): The dealer takes the proven stacks between thumb and middle finger at a slight angle and pushes them off the felt in a fanning motion. This \u2018splash\u2019 separates the groups horizontally so that each group of 5 (or 4) is visually distinct and countable at a glance. Do not spin or drop the chips; if they are sticky (common with heavily used casino chips), spinning causes them to fly apart."));
body.push(para("Step 8 (Clear and verify): The dealer clears their hands (shows palms). Then they scoop the chips back up with thumb on one side, middle finger on the other, ring finger and pinky behind, and prove one final time as they pick up. This final prove ensures no chip was palmed during the splash. Then the chips are handed off or placed in the tray."));
body.push(h3("The Moment-of-Contact Principle"));
body.push(para("An advanced detail frequently missed in basic training: the accuracy of a chip cut depends on executing the separation at the exact moment the moving stack makes contact with the stationary stack. When the dealer pushes a portion of chips forward and they bump into the previous stack, that contact stabilizes the chip heights and ensures the correct count separates cleanly. Training yourself to cut at that precise instant of contact, rather than cutting mid-slide, dramatically improves accuracy, especially with worn or sticky casino chips that resist separation. At speed, the bump is nearly invisible, but it is always present in a professional cut."));
body.push(h3("Chip Geometry Note"));
body.push(para("A surprising physical property of casino chips relevant to visual verification systems: a single chip stood on its edge is exactly 12 chips tall when stacked. This means a standard chip is almost exactly a perfect square when viewed from the side (the diameter-to-height ratio of stacked chips is 12:1, and a single chip on edge equals 12 stacked). This property is consistent across virtually all casino chip manufacturers and is useful for calibrating visual chip-counting systems."));
body.push(boldPara("Robotic Requirement: ", "Must separate chip stacks into standard casino groupings (5s or 4s depending on denomination). Must identify denominations by color, markings, or RFID. Must execute cuts quickly and display results clearly for verification. Must maintain organized chip bank with denominations in standard order. Must learn both hands (the bump-and-prove technique must be executable from either side of the tray). All chip movements must be camera-friendly for surveillance verification."));

body.push(h2("8.2 Chip Handling Security Protocols"));
body.push(para("Every chip interaction is a potential theft vector, and dealers are trained in specific handling protocols designed to make theft physically impossible and immediately detectable by surveillance."));
body.push(h3("Clearing Hands"));
body.push(para("Throughout any chip transaction, the dealer must periodically clear their hands by briefly showing both palms to the ceiling and the backs of their hands. This proves to surveillance cameras that no chips are being palmed. Clearing happens after every significant chip interaction: after cutting chips, after completing a buy-in, after pushing a pot, and any time hands come out of the chip tray. Surveillance enforcement of this protocol is strict: one experienced dealer in the TruePokerDealer training series reports receiving over 40 write-ups across his career, with a significant portion being for clearing hands violations. Even veteran dealers get written up for unconsciously skipping the clear during high-speed action."));
body.push(h3("Fingertip Rule"));
body.push(para("Chips must always be held in the fingertips, never in the palm. When holding a single chip, the thumb is on one side and the index, middle, and ring fingers on the other, with visible space in the palm. When holding a stack, the same principle applies: the chips are controlled by the fingers with the palm open. This prevents a dealer from concealing a chip in their hand during any transaction."));
body.push(h3("No Hand-to-Hand Transfers"));
body.push(para("A dealer must never transfer chips directly from one hand to the other. If a chip or stack needs to move from the right hand to the left hand, the dealer places it on the felt, clears the first hand, then picks it up with the second hand. This eliminates the possibility of a chip being palmed during the transfer. While slightly slower, the drop-clear-pickup motion becomes nearly as fast as a direct transfer with practice. New dealers frequently violate this rule unconsciously, and surveillance will issue write-ups."));
body.push(h3("The Roll Technique for Tray Placement"));
body.push(para("When placing a stack of chips into the dealer tray, the natural grip (fingers on the sides) makes it physically difficult to insert the stack into the narrow tray slot. Dealers learn a specific roll technique: place the thumb on top of the stack, fingers on the bottom, and rotate the stack toward themselves so it can be lowered vertically into the tray slot. If the grip is too loose during the roll, the chips scatter across the tray or felt. This is a frequently fumbled operation for new dealers and a source of embarrassment during auditions. The roll must become muscle memory before it can be performed at game speed."));
body.push(boldPara("Robotic Requirement: ", "A robotic system has an inherent advantage in chip security because its manipulators cannot palm chips. However, the system must still provide visible audit trail of all chip movements. Every chip picked up must be traceable to where it is placed. The system should log all transactions for surveillance review and provide camera-friendly chip handling that surveillance staff can verify at a glance."));

body.push(h2("8.3 The Bank"));
body.push(para("The dealer\u2019s chip bank (tray) is a structured rack that holds the house chips. Standard arrangement places lower denominations on the left (from the dealer\u2019s perspective) and higher denominations on the right. Bank maintenance is critical: a messy bank slows every transaction and increases errors. When the bank runs low on a denomination, the dealer requests a fill from the chip runner. When the bank has excess chips, a credit is removed."));

// ── 9. GAME VARIATIONS ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("9. Game Variations and Mixed Games"));
body.push(para("Texas Hold\u2019em is the most common poker variant in casino environments and the baseline for any robotic dealer system. However, a complete deployment specification must account for the other games commonly dealt in casino poker rooms, because a system limited to Hold\u2019em would not be sufficient for a typical casino poker room operation."));

body.push(h2("9.1 Texas Hold\u2019em (No-Limit and Limit)"));
body.push(para("2 hole cards per player, 5 community cards (3-1-1), 4 betting rounds. No-limit allows any bet up to a player\u2019s full stack. Limit restricts bets to fixed amounts (small bet on first two rounds, big bet on last two). The dealing procedure is identical; only the betting rules differ."));

body.push(h2("9.2 Pot-Limit Omaha (PLO)"));
body.push(para("4 hole cards per player (doubles the dealing time per hand), 5 community cards, 4 betting rounds. Maximum bet is the size of the pot. The dealer must be able to calculate the pot size at any time, which is non-trivial when there have been multiple raises. Players must use exactly 2 of their 4 hole cards and exactly 3 community cards to make their best hand. This hand-reading requirement is significantly more complex than Hold\u2019em and is where many dealer errors occur at showdown."));
body.push(h3("Omaha Hand-Reading Complexity"));
body.push(para("The \u201Cexactly 2 from hand, exactly 3 from board\u201D rule is the single most common source of showdown errors in Omaha games. Players and inexperienced dealers frequently misread hands by using 1 or 3 cards from the hand. Professional dealer training teaches a systematic evaluation approach: first, check if the board is paired (if yes, full houses are possible). Second, check for flush possibilities. Third, check for straights by identifying which specific card combinations would complete them. Then evaluate sets and two-pair. For each player, the dealer mentally tests all possible 2-card combinations from the hole cards against the board."));
body.push(h3("The Framing Technique"));
body.push(para("Experienced Omaha dealers use a physical technique called framing to verify hands at showdown. When a potential winning hand is identified, the dealer physically pulls the relevant 2 hole cards and 3 board cards together, separating them from the remaining cards, to visually confirm the hand. This prevents the most common error: declaring a winner based on a hand that uses 3 cards from the player\u2019s hand or 4 from the board. Framing adds a few seconds per showdown but eliminates the most costly category of dealer errors. In practice sessions, dealers are trained to frame every hand until it becomes instinctive, then gradually speed up while maintaining accuracy."));
body.push(para("The math: with 4 hole cards, there are 6 possible 2-card combinations. With 5 community cards, there are 10 possible 3-card combinations. That yields 60 possible 5-card hands per player. At a full table of 10 players, the dealer must potentially evaluate up to 600 hand combinations at showdown. In practice, the dealer reads the board first to identify what hands are possible and then looks for the relevant cards in each player\u2019s hand, but the cognitive load is still enormous compared to Hold\u2019em."));
body.push(h3("Pot-Limit Calculation"));
body.push(para("In pot-limit games, the maximum bet is the current pot size plus the amount needed to call. This means the dealer must track the pot total continuously. After multiple raises in a single round, the pot-limit calculation becomes: pot before action + all previous bets in this round + the amount needed to call the current bet. Dealers are frequently asked \u201Cwhat\u2019s the pot?\u201D and must answer immediately. In round-up raking environments, odd amounts from previous pot calculations make tracking even harder. This is one of the most requested features for dealer assistance technology."));
body.push(boldPara("Robotic Requirement: ", "Must deal 4 cards per player (up to 40 cards for a full table). Must calculate pot-limit maximum bets in real time and announce them on request. Must correctly evaluate 4-card hands using exactly 2 hole cards and 3 community cards at showdown, which requires evaluating 60 possible 5-card combinations per player. Must never misapply the Omaha hand-reading rule. This is perhaps the strongest single argument for robotic dealing accuracy over human dealing."));

body.push(h2("9.3 Omaha Hi-Lo and Big O (PLO8 / 5-Card PLO8)"));
body.push(para("In Omaha Hi-Lo (8 or better), the pot is split between the best high hand and the best qualifying low hand (five unpaired cards 8 or below, using exactly 2 from hand and 3 from board for each direction independently). Big O is the 5-card variant, giving each player 5 hole cards instead of 4, further increasing the combinatorial complexity. These games are spreading rapidly in casino poker rooms and are among the most dealer-error-prone formats in existence."));
body.push(para("The dealer must evaluate each player\u2019s hand twice: once for the high and once for the low. A player can use different 2-card combinations from their hand for each direction. If no player has a qualifying low (five unpaired cards 8 or below), the high hand scoops the entire pot. The dealer must determine whether a qualifying low exists before splitting, which requires checking every player\u2019s possible low combinations against the board. With 5-card Big O, there are 10 possible 2-card combinations per player, yielding 100 possible 5-card hands per player per direction. At a full table, this is 2,000 hand evaluations at showdown."));
body.push(boldPara("Robotic Requirement: ", "Must evaluate high and low hands independently for every player. Must correctly determine low qualification (8 or better, no pairs). Must handle scoops (no qualifying low) and split pots. Must support 4-card and 5-card Omaha variants. Hand evaluation complexity makes this the game variant where robotic accuracy provides the most dramatic improvement over human dealing."));

body.push(h2("9.4 Seven-Card Stud"));
body.push(para("No community cards. Each player receives 7 individual cards over 5 rounds of dealing (2 face-down, 1 face-up initially, then 3 more face-up one at a time, then 1 final face-down). Action starts with the lowest visible card (the bring-in) and on subsequent rounds with the highest visible hand. The dealer must read visible hands to determine betting order, which changes every round. There are no blinds; instead, all players post an ante and there is a mandatory bring-in."));
body.push(boldPara("Robotic Requirement: ", "Must deal cards face-up and face-down in alternating sequences across multiple rounds. Must read visible hands to determine betting order. Must track antes and bring-in bets. Must manage up to 56 cards in play simultaneously (8 players x 7 cards). This game pushes the limits of table space and card tracking."));

body.push(h2("9.5 Mixed Games (H.O.R.S.E. and Dealer\u2019s Choice)"));
body.push(para("Mixed game formats rotate between different poker variants on a fixed schedule (typically every orbit of the dealer button or every 30 minutes). H.O.R.S.E. rotates through Hold\u2019em, Omaha Hi-Lo, Razz, Seven-Card Stud, and Stud Eight-or-Better. The dealer must switch between completely different dealing procedures, hand rankings, betting structures, and showdown rules every 8 to 10 hands. This is the most demanding format for human dealers and the format most likely to produce errors."));
body.push(boldPara("Robotic Requirement: ", "Must store and switch between complete rule sets for all standard poker variants. Must change dealing procedure, hand evaluation, betting structure, and showdown rules on command. Must clearly announce which game is being played to all players at each rotation. This is a significant software architecture requirement: the system must be modular enough to hot-swap game logic without interrupting operation."));

body.push(h2("9.6 Double Board Bomb Pots"));
body.push(para("An increasingly common format in casino cash games, particularly at higher stakes. In a bomb pot, all players post a predetermined ante (typically 2x to 5x the big blind), there is no preflop betting, and the flop is dealt immediately. In double board bomb pots, two separate sets of community cards are dealt side by side. Each board receives exactly half the pot. This format creates some of the largest and most complex pots a dealer will encounter."));
body.push(para("The dealer manages two parallel sets of community cards, dealing each street to both boards before proceeding. At showdown, the dealer must evaluate each player\u2019s best hand against each board independently. Players can win one board, both boards (a scoop), or tie on either. When ties occur on one board while another player wins the other outright, quartering situations arise. The combination of large pots, multiple boards, and potential quartering makes this the highest-complexity dealing scenario in modern cash games."));
body.push(para("Double board bomb pots can use any poker variant as the base game. Hold\u2019em double board bomb pots are common, but PLO and Big O double board bomb pots also occur. When combined with hi-lo split games, a single pot can theoretically be divided eight ways: high and low on each of two boards, with ties possible in each direction. These extreme scenarios are rare but must be handled correctly when they occur."));
body.push(boldPara("Robotic Requirement: ", "Must manage two parallel community card layouts simultaneously. Must correctly divide the pot between boards and handle nested splits (quartering, hi-lo on each board). Must track player eligibility per board (all players are eligible for both boards in standard format). Must display clearly which board is being evaluated during showdown. The computational complexity is trivial for software but represents the most stressful scenario for human dealers."));

// ── 10. PLAYER MANAGEMENT ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("10. Player Interaction and Table Management"));
body.push(para("A poker dealer is not just a card-and-chip machine. They are the social center of the table, responsible for managing player behavior, enforcing rules, and maintaining the pace and energy of the game. This is the area where robotic dealers face the most significant design challenges, because it involves interpreting ambiguous human behavior in real time."));

body.push(h2("10.1 String Bets"));
body.push(para("A string bet occurs when a player puts out chips in multiple motions without verbally declaring their full action. For example, a player reaches for chips, places $50 on the table, reaches back to their stack, and places another $50. Without a verbal declaration of \u201Craise to $100,\u201D the second motion may be ruled a string bet and the player\u2019s action is limited to the first motion only ($50 call or bet). The dealer must detect this in real time and enforce the rule before the next player acts. This is one of the most common disputes in live poker."));
body.push(boldPara("Robotic Requirement: ", "Must track player chip movements and detect multi-motion bets. Must correlate verbal declarations with physical actions. Must enforce the single-motion rule or verbal declaration rule per house rules. This requires both vision-based motion tracking and audio processing working in concert."));

body.push(h2("10.2 Out-of-Turn Action"));
body.push(para("If a player acts before it is their turn (bets, folds, or declares an action), the dealer must recognize this immediately and enforce the appropriate rule. In most cardrooms, an out-of-turn fold is binding (the cards are dead). An out-of-turn bet or raise may or may not be binding depending on whether the action changes when it gets back to the correct player."));

body.push(h2("10.3 Verbal Declarations vs Physical Actions"));
body.push(para("In casino poker, verbal declarations are binding. If a player says \u201Craise\u201D they must raise, even if they have not yet put chips forward. If a player says \u201Call\u201D and then tries to put out a raise, they are held to the call. The dealer must hear and register verbal declarations and enforce them even if the player\u2019s subsequent physical action contradicts them."));
body.push(boldPara("Robotic Requirement: ", "Must have speech recognition capable of detecting poker-specific verbal declarations (check, bet, call, raise, fold, all-in) in noisy casino environments with multiple simultaneous conversations, music, and ambient noise. Must timestamp verbal declarations and correlate them with subsequent physical actions. False positive rate must be extremely low: incorrectly attributing a verbal declaration could cost a player thousands of dollars."));

body.push(h2("10.4 Reading the Customer"));
body.push(para("Dealers are expected to \u2018read the customer\u2019 \u2014 observing subtle clues about each player\u2019s mood, patience level, personality, and wants, then adjusting their interaction style accordingly. If a player clearly wants silence, the dealer deals in silence. If a player is superstitious (common in poker), the dealer respects those superstitions (e.g., not touching the player\u2019s chips if they\u2019re superstitious about it). The goal is that every player leaves the casino with a positive impression, regardless of their results."));
body.push(para("An important unwritten rule in poker dealing: the dealer should never look at a player\u2019s face while that player is in action (making a betting decision). This is a game integrity issue \u2014 the dealer\u2019s gaze could give away information or make the player uncomfortable. When it is not a player\u2019s turn and they are interacting with the dealer about something unrelated to the hand, normal eye contact is appropriate. But during action, the dealer\u2019s eyes stay on the chips, the cards, or the table."));
body.push(para("The most difficult reading situation occurs when players at the table contradict each other. Poker players are competitive and sometimes deliberately try to create conflict or tilt other players. The dealer must navigate these situations without taking sides, appearing to favor anyone, or escalating the tension. When contradictions become confrontational, the floor is called."));
body.push(boldPara("Robotic Requirement: ", "A robotic system would not need to \u2018read\u2019 customers in the emotional sense, but it must be able to detect and respond to player states: waiting for action, engaged in conversation (do not interrupt), visibly agitated (notify floor staff), absent from seat (skip in dealing), and attempting to communicate with the dealer (respond to questions about pot size, action, etc.). The system should never direct cameras or sensors at a player\u2019s face during their action, respecting the same privacy principle that human dealers follow."));
body.push(h2("10.5 Player Pace and Game Energy"));
body.push(para("One of the most underappreciated aspects of dealing is how the dealer\u2019s energy and pace affect the entire table. A slow, disengaged dealer kills the game. Players leave, new players refuse to sit, and the room loses rake revenue. A fast, professional dealer keeps the game lively and players engaged. Professional dealers average approximately 30 hands per hour. Elite dealers can reach 35 or more. The difference between 25 hands per hour and 35 hands per hour across a full day represents a significant revenue impact for the casino and a significant experience difference for players."));
body.push(boldPara("Robotic Requirement: ", "Must maintain a consistent pace of 30 to 40 hands per hour. Must not have variable speed (slowing down when situations get complex). Speed must be adjustable based on the game type and table composition. Must never create dead time between hands: the shuffle, deal, and pot push should be seamless."));

// ── 11. TOURNAMENT PROCEDURES ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("11. Tournament-Specific Procedures"));
body.push(para("Tournament dealing introduces a set of procedures that do not exist in cash games. These are critical for a system deployed at events like the World Series of Poker, which runs over 100 bracelet events each summer."));

body.push(h2("11.1 Color-Up and Race-Off"));
body.push(para("As blind levels increase in tournaments, lower denomination chips are removed from play. The dealer must exchange (color up) small chips for larger ones. When a player has an odd number of small chips that cannot be evenly exchanged, a race-off procedure is used: the player receives one card face-up for each odd chip, and the player with the highest card receives a replacement chip. This requires the dealer to manage a mini-card-dealing procedure in the middle of the tournament."));

body.push(h2("11.2 Table Breaks"));
body.push(para("When a table is broken (eliminated as players bust), remaining players must be moved to fill empty seats at other tables. The dealer verifies chip counts, bags chips if necessary, and directs players to their new seats based on instructions from the tournament director. The dealer must verify that no chips are lost during the transfer."));

body.push(h2("11.3 Hand-for-Hand Play"));
body.push(para("Near the money bubble (the point where remaining players begin to receive prize payouts), the tournament enters hand-for-hand play. All tables must start and complete each hand simultaneously. No new hand can begin until all tables have finished. The dealer must signal the floor when their hand is complete and wait for authorization to proceed. This creates coordination overhead that does not exist in normal play."));

body.push(h2("11.4 Final Table Procedures"));
body.push(para("The final table of a major tournament typically involves television cameras, professional commentary, and a card-by-card delay for broadcast. The dealer must handle cards with extra care (RFID-embedded cards that must be placed precisely on the reader), manage the pace to accommodate broadcast requirements, and maintain composure under intense public scrutiny. This is the one scenario where elite human dealers would likely be retained even in a robotic dealing environment, as discussed in the companion thesis document."));

// ── 12. REGULATORY CONSIDERATIONS ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("12. Regulatory and Compliance Considerations"));
body.push(para("Any robotic dealing system deployed in a real casino environment must pass regulatory approval from the relevant gaming control board. This section outlines the regulatory landscape based on operator interviews and publicly available regulatory frameworks."));

body.push(h2("12.1 Nevada Gaming Control Board"));
body.push(para("Nevada has the most developed regulatory framework for gaming technology in the United States. New table game technology must be submitted for testing, which includes hardware reliability, software integrity, mathematical fairness verification, and security evaluation. The testing process typically takes 6 to 12 months and costs $50,000 to $200,000 depending on complexity. A robotic dealer would likely be classified as a novel table game system and would face scrutiny on card randomization, game integrity, payout accuracy, and fail-safe behavior."));

body.push(h2("12.2 Game Integrity Requirements"));
body.push(para("A poker dealing system must demonstrate that it cannot be manipulated to favor or disadvantage any player. This means the shuffle must be provably random, the dealing sequence must be deterministic and verifiable, and no system component can access card identity information before the card is dealt. Surveillance integration is mandatory: the system must provide clear camera views of all card movements and chip transactions."));

body.push(h2("12.3 Fail-Safe Requirements"));
body.push(para("If the system malfunctions mid-hand, there must be a defined procedure for completing or voiding the hand. Player chips must be preserved. The system must have redundant tracking so that the game state can be reconstructed after any failure. Battery backup or graceful degradation must be considered for power interruptions."));

body.push(h2("12.4 Virginia Model (Charitable Gaming)"));
body.push(para("The Virginia charitable gaming market provides a detailed case study of what regulatory entry looks like for poker in a new jurisdiction. Virginia\u2019s poker bill (Senate Bill 936) was passed after approximately five years of advocacy, going into effect July 1st of its passage year. The law was built on Virginia\u2019s 50+ year tradition of charitable gaming (primarily bingo), operated by 501(c)(3) organizations, churches, synagogues, VFW posts, Moose and Elks lodges, and similar organizations."));
body.push(para("The poker room director is personally responsible for knowing all regulations and legal requirements. This is not a delegable task. The regulations are extensive and, in Virginia\u2019s case, were entirely new (all underlined in the regulatory document, indicating brand-new language with no prior precedent). The initial regulations tend to be simultaneously restrictive in some areas and unrestricted in others, because the regulators have not yet encountered the edge cases that emerge during actual operation. First-year regulations are expected to be refined repeatedly as issues arise."));
body.push(para("Operational decisions that require regulatory awareness include: chip design and sourcing (chip manufacturers like Icon typically only sell to licensed casinos), table design and layout (including felt color, logo placement, and betting line decisions), chair selection, room layout, staffing requirements, and game approval. Even aesthetic choices like stitching patterns on chairs matter because they affect the overall impression of legitimacy and professionalism that regulators and players expect."));
body.push(para("Each state has different requirements, and a robotic dealing system would need to be certified in each jurisdiction independently. Some jurisdictions (like Macau) require dealers to be local residents, which is part of what drives the labor shortage that creates the opportunity for automation. The Virginia model demonstrates that regulatory entry requires a minimum of 5+ years of advocacy, detailed knowledge of existing charitable gaming frameworks, and a willingness to work through initial regulatory ambiguity."));

// ── 13. SECURITY AND GAME PROTECTION ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("13. Security and Game Protection"));
body.push(para("Casino poker is a target for cheating, collusion, and manipulation. A robotic dealing system must not only deal accurately but must also incorporate game protection measures that are at least equivalent to what a human dealer provides, and ideally superior."));

body.push(h2("13.1 Anti-Cheating Measures"));
body.push(para("Human dealers are trained to watch for several categories of cheating: marked cards (players who can identify card values from the back), card manipulation (false shuffles, card palming, mucking), chip manipulation (past-posting, which is adding chips to a bet after seeing a favorable card), collusion (two players working together to exploit other players), and mechanical cheating (devices that can read or manipulate cards)."));
body.push(h3("Documented False Shuffle Techniques"));
body.push(para("In a landmark security analysis session organized by TruePokerDealer, professional magicians demonstrated the specific techniques that could theoretically be used by a corrupt dealer to manipulate the deck through the standard casino shuffle sequence. These techniques are documented here not as instructions but as the threat model that a robotic system must be immune to:"));
body.push(para("Retention Shuffle (Blind Shuffle): The dealer performs what appears to be a standard riffle but retains specific cards in known positions (top, bottom, or both) throughout. Cards on the top of the deck can be held in place during the riffle by controlling which half falls last. Cards on the bottom can be retained by controlling the initial split. A skilled manipulator can retain 2-4 cards in position through multiple riffles. The magicians demonstrated retaining cards through two full riffles with the deck appearing to shuffle normally."));
body.push(para("Push-Through Shuffle: The most deceptive false riffle. The two halves are interlaced during the riffle, but instead of being squared together, the halves are pushed through each other and separated again. It appears that the deck is squared and then cut, but the cards have returned to their original positions. This technique naturally leads into a cut (the halves separate into a cut position), making it look like a legitimate riffle followed by a legitimate cut. If the push-through is executed at the correct position, the entire deck retains its order."));
body.push(para("Zarrow Shuffle (named after Herb Zarrow): A false riffle where the two halves appear to interleave but one half slides on top of the other without actually interlacing. The result is a split, an apparent riffle, a squaring, and the deck is in the same order it started. This can be executed in a single motion and is considered the most dangerous false shuffle because it mimics a real shuffle so closely that even trained observers miss it."));
body.push(para("False Box/Strip: Instead of stripping from top to bottom (which reverses the quarter order), the manipulator strips from bottom to top or performs the strip in a way that returns the quarters to their original positions. From the outside, the motion looks identical. Surveillance can detect this if they know to watch the direction of the strip, but most observers cannot distinguish the two at game speed."));
body.push(para("False Cut: A one-handed false cut where the deck appears to be cut but the blocking finger on the bottom retains the card order. Two-handed false cuts are easier to execute but are a red flag (legitimate casino cuts use one hand). The magicians demonstrated one-handed false cuts that were visually indistinguishable from real cuts, though they noted it is the hardest part of the sequence to fake."));
body.push(h3("Documented Peeking Techniques"));
body.push(para("The Bubble Peek: While holding the deck in the dealing position, the dealer applies slight thumb pressure to the top card, creating a tiny \u2018bubble\u2019 (a bend in the card) that briefly exposes the index corner. This is done during normal dealing motion \u2014 while announcing action, looking at the board, or moving chips. The peek takes a fraction of a second. The magicians demonstrated peeking at the top 1-5 cards during what appeared to be normal dealing activity, with the peek completely invisible to players or a camera positioned at table level."));
body.push(para("The Misdirection Peek: The dealer creates a small distraction (chip movement, verbal announcement, reaching for something) and peeks at the top card during the moment when all eyes are directed elsewhere. Combined with second dealing (dealing the second card from the top instead of the first), this allows the dealer to control which player receives specific cards."));
body.push(para("The magicians concluded that a skilled card manipulator who was also a trained dealer could, in theory, stack the deck through the standard casino shuffle sequence if the wash were omitted or poorly executed. The wash is the single procedure that defeats all of these techniques, because it physically separates all cards from their positions before the riffle sequence begins. This is why surveillance enforcement of the wash is considered the highest priority in shuffle monitoring."));
body.push(boldPara("Robotic Advantage: ", "A properly designed robotic system would be immune to all forms of false shuffles, false cuts, peeking, and deck manipulation. The shuffle would be mechanically verifiable (every card position tracked). Card identities would not be accessible to any system component before dealing. The system would never inadvertently expose a card. There would be no possibility of second dealing, bottom dealing, or card retention. This eliminates the entire threat model described above and is a significant security improvement over human dealing."));

body.push(h2("13.2 Surveillance Integration"));
body.push(para("Casino surveillance (the \u201Ceye in the sky\u201D) monitors all table games via overhead cameras. Dealers are trained to perform certain actions in view of cameras: cutting chips toward the camera, clearing hands to show they are empty, and spreading cards in specific patterns for verification. A dealer who receives surveillance write-ups for failing to follow these procedures faces disciplinary action."));
body.push(para("The severity of surveillance enforcement is documented extensively in the TruePokerDealer community. One former dealer reported receiving over 40 write-ups in a single review period for performing coin magic tricks with tip chips at the table. Surveillance could not track where the chips went during the sleight-of-hand movements and built a file documenting every instance. The write-ups covered \u2018taking a tip and not being able to determine where it went\u2019 \u2014 even though the chips were going into the tip box every time. The incident illustrates that surveillance prioritizes trackability above all else: if a chip movement cannot be followed frame-by-frame on camera, it is flagged regardless of intent. This principle is critical for robotic system design: every chip and card movement must be traceable on camera."));
body.push(para("A robotic system must integrate with existing surveillance infrastructure and may be able to provide even better camera angles and data feeds than human dealing allows. The system could provide direct digital audit logs to surveillance in addition to camera feeds, creating a dual-verification system that exceeds what is possible with human dealers."));

// ── 14. THE DEALER EXPERIENCE ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("14. The Human Dealer Experience: What Automation Replaces"));
body.push(para("Understanding what the job of dealing actually feels like is critical context for designing a robotic replacement that casino operators and the poker community will accept. This section is based on extensive interviews with active dealers and dealer supervisors."));

body.push(h2("14.1 Physical Toll"));
body.push(para("A standard dealing shift is 8 hours. Dealers work in \u2018downs\u2019 of approximately 30 minutes (dealing at one table), then rotate to a break or another table. In a typical 8-hour shift, a dealer may deal 10 to 12 tables with approximately 4 breaks totaling about 2 hours off the table. The actual dealing time is 5 to 6 hours of continuous repetitive motion."));
body.push(para("The most serious chronic injury is the ganglion cyst, a fluid-filled lump that develops on the wrist from repetitive strain. This is directly caused by incorrect pitch mechanics \u2014 specifically, pitching with wrist flick action instead of finger extension. Multiple dealers in the TruePokerDealer community have documented developing ganglion cysts that persist for years. One dealer developed a visible cyst after pitching with wrist action and had to be retrained to use the correct finger-extension technique. The cyst remained after retraining. This injury is almost entirely preventable with correct mechanics, which is why proper pitch training is considered a medical priority, not just a technique preference."));
body.push(para("Back and neck pain are the most universal complaints, particularly for shorter dealers. Casino poker tables are a standard size designed for average-height dealers. A dealer who is 5\u20194\u201D must reach significantly further across the table than a dealer who is 6\u20190\u201D, and that additional reach compounds over thousands of repetitions per shift. Players who place their bets close to themselves (rather than pushing them toward the center) force the dealer to reach further for every single bet, worsening the strain. Poker room chairs with inadequate back support (common in many rooms) compound the problem. Dealers report that working 5 or more consecutive days causes the most severe body issues, even when individual shifts are manageable."));
body.push(para("Shoulder strain develops from the repeated reaching motion across the table. The pitch itself, when done correctly, does not cause shoulder issues (it uses only the fingers). But gathering bets, pushing pots, and reaching for cards at the far seats creates cumulative shoulder fatigue over a career."));

body.push(h2("14.2 Compensation Structure"));
body.push(para("Poker dealers are primarily compensated through tips (tokes). Base hourly pay is typically minimum wage or slightly above. All-in hourly earnings (base plus tips) average $25 to $40 per hour for a competent dealer in a mid-stakes game, with significant variance. A dealer working 3 to 4 days per week can take home $600 to $1,000+ after taxes, making it competitive with many other service industry jobs for the hours worked."));
body.push(para("Factors affecting tip income are well-documented in dealer interviews: (1) Dealing speed \u2014 more hands per hour means more pots won and more tip opportunities. Fast dealers consistently out-earn slow dealers. (2) Friendliness and personality \u2014 players tip more when they enjoy the dealer. However, friendliness creates vulnerability: dealers who open up their personality to players risk having that personality attacked by losing or angry players. Many dealers, especially women, adopt a deliberately neutral demeanor (\u2018shut up and deal\u2019) to protect themselves emotionally, knowingly sacrificing significant tip income. One experienced dealer estimated she would make \u2018twice as much money\u2019 if she were friendlier and more engaging, but chose not to because the emotional cost was too high. (3) Attractiveness \u2014 documented in dealer interviews as a real factor, particularly for female dealers. Flirtation can be used as a deliberate tip-maximizing strategy, but comes with the cost of unwanted attention and being hit on at the table. (4) Game stakes \u2014 higher stakes games generally produce larger tips. The difference between dealing a 1/3 game and a 5/10 game can be the difference between $25/hour and $50/hour in tips."));
body.push(para("The tip-dependent model creates significant income instability. A dealer\u2019s income can swing wildly based on table assignment, player composition, and luck (players tip more when they are winning). Chip runners (the staff who handle buy-ins and run chips to tables) are also tip-dependent, with a biggest-single-tip ceiling around $100-$175 from generous regulars, but average tips much lower. The entire compensation structure of casino poker operations depends on player generosity, which is a fragile foundation."));

body.push(h2("14.3 Player Abuse and Table Culture"));
body.push(para("Dealers routinely experience verbal abuse from losing players. The standard negative behavior includes: aggressively folding cards, whispering under their breath, cursing, blaming the dealer for bad cards (\u2018I haven\u2019t seen a face card in an hour,\u2019 \u2018Are there any aces in this deck?\u2019), and general woe-is-me commentary. These complaints are constant and repetitive. Players learn these speech patterns from each other, creating a self-reinforcing culture of negativity at the table. On a typical 8-handed table, at least 5 players will be exhibiting some form of negative behavior at any given time."));
body.push(para("The recommended dealer response protocol is: take a few breaths, count down from 10 (or 5 if the pace of the game does not allow 10), remain calm and composed. Human beings naturally tend to mirror one another, so a levelheaded dealer will eventually bring a negative player back to baseline. The dealer should sincerely listen, try to understand the player\u2019s frustration, and offer a degree of sympathy. Most disgruntled players will calm down when they feel heard. In poker specifically (unlike table games where the dealer is the opponent), the dealer should never argue, disagree, or resist. Any resistance from a player should result in an immediate floor call. Confrontation in poker tends to spread (the game is inherently adversarial between players), so de-escalation by the dealer is critical."));
body.push(para("Female dealers face additional challenges. Being hit on at the table is described as \u2018horrible\u2019 and \u2018so awkward\u2019 by female dealers in the TruePokerDealer community \u2014 made worse by the fact that 7 or 8 other players are watching. Unwanted attention is sometimes accompanied by tips (\u2018if you\u2019re gonna hit on me, send the money\u2019), creating a transactional dynamic that is uncomfortable regardless of the financial benefit. Female dealers who are skilled and knowledgeable about the game report less bullying because they leave fewer openings for criticism, but the harassment does not disappear entirely. The poker room environment is described as \u2018just not a place that\u2019s pleasant for women\u2019 by both male and female industry professionals."));
body.push(para("Floor supervisor training for handling abuse is widely acknowledged as inadequate in the industry. Supervisors are typically \u2018thrown into it\u2019 without simulation training, shadowing, or structured preparation for confrontational situations. The result is that when a dealer calls the floor about an abusive player, the supervisor may not handle it effectively, sometimes even siding with the player. This failure of the support system is reported as more demoralizing than the abuse itself. One dealer described being brought to tears not by the abusive player but by the floor supervisor who failed to support her."));

body.push(h2("14.4 What This Means for Robotic Deployment"));
body.push(para("A robotic dealer eliminates the physical injuries, income instability, and emotional abuse that characterize the human dealing experience. This is not just a cost savings argument for casino operators. It is a labor conditions argument. The poker community\u2019s emotional attachment to human dealers is genuine, but it coexists with a system that objectively harms the people it depends on. A robotic system that handles the mechanical dealing while preserving elite human dealers for premium and broadcast events represents an improvement for everyone: faster and more accurate games for players, cost savings for operators, and a transition to better roles for the best human dealers."));

// ── APPENDIX ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("Appendix A: Complete Hand Cycle Checklist"));
body.push(para("This appendix provides the complete sequence of dealer actions for a single hand of No-Limit Texas Hold\u2019em, from shuffle to pot push. Each line item represents a discrete action that a robotic system must be capable of executing."));

const checklist = [
  ["Pre-Deal", "Shuffle complete deck (wash, riffle-riffle-box-riffle, cut)"],
  ["Pre-Deal", "Clear hands for surveillance"],
  ["Pre-Deal", "Place deck in deal position"],
  ["Pre-Deal", "Verify button position; move button one seat clockwise"],
  ["Pre-Deal", "Prompt small blind and big blind to post"],
  ["Pre-Deal", "Verify blind amounts are correct"],
  ["Deal", "Pitch 2 cards face-down to each active player, starting left of button"],
  ["Deal", "Detect and handle any exposed cards during pitch"],
  ["Deal", "Verify each player received exactly 2 cards"],
  ["Preflop", "Prompt first player to act (UTG)"],
  ["Preflop", "Track all bets, calls, raises, and folds in sequence"],
  ["Preflop", "Enforce minimum raise rules"],
  ["Preflop", "Make change as needed"],
  ["Preflop", "Handle all-ins: place all-in button, calculate side pots if needed"],
  ["Preflop", "Gather all bets into pot"],
  ["Flop", "Tap table to signal community cards coming"],
  ["Flop", "Burn one card (fully shielded)"],
  ["Flop", "Deal 3 cards face-down, align, flip face-up, spread with visible gaps"],
  ["Flop", "Prompt first player to act (left of button)"],
  ["Flop", "Track all betting action"],
  ["Flop", "Gather all bets into pot (or side pot if applicable)"],
  ["Turn", "Tap table"],
  ["Turn", "Burn one card"],
  ["Turn", "Deal 1 card face-down, flip face-up, place right of flop"],
  ["Turn", "Track all betting action"],
  ["Turn", "Gather all bets into pot"],
  ["River", "Tap table"],
  ["River", "Burn one card"],
  ["River", "Deal 1 card face-down, flip face-up, place right of turn"],
  ["River", "Track all betting action"],
  ["River", "Gather all bets into pot"],
  ["Showdown", "Determine which player must show first (last aggressor or left of button)"],
  ["Showdown", "Read all shown hands and determine winner(s)"],
  ["Showdown", "Handle split pots if applicable"],
  ["Showdown", "Resolve side pots (last pot first, working backward)"],
  ["Showdown", "Push pot to winner(s)"],
  ["Showdown", "Take rake (amount per house rules)"],
  ["Cleanup", "Collect all cards (hole cards and community cards)"],
  ["Cleanup", "Verify no cards are missing before shuffle"],
  ["Cleanup", "Count stub if applicable (game protection)"],
  ["Cleanup", "Begin new shuffle for next hand"],
];

body.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [2000, 7360],
  rows: [
    new TableRow({
      children: ["Phase", "Action"].map((text, i) =>
        new TableCell({
          borders, width: { size: [2000, 7360][i], type: WidthType.DXA }, margins: cellMargins,
          shading: { fill: NAVY, type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text, size: 20, font: "Arial", bold: true, color: WHITE })] })]
        })
      )
    }),
    ...checklist.map(([phase, action]) =>
      new TableRow({
        children: [
          new TableCell({
            borders, width: { size: 2000, type: WidthType.DXA }, margins: cellMargins,
            children: [new Paragraph({ children: [new TextRun({ text: phase, size: 19, font: "Arial", bold: true, color: NAVY })] })]
          }),
          new TableCell({
            borders, width: { size: 7360, type: WidthType.DXA }, margins: cellMargins,
            children: [new Paragraph({ children: [new TextRun({ text: action, size: 19, font: "Arial" })] })]
          }),
        ]
      })
    )
  ]
}));

// ── BUILD DOCUMENT ──
sections.push({
  properties: {
    page: {
      size: { width: 12240, height: 15840 },
      margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
    }
  },
  headers: { default: new Header({ children: [classified()] }) },
  footers: {
    default: new Footer({
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Robotic Poker Dealer Deployment Specification \u2014 Page ", size: 18, font: "Arial", color: "999999" }), new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Arial", color: "999999" })]
      })]
    })
  },
  children: body
});

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
    ]
  },
  sections
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("docs/Deployment_Bible.docx", buffer);
  console.log("Document created: " + buffer.length + " bytes");
});
