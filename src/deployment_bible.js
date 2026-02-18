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
body.push(para("The professional casino poker shuffle follows a strict sequence: Wash, Collect, Square, Riffle, Riffle, Box, Riffle, Cut, Place in Deal Position. Each step serves a specific randomization or security purpose."));

body.push(h3("Wash"));
body.push(para("The wash (also called a scramble) is performed by spreading all 52 cards face-down across the felt and mixing them with both hands in a circular swirling motion. Every card face must touch the felt at least once. A standard wash lasts approximately 7 seconds. A mini-wash (used between hands when time is a factor) lasts 2 to 3 seconds. The wash is the primary randomization step. It ensures that cards which were grouped together from the previous hand are separated before the mechanical shuffle begins."));
body.push(boldPara("Robotic Requirement: ", "System must be able to spread all 52 cards across a felt surface and execute a randomizing motion that contacts every card. Must verify (via vision or tactile sensing) that all cards have been moved from their starting positions. Duration must be controllable and consistent."));

body.push(h3("Collect and Square"));
body.push(para("After the wash, the dealer scoops all cards together using both hands, pushing inward from the edges. Once gathered, they take one card from the top and place it on the bottom (this helps grip the full deck), then turn the deck away from themselves so no card faces are visible. The dealer then drops the deck to create a flat bottom edge and uses their thumb and fingers to square the deck into a neat rectangular block. The deck must face away from the dealer at all times to prevent any possibility of seeing card values."));
body.push(boldPara("Robotic Requirement: ", "Must gather 52 scattered cards into a single squared stack. Cards must never face toward any camera or sensor that could identify values during collection. Deck orientation must be consistently away from all observable angles."));

body.push(h3("Riffle"));
body.push(para("The riffle is the core mechanical shuffle step. The dealer splits the deck approximately in half, holds each half in one hand, and interleaves the cards by releasing them from alternating thumbs so the two halves merge together. The standard sequence calls for two riffles before the box and one riffle after. The grip requires the thumb on the inside edge pulling cards, while the index, middle, and ring fingers support the outside. The cards should fall in a controlled cascade, not slapped together. A sloppy riffle leaves clumps of cards from the same half still grouped together, reducing randomization."));
body.push(boldPara("Robotic Requirement: ", "Must split a 52-card deck into approximately equal halves and interleave them card-by-card. Must achieve true interleaving (no clumps of 3+ cards from the same half remaining together). Must complete three riffles per shuffle cycle. This is a high-dexterity manipulation task requiring precise force control on individual cards approximately 0.3mm thick."));

body.push(h3("Box"));
body.push(para("The box (also called a strip) is performed between the second and third riffles. The dealer takes the top quarter of the deck and places it on the table, then the next quarter on top, continuing until all four quarters have been restacked in reverse order. This breaks up any card sequences that survived the riffles. Some rooms use a three-cut box instead of four."));
body.push(boldPara("Robotic Requirement: ", "Must divide the deck into approximately equal quarters and restack them in reverse order. Portion sizes do not need to be exact but should be roughly equal. This adds a non-riffle randomization step that defeats card-tracking techniques."));

