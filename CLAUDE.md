# Robotic Poker Dealer — Deployment Bible & Thesis

## Project Owner
Elie — Professional poker player (2021–present, $800K+ in live cash games 2/5 to 25/50, primarily at the Wynn, Las Vegas). Deep domain expertise in dealer mechanics, game flow, player behavior, and casino operations. Currently transitioning into AI/automation and exploring how to bridge poker expertise with technology ventures.

## What This Project Is

Two interconnected documents that together form the most comprehensive specification ever written for automating poker dealing:

### 1. The Deployment Bible (`src/deployment_bible.js`)
A **complete technical specification** of everything a human poker dealer does — from shuffle to pot push — written so that an engineering team could use it to build a robotic poker dealer. Each section covers:
- **What the dealer does** (exact mechanics)
- **Why they do it** (game integrity, speed, player experience)
- **What goes wrong** when done incorrectly (common errors)
- **What a robot must replicate** to match or exceed human performance

**Current sections (14 + appendices):**
1. Purpose of This Document
2. The Complete Shuffle Sequence (wash, collect, riffle, box, cut)
3. The Card Pitch (grip, mechanics, exposed cards, edge cases)
4. Community Cards: Flop, Turn, River (transitions, burn cards, board presentation)
5. Betting Round Management (action tracking, bets/calls, making change, pot management)
6. Side Pots and Multi-Way All-Ins (core principle, 3-way procedure, split pots, quartering)
7. Error Recovery and Misdeals (misdeal conditions, exposed card procedures, stub count)
8. Chip Handling and Bank Management (cutting chips, moment-of-contact, security protocols, the bank)
9. Game Variations and Mixed Games (Hold'em, PLO, Omaha Hi-Lo, Stud, HORSE, Double Board Bomb Pots)
10. Player Interaction and Table Management (string bets, out-of-turn action, verbal vs physical, pace)
11. Tournament-Specific Procedures (color-up, table breaks, hand-for-hand, final table)
12. Regulatory and Compliance (Nevada Gaming Control Board, game integrity, fail-safe, Virginia model)
13. Security and Game Protection (anti-cheating, surveillance integration)
14. The Human Dealer Experience: What Automation Replaces (physical toll, compensation, player abuse)
- Appendix A: Complete Hand Cycle Checklist

### 2. The Case for Robotic Dealers (`src/thesis_case_for_robotic_dealers.js`)
A **business/investor thesis** arguing why robotic poker dealers are inevitable. Covers:
- The $8B+ annual labor cost problem in casino poker
- Precedent from electronic table games (roulette, blackjack already automated)
- The dealer shortage crisis (casinos can't hire enough qualified dealers)
- Player experience improvements (speed, accuracy, no tipping anxiety)
- Regulatory pathway (Nevada, Virginia charitable gaming model)
- Competitive landscape analysis
- Financial model: ROI for casinos deploying robotic dealers
- 5-year market timeline

## Source Material

### TruePokerDealer YouTube Channel
The primary knowledge source. Mark Shumaker's channel is the most comprehensive poker dealing education resource online — used by dealer schools and self-taught dealers worldwide.

**Transcripts extracted** (`transcripts/` directory):
- `transcripts_organized.txt` — 11 public video transcripts, organized by category
- `all_transcripts.json` — Full extraction results (56 videos attempted, 11 successful)

**Categories of extracted content:**
- CORE_DEALING_MECHANICS: Shuffle (including long fingernails variant), pitch mechanics, card spreads
- CHIP_HANDLING: Chip cutting (Lesson 5a), chip facts, moment-of-contact principle
- GAME_PROCEDURES: All-in button use, hand rankings, flop/turn/river dealing, stub counting

### What's Still Missing (45 Members-Only Videos)
These are behind YouTube's membership paywall and could not be extracted programmatically:
- **Lessons 2-4**: Train With Me (shuffle), Pitch Mechanics, Pitch Situations
- **Lessons 7-14**: Chip handling, rack maintenance, tray interactions, betting rounds
- **Lesson 17**: Pre-flop action management
- **Lessons 19-38**: The core advanced curriculum (newly edited):
  - Lesson 19: Complete hand walkthrough (CRITICAL — full dealing cycle start to finish)
  - Lesson 28: Misdeals (CRITICAL — error recovery procedures)
  - Lesson 32: Side pots (CRITICAL — multi-way all-in pot calculations)
  - Lessons on tournament procedures, mixed games, player management
- **10 Bonus Videos**: Omaha, Stud, and mixed game dealing specifics

## How the JS Files Work

Both main files are Node.js scripts that generate `.docx` Word documents using the `docx` npm package. To generate:

```bash
npm install docx
node src/deployment_bible.js        # → outputs Deployment_Bible.docx
node src/thesis_case_for_robotic_dealers.js  # → outputs The_Case_For_Robotic_Dealers.docx
```

The JS files contain ALL content inline (no external data files). Document structure, formatting, and text are all in the same file. This makes them self-contained but large (~73KB and ~47KB respectively).

## Key Domain Knowledge

### The Dealing Cycle (What a Robot Must Do)
1. **Shuffle**: Wash → Collect → Square → Riffle → Riffle → Box → Riffle → Cut → Deck grip
2. **Pitch**: Push card off deck → Grip with thumb/forefinger → Middle finger projects → Card lands face-down in front of player
3. **Pre-flop action**: Track bets starting left of big blind, manage raises, bring pot to center
4. **Flop**: Tap table → Burn card (protected!) → Deal 3 community cards with felt gaps → Display
5. **Turn/River**: Tap → Burn → Single card → Display
6. **Betting rounds**: Track action clockwise, manage bets/calls/raises, make change, build pot
7. **Side pots**: When players all-in with unequal stacks, isolate pots by stack size (smallest first)
8. **Showdown**: Determine winner(s), push pot, collect cards, prepare for next hand
9. **Error recovery**: Misdeals, exposed cards, stub counting (verify 52 cards)

### Critical Principles a Robot Must Understand
- **Moment-of-contact**: When cutting chips, the index finger slides across until it contacts the reference stack at exactly the right height — this is how dealers verify chip counts by feel
- **Clearing hands**: Dealers must show empty palms to cameras between every chip transaction
- **No hand-to-hand transfers**: Chips always go through the felt surface, never directly between hands
- **Burn card protection**: The burn card must NEVER be visible during the entire motion — hand covers it from deck to felt
- **Card protection**: Deck always faces away from dealer, forefinger protects front edge
- **Fingertip rule**: Only fingertips touch chips in the tray — prevents palming

### Game Variants the Robot Needs
- **Texas Hold'em (NL/Limit)**: 2 hole cards, 5 community, best 5 of 7
- **PLO (Pot-Limit Omaha)**: 4 hole cards, MUST use exactly 2 hole + 3 board (common dealer error: not verifying)
- **Omaha Hi-Lo / Big O**: Split pot games, qualifying low hand (8 or better)
- **Seven-Card Stud**: No community cards, complex dealing pattern with up/down cards
- **HORSE / Mixed Games**: Rotation of game types, dealer must know all rules
- **Double Board Bomb Pots**: Two separate boards, complex quartering procedures

### The Framing Technique (PLO Hand Reading)
In PLO, with 4 hole cards and 5 board cards, there are many possible hand combinations. Dealers use "framing" — mentally pairing each possible 2-card combination from the player's hand with the best 3 cards from the board. This is the hardest skill for dealers to master and a huge advantage for robotic systems (instant computation vs. human error-prone mental math).

## What to Work On Next

### Priority 1: Fill Content Gaps
The deployment bible is comprehensive for the sections it covers, but the 45 missing transcripts mean some sections are thinner than they could be. The owner (Elie) has 10,000+ hours of live table experience and can provide:
- Detailed edge cases and "what actually happens" scenarios
- Player behavior patterns that affect dealing decisions
- Casino-specific procedures (Wynn vs. other rooms)
- Tips/tricks that aren't in any training material

### Priority 2: Robotic Engineering Spec
Transform the deployment bible from "what dealers do" to "what the robot must do" with:
- Specific sensor requirements (card identification, chip counting, player tracking)
- Actuator specifications (card pitching mechanism, chip handling arms)
- Software state machine (game state tracking, rule enforcement, error detection)
- Fail-safe procedures (what happens when the robot makes an error)

### Priority 3: Investor-Ready Materials
The thesis needs to be polished into a pitch-ready document with:
- Updated competitive landscape (who else is working on this)
- Financial projections refined with real casino operating data
- Regulatory pathway timeline
- Go-to-market strategy

## Style & Formatting Notes
- Documents use professional formatting: Navy headers, Arial font, structured tables
- The deployment bible uses a consistent pattern: h1 (section) → h2 (subsection) → h3 (detail) → para (body text)
- Tables are used for specification summaries (task | detail | robot requirement)
- Tone is authoritative but accessible — written for both engineers and casino executives

## File Structure
```
robotic-poker-dealer/
├── CLAUDE.md              ← You are here
├── src/
│   ├── deployment_bible.js              ← Main spec (72KB, 589 lines)
│   ├── thesis_case_for_robotic_dealers.js ← Business thesis (47KB)
│   └── thesis_v2.js                     ← Earlier thesis draft (39KB)
├── docs/
│   ├── Deployment_Bible.docx            ← Generated Word doc
│   └── The_Case_For_Robotic_Dealers.docx ← Generated Word doc
├── transcripts/
│   ├── transcripts_organized.txt        ← 11 public video transcripts by category (188KB)
│   └── all_transcripts.json             ← Full extraction data (172KB)
└── research/                            ← Future: competitive analysis, patents, etc.
```