body.push(h3("Cut"));
body.push(para("After the final riffle, the dealer cuts the deck by lifting approximately one-third to two-thirds from the top and placing it on the table, then stacking the remainder on top. In many casino environments, a cut card (solid-colored plastic card) is offered to a player to cut the deck. The cut card is then placed at the bottom of the deck to prevent the bottom card from being visible during dealing."));
body.push(boldPara("Robotic Requirement: ", "Must execute a clean deck cut. If the system is designed to interact with players who cut the deck, it must be able to offer and accept a cut card from a player. The cut card must remain at the bottom of the deck throughout the dealing process."));

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
body.push(para("The deck is held in the non-dominant hand (typically left) with a slight angle, tilted approximately 15 to 20 degrees from horizontal. This angle allows the thumb to push the top card off the deck smoothly. The deck must NOT be held flat (makes card removal harder) or angled too steeply (exposes card faces to players on one side of the table). The forefinger rests on the front edge of the deck, preventing cards from sliding forward, but must not press too high or cards will bend upward when pushed off, exposing their value."));
body.push(para("To pitch a card, the thumb pushes the top card slightly off the deck toward the upper-right corner. The throwing hand (dominant) grabs this card between the thumb (underneath), index finger (on top), and middle finger (finding a comfortable grip point along the card edge). The card is then propelled by extending the middle finger outward while releasing the thumb and index finger. There is no wrist flick and no arm motion. The entire pitch comes from opening the hand. This is critical for avoiding repetitive strain injuries during 8-hour dealing shifts."));
body.push(boldPara("Common Pitch Errors (observed in real casino environments): ", "Pitching with wrist action (causes chronic wrist injuries including ganglion cysts), holding the deck tilted toward players (exposes card faces), gripping the card too tightly (causes it to bend upward and flash), and using arm motion instead of finger extension (slower, less accurate, more fatiguing)."));
body.push(boldPara("Robotic Requirement: ", "Must deliver individual cards from a held deck to specific positions around a semicircular table (up to 10 player positions). Cards must travel flat (no flutter or flip) and land face-down at each player position. Card faces must not be visible at any point during the pitch. System must be capable of delivering 2 cards to each of 10 positions (20 pitches) in under 15 seconds for competitive speed. Each card must land within approximately 6 inches of the target position."));

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
body.push(para("Step 1: After all preflop action is complete and all bets have been gathered into the pot, the dealer taps the table. This is a gentle tap, not a slap, that serves as an audible notification that the flop is coming. The purpose is to alert any player who may not have acted yet. This is particularly important for the big blind, who sometimes only needs to check and may not have clearly indicated their action."));
body.push(para("Step 2: Burn a card. The dealer pushes the top card off the deck with their thumb, places their index finger underneath and thumb on top, and opens their hand against the card to pull it down to the felt while completely shielding it from all angles. The burn card goes underneath the pot or to a designated burn pile. The burn prevents any player who may have marked or identified the top card from knowing what community card is coming."));
body.push(boldPara("Critical detail: ", "Many inexperienced dealers grab the burn card with thumb and finger and pull it down in a way that briefly exposes the corner. Players positioned to the dealer\u2019s left or right can see this flash. The correct technique involves opening the full hand over the card as a shield while bringing it to the felt. A robotic system must ensure zero exposure of the burn card during removal."));
body.push(para("Step 3: Deal three cards face-down, one at a time, from the deck. Place your index finger under each card and thumb on top, bring it down to the felt. Arrange all three cards roughly aligned. Then slide your thumb along one edge and fingers along the other to push them together neatly. Finally, place your thumb on the edge of the three-card block and pull/slide them apart so there is visible felt between each card."));
body.push(boldPara("Robotic Requirement: ", "Must deal 3 cards face-down, align them, then spread them face-up with visible separation between each card. Cards must be readable from all player positions. The spread must be consistent in spacing and orientation every time."));

body.push(h2("4.2 Turn and River"));
body.push(para("The turn and river each follow the same pattern: tap the table, burn one card (shielded), deal one card face-down, then flip it face-up next to the existing community cards. The turn card goes to the right of the flop. The river card goes to the right of the turn. A diagonal placement of burn cards (angled toward the dealer, away from the community cards) is the standard layout for keeping burn cards visually separated from the board."));
body.push(boldPara("Robotic Requirement: ", "Must execute the burn-and-turn sequence 3 times per hand (flop, turn, river) with zero card exposure on burns. Must maintain a clean, consistent community card layout that is visible from all 10 player positions simultaneously."));

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
body.push(para("The dealer places an all-in button in front of each all-in player so the table can see their status. The all-in button is a physical marker that says ALL-IN on one side and CALL on the other. It is placed clearly visible in front of the player\u2019s betting area, not on top of chips or underneath them."));
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
body.push(para("As a game protection measure, dealers are expected to count the remaining cards in the deck (the stub) at least once per down (typically a 30-minute dealing session). In a 10-player Texas Hold\u2019em hand that goes to the river, the stub should contain exactly 24 cards (52 minus 20 hole cards minus 3 burns minus 5 community cards). Dealers count the stub in groups of 8 while action is ongoing on the river, without announcing the count out loud. If the count is wrong, it indicates a card is missing (possibly stuck to another card, on the floor, or palmed) and the floor must be called immediately."));
body.push(boldPara("Robotic Requirement: ", "Must maintain a real-time count of all cards dealt, burned, and remaining. Must verify 52-card integrity at configurable intervals. Must alert operators immediately if any discrepancy is detected. This is a trivial task for a computer but a non-trivial game protection task for a human dealer."));

// ── 8. CHIP HANDLING ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("8. Chip Handling and Bank Management"));
body.push(para("Chip handling is a core physical skill that every dealer must master. It involves cutting chips (separating a stack into specific quantities), making change, processing buy-ins, managing the chip bank (the dealer\u2019s chip tray), and executing color-ups (exchanging small denomination chips for larger ones). The standards exist for speed, accuracy, and surveillance verification."));

body.push(h2("8.1 Cutting Chips"));
body.push(para("Chips are broken down (cut) in standardized groupings for verification. Chips with denominations of $1, $2, $5, and $100 are broken into stacks of 5 (so a full stack of 20 chips shows as 4 groups of 5). Chips with denominations of $0.50, $25, and $500 are broken into stacks of 4 (so a full stack of 20 shows as 5 groups of 4). These specific groupings make it easy for the dealer, surveillance, and players to quickly verify amounts: a stack of 20 x $5 chips cut in fives = $25 per cut, $100 total."));
body.push(para("The physical technique: Using the index finger, the dealer slides it across the top of a tall stack to separate the correct number of chips, lifts the portion with a pinch grip, and places it adjacent to the remaining stack. Professional dealers cut with their index finger (not thumb) because it offers greater range of motion and higher speed ceiling. The cut is done toward the dealer (not away) for security reasons. All cut chips remain visible to surveillance and the table."));
body.push(h3("The Moment-of-Contact Principle"));
body.push(para("An advanced detail frequently missed in basic training: the accuracy of a chip cut depends on executing the separation at the exact moment the moving stack makes contact with the stationary stack. When the dealer pushes a portion of chips forward and they bump into the previous stack, that contact stabilizes the chip heights and ensures the correct count separates cleanly. Training yourself to cut at that precise instant of contact, rather than cutting mid-slide, dramatically improves accuracy, especially with worn or sticky casino chips that resist separation. At speed, the bump is nearly invisible, but it is always present in a professional cut."));
body.push(boldPara("Robotic Requirement: ", "Must separate chip stacks into standard casino groupings (5s or 4s depending on denomination). Must identify denominations by color, markings, or RFID. Must execute cuts quickly and display results clearly for verification. Must maintain organized chip bank with denominations in standard order."));

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

body.push(h2("10.4 Player Pace and Game Energy"));
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
body.push(para("Based on operator interviews, the Virginia charitable gaming market illustrates the complexity of state-by-state regulation. Poker rooms in Virginia operate under charitable gaming licenses with specific requirements around who can deal, how rake is collected, and what games are permitted. Each state has different requirements, and a robotic dealing system would need to be certified in each jurisdiction independently. Some jurisdictions (like Macau) require dealers to be local residents, which is part of what drives the labor shortage that creates the opportunity for automation."));

// ── 13. SECURITY AND GAME PROTECTION ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("13. Security and Game Protection"));
body.push(para("Casino poker is a target for cheating, collusion, and manipulation. A robotic dealing system must not only deal accurately but must also incorporate game protection measures that are at least equivalent to what a human dealer provides, and ideally superior."));

body.push(h2("13.1 Anti-Cheating Measures"));
body.push(para("Human dealers are trained to watch for several categories of cheating: marked cards (players who can identify card values from the back), card manipulation (false shuffles, card palming, mucking), chip manipulation (past-posting, which is adding chips to a bet after seeing a favorable card), collusion (two players working together to exploit other players), and mechanical cheating (devices that can read or manipulate cards)."));
body.push(para("A notable set of real-world cheating techniques was documented in interviews with professional magicians who analyzed casino poker dealing. These include: lapping (secretly moving a card from the table to the dealer\u2019s lap), false shuffles (manipulating the riffle so specific cards remain in known positions), peeking (techniques to see the top card of the deck before dealing), and deck manipulation during the cut. These techniques exploit the small margins of error in human card handling."));
body.push(boldPara("Robotic Advantage: ", "A properly designed robotic system would be immune to most forms of physical card manipulation, false shuffles, and peeking. The shuffle would be mechanically verifiable. Card positions would be tracked digitally. The system would never inadvertently expose a card. This is a significant security improvement over human dealing and a strong selling point for casino operators concerned about game integrity."));

body.push(h2("13.2 Surveillance Integration"));
body.push(para("Casino surveillance (the \u201Ceye in the sky\u201D) monitors all table games via overhead cameras. Dealers are trained to perform certain actions in view of cameras: cutting chips toward the camera, clearing hands to show they are empty, and spreading cards in specific patterns for verification. A dealer who receives surveillance write-ups for failing to follow these procedures faces disciplinary action. A robotic system must integrate with existing surveillance infrastructure and may be able to provide even better camera angles and data feeds than human dealing allows."));

// ── 14. THE DEALER EXPERIENCE ──
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(h1("14. The Human Dealer Experience: What Automation Replaces"));
body.push(para("Understanding what the job of dealing actually feels like is critical context for designing a robotic replacement that casino operators and the poker community will accept. This section is based on extensive interviews with active dealers and dealer supervisors."));

body.push(h2("14.1 Physical Toll"));
body.push(para("Dealing poker requires standing for 6 to 8 hours per shift with a 30-minute break every 30 minutes of dealing. The repetitive motions of shuffling, pitching, and chip handling cause chronic injuries including ganglion cysts on the wrist (from improper pitch mechanics), shoulder strain (from extended reaching across the table), back pain (from the standing position and forward lean), and hand fatigue. Dealers who learn improper pitch mechanics early in their career develop these injuries faster, and retraining pitch mechanics after years of muscle memory is extremely difficult."));

body.push(h2("14.2 Compensation Structure"));
body.push(para("Poker dealers are primarily compensated through tips (tokes). Base hourly pay is typically minimum wage or slightly above. Tips average $25 to $40 per hour for a competent dealer in a mid-stakes game, with significant variance. Factors affecting tips include dealing speed (more hands per hour means more opportunities to win tips), friendliness and personality (players tip more when they enjoy the dealer), attractiveness (documented in dealer interviews as a real factor, particularly for female dealers), and game stakes (higher stakes games generally produce larger tips). The tip-dependent model creates significant income instability and puts dealers in a position of financial dependence on player generosity."));

body.push(h2("14.3 Player Abuse"));
body.push(para("Dealers routinely experience verbal abuse from losing players. This ranges from passive-aggressive comments to direct personal insults. Dealers are expected to maintain composure, de-escalate, and continue dealing. The recommended approach is to listen, show empathy, avoid mirroring the player\u2019s emotional state, and call the floor supervisor if the situation escalates beyond verbal. Female dealers report being hit on, objectified, and receiving inappropriate comments as a regular part of the job. The emotional labor of maintaining a professional demeanor while being personally attacked is a significant factor in dealer burnout and turnover."));

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
  fs.writeFileSync("/home/claude/Deployment_Bible.docx", buffer);
  console.log("Document created: " + buffer.length + " bytes");
});
