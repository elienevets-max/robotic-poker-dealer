const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, LevelFormat, Table, TableRow, TableCell, WidthType, ShadingType } = require('docx');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function headerCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: "1B2A4A", type: ShadingType.CLEAR },
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, color: "FFFFFF", font: "Arial", size: 20 })] })]
  });
}

function dataCell(text, width, opts = {}) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: opts.shaded ? { fill: "F0F4F8", type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    children: [new Paragraph({ alignment: opts.align || AlignmentType.LEFT, children: [new TextRun({ text, font: "Arial", size: 20, bold: opts.bold || false, color: opts.color || "333333" })] })]
  });
}

function totalCell(text, width, opts = {}) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: "E8EDF2", type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [new Paragraph({ alignment: opts.align || AlignmentType.LEFT, children: [new TextRun({ text, font: "Arial", size: 20, bold: true, color: "1B2A4A" })] })]
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24, color: "333333" } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "1B2A4A" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E5090" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "3A6BA5" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [
    // TITLE PAGE
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        new Paragraph({ spacing: { before: 3600 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "THE CASE FOR ROBOTIC DEALERS", size: 52, bold: true, font: "Arial", color: "1B2A4A" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          children: [new TextRun({ text: "Why Automated Dealing Is the Future of Casino Table Games", size: 32, font: "Arial", color: "2E5090" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: "2E5090", space: 12 } },
          children: [new TextRun({ text: "An Industry Thesis from the Player\u2019s Seat", size: 24, italics: true, color: "666666" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "By Elie", size: 24, color: "666666" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "Professional Poker Player | 10,000+ Hours of Live Cash Games", size: 22, color: "888888" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "February 2026", size: 22, color: "888888" })]
        }),
      ]
    },
    // MAIN CONTENT
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        // EXECUTIVE SUMMARY
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Executive Summary")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Casino table game dealing will be automated by robots. The market is already signaling this transition: electronic versions of roulette, craps, and blackjack are thriving on casino floors worldwide, with players voluntarily choosing machines over human dealers. The only games that have not yet made this transition are mechanically complex ones like poker, and recent advances in humanoid robotics suggest that barrier is rapidly closing.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("This is not an argument against dealers. Dealers are widely respected as the backbone of the casino industry, and that respect is earned. This is an argument that the system surrounding them is broken, that it fails both the people dealing and the people playing, and that technology can fix what hiring and training never could. The best dealers in the world deserve to be elevated, not ground down by a model that treats their profession as disposable seasonal labor.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("This thesis is built from over 10,000 hours at live casino tables in Las Vegas. It includes a detailed financial analysis of the World Series of Poker demonstrating that the WSOP alone could save an estimated $74 million over ten years by transitioning to robotic dealers, while preserving elite human dealers for television broadcasts, final tables, and premium events. It also surveys the competitive landscape of companies already building toward this future.")]
        }),

        // THE MARKET IS ALREADY VOTING
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("The Market Is Already Voting")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("The strongest evidence that robotic dealing will succeed is that automated table games already have. Walk through any major casino in Las Vegas and you will see packed electronic roulette terminals, stadium-style electronic blackjack, and electronic craps tables. These sections are thriving and growing. Players are voluntarily choosing machines over human-dealt games, not because they are forced to, but because the experience is better: faster pace, no judgment, play at your own rhythm, perfect accuracy every time.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Nobody sitting at an electronic roulette terminal is lamenting the absence of a human dealer. The consumer has already accepted the trade. They have voted with their feet and their wallets. The remaining question is not whether players will accept robotic dealing at more complex games. It is when the technology makes it possible.")]
        }),

        // THE EMPATHY PARADOX
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("The Empathy Paradox: Dealers Are Appreciated and the System Still Fails Them")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Every summer during the World Series of Poker, social media fills with posts about dealers. Players share stories of great dealers who kept the energy alive during a grueling twelve-hour Day 2. Poker media publishes articles calling dealers the backbone of the industry. Threads circulate reminding players to tip well, to be patient, to show empathy for the person sitting in the box. This sentiment is genuine. It reflects a real communal respect for people doing a difficult job under difficult conditions.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("And yet those same players, sometimes in the same week, will post about a dealer who killed a three-way action pot with a misdeal, or a rookie who did not know the rules of Pot-Limit Omaha, or a temp who asked whether they were supposed to shuffle between hands. Both feelings are sincere. The poker community can appreciate dealers as people and still be frustrated by the structural failures of the system those dealers are trapped in.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("This is the central insight that most discussions of casino automation miss. The argument for robotic dealers is not that dealers are bad. It is that the "), new TextRun({ text: "system", italics: true }), new TextRun(" is bad. The current model takes people who deserve better, puts them in a physically punishing job with inconsistent pay and difficult working conditions, provides inadequate training for the least experienced among them, and then asks players to tolerate the results. The empathy players feel for dealers is not a counterargument to automation. It is evidence that everyone already knows the system is failing the people inside it.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("The question is not whether dealers are valued. They are. The question is whether the current labor model is the best way to honor that value. When the same player who posts about dealer appreciation also spends six hours at a table with a dealer who is visibly miserable, dealing slowly, and making errors because they are exhausted, undertrained, or simply do not want to be there, the answer becomes clear. Appreciation for the people does not require acceptance of the system.")]
        }),

        // WHAT PLAYERS ACTUALLY WANT
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("What Players Actually Want from a Dealer")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("The Regular Player")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Professional and semi-professional players, who represent the most consistent daily customers at any casino poker room, want one thing from a dealer: efficiency. They want a dealer who is fast, makes no mistakes, does not slow down the game, and does not initiate unnecessary conversation. Politeness is appreciated. Speed and accuracy are required. The ideal dealer, from a regular\u2019s perspective, is essentially already a robot. That is not an insult. It is a specification.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("The Recreational Player")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Recreational players occasionally have more interaction with dealers. They may chat, ask questions, or treat the dealer as part of the social experience. However, at table games where players compete against each other, like poker, the primary social draw is the other players at the table, not the dealer. At games against the house, like blackjack, the dealer interaction matters more, but even there, the rise of electronic alternatives shows that most players are willing to trade that interaction for speed and convenience.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("The Universal Standard")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Across all player types, everyone appreciates a dealer who sits down, deals with speed and class, is polite, and carries themselves professionally. But those dealers are rare. They are memorable precisely because the average is so far below that standard. The inconsistency of human dealer quality is itself one of the strongest arguments for automation: a robotic dealer delivers the ideal experience every single time.")]
        }),

        // THE DEALER LABOR PROBLEM
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("A System That Fails Its Own People")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Casino dealing is a tough job, and the people who do it deserve honesty about what the job actually looks like. Long hours on your feet. Repetitive motions that cause chronic wrist and shoulder injuries over time. Inconsistent income dependent on the generosity of strangers. Constant exposure to difficult, intoxicated, or verbally abusive customers. Walk across any casino floor and you can see the reality: many dealers are not thriving. Their energy, or lack of it, directly affects the atmosphere at every table they sit at.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("The dealer labor pool is not improving. Training programs produce dealers with highly variable skill levels. Turnover is high. Recruiting for a job that offers physical strain, irregular hours, and tip-dependent pay is becoming harder as workers have more options. The dealers who are genuinely excellent are the exception, and they succeed despite the system, not because of it. This creates a chronic quality and consistency problem that no amount of hiring or training has been able to solve, because the issue is structural, not managerial.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Calling dealers the backbone of the industry while subjecting them to these conditions is a contradiction. If they truly are the backbone, then the industry owes them a model that does not wear them down, burn them out, and replace them with the next wave of undertrained temps every summer.")]
        }),

        // CASINO BUSINESS CASE
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("The Business Case for Casino Operators")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("From a casino operator\u2019s perspective, the incentives for robotic dealers are overwhelming across every dimension of the business:")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 120 },
          children: [new TextRun({ text: "Eliminate the largest operating expense. ", bold: true }), new TextRun("Dealer payroll, benefits, training, and management represent the single biggest cost center for table game operations. Robotic dealers convert this variable cost into a fixed capital investment with predictable maintenance.")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 120 },
          children: [new TextRun({ text: "24/7 operation with zero downtime. ", bold: true }), new TextRun("No breaks, no shift changes, no sick days, no dealer pushes that pause the game every 30 minutes. Continuous dealing means continuous revenue.")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 120 },
          children: [new TextRun({ text: "Perfect accuracy and speed. ", bold: true }), new TextRun("No misdeals, no misread boards, no miscounted pots, no slow dealers costing hands per hour. More hands per hour means more rake per hour.")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 120 },
          children: [new TextRun({ text: "Zero theft. ", bold: true }), new TextRun("Employee theft is a persistent and costly issue in casino operations. Robotic systems eliminate this risk entirely.")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 120 },
          children: [new TextRun({ text: "Instant scalability. ", bold: true }), new TextRun("Add or remove tables based on demand without hiring cycles, training programs, or staffing logistics.")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 120 },
          children: [new TextRun({ text: "Reduced liability and HR complexity. ", bold: true }), new TextRun("Fewer workplace injury claims, no scheduling disputes, no union negotiations, and dramatically simplified operations management.")]
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 200 },
          children: [new TextRun({ text: "Data capture and analytics. ", bold: true }), new TextRun("Every hand dealt by a robotic system can be logged automatically, enabling real-time analytics on game pace, player behavior, and revenue optimization.")]
        }),

        // WSOP CASE STUDY
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Case Study: The 2025 World Series of Poker")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("The Scale of the Problem")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("The 2025 World Series of Poker was the largest in history: 100 bracelet events, nearly 247,000 total entries, $528 million in buy-ins, $481 million returned as prize money, and $47 million retained in tournament fees. To staff this seven-week operation, the WSOP hired approximately 1,700 dealers at an average payout of over $8,000 per dealer across the series.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("And it was, by widespread consensus, the worst year for dealer quality in the event\u2019s history.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("What Happened in 2025")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Complaints began on Day 2 of the series. Professional player Christian Harder posted publicly that the dealers had no business dealing WSOP events. An experienced WSOP Circuit dealer, speaking anonymously, said there were too many dealers he had never seen before, clearly brand new, uncomfortable with every basic routine on and off the tables. One dealer was reported to have asked a player whether he was supposed to shuffle after every hand. Another dealt a misdeal, gathered the cards, and began pitching them out again without reshuffling.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("A viral video captured a distracted dealer flipping the burn card along with the flop, then mucking the wrong card, altering the outcome of the hand. The incident became a symbol for the entire series. By Week 6, players paying $10,000 to enter the Main Event were publicly expressing disbelief that rookie dealers were still making fundamental errors at the most prestigious poker event in the world.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("The WSOP historically loses 15 to 20 percent of its hired dealers within the first two weeks due to stress, workload, and dissatisfaction with pay. This forced the series to thrust inexperienced replacements into events too quickly, compounding the quality problem as the series progressed. Even experienced dealers did not want the job. A survey of poker dealers found that 74 percent had negative opinions of working the WSOP. The best dealers in the country chose to work at the Wynn, Bellagio, or Aria instead.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Note what this means for the dealers themselves. The WSOP is supposed to be the pinnacle of the profession. Instead, it is an experience that nearly three-quarters of dealers view negatively. The system does not just fail players. It fails the very people it depends on to function.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("The Key Insight")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Despite all of this, players kept coming back. The 2025 Main Event drew 9,735 entries, the third-largest field in history, generating a $90.5 million prize pool. Demand for the WSOP experience is completely decoupled from dealer quality. Nobody shows up because of the dealers. They come for the competition, the prestige, and the dream. This proves that the human dealer is not a value driver for the customer. It is a cost center for the operator and a friction point for the player.")]
        }),

        // 10-YEAR FINANCIAL MODEL
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Ten-Year Financial Model: WSOP Dealer Automation")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Current Annual Cost of Human Dealers")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Based on the 2025 WSOP data and industry benchmarks, the total annual cost of the human dealer operation extends well beyond direct compensation:")]
        }),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [5460, 3900],
          rows: [
            new TableRow({ children: [headerCell("Cost Category", 5460), headerCell("Annual Estimate", 3900)] }),
            new TableRow({ children: [dataCell("Direct dealer compensation (1,700 dealers \u00D7 $8,000 avg.)", 5460), dataCell("$13,600,000", 3900, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Floor staff, pit bosses, and tournament supervisors", 5460, { shaded: true }), dataCell("$2,500,000", 3900, { shaded: true, align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Recruitment, phone auditions, live auditions, orientation", 5460), dataCell("$1,000,000", 3900, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Dealer meals, logistics, uniforms, and break areas", 5460, { shaded: true }), dataCell("$500,000", 3900, { shaded: true, align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("HR, payroll processing, insurance, and compliance", 5460), dataCell("$1,000,000", 3900, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Training programs and quality control", 5460, { shaded: true }), dataCell("$500,000", 3900, { shaded: true, align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Attrition costs (rehiring, retraining 15-20% turnover)", 5460), dataCell("$900,000", 3900, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [totalCell("Total Estimated Annual Dealer Cost", 5460), totalCell("$20,000,000", 3900, { align: AlignmentType.RIGHT })] }),
          ]
        }),

        new Paragraph({
          spacing: { before: 200, after: 200 },
          children: [new TextRun("Assuming a conservative 3 percent annual growth due to inflation, series expansion, and rising labor costs, the ten-year cumulative cost of the human dealer model is approximately "), new TextRun({ text: "$229 million.", bold: true })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Ten-Year Human Dealer Cost Projection")] }),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 3120, 3120],
          rows: [
            new TableRow({ children: [headerCell("Year", 3120), headerCell("Annual Cost", 3120), headerCell("Cumulative Total", 3120)] }),
            new TableRow({ children: [dataCell("Year 1", 3120), dataCell("$20,000,000", 3120, { align: AlignmentType.RIGHT }), dataCell("$20,000,000", 3120, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Year 2", 3120, { shaded: true }), dataCell("$20,600,000", 3120, { shaded: true, align: AlignmentType.RIGHT }), dataCell("$40,600,000", 3120, { shaded: true, align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Year 3", 3120), dataCell("$21,218,000", 3120, { align: AlignmentType.RIGHT }), dataCell("$61,818,000", 3120, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Year 4", 3120, { shaded: true }), dataCell("$21,854,540", 3120, { shaded: true, align: AlignmentType.RIGHT }), dataCell("$83,672,540", 3120, { shaded: true, align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Year 5", 3120), dataCell("$22,510,176", 3120, { align: AlignmentType.RIGHT }), dataCell("$106,182,716", 3120, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Year 6", 3120, { shaded: true }), dataCell("$23,185,481", 3120, { shaded: true, align: AlignmentType.RIGHT }), dataCell("$129,368,198", 3120, { shaded: true, align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Year 7", 3120), dataCell("$23,881,046", 3120, { align: AlignmentType.RIGHT }), dataCell("$153,249,243", 3120, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Year 8", 3120, { shaded: true }), dataCell("$24,597,477", 3120, { shaded: true, align: AlignmentType.RIGHT }), dataCell("$177,846,720", 3120, { shaded: true, align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Year 9", 3120), dataCell("$25,335,401", 3120, { align: AlignmentType.RIGHT }), dataCell("$203,182,122", 3120, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Year 10", 3120, { shaded: true }), dataCell("$26,095,463", 3120, { shaded: true, align: AlignmentType.RIGHT }), dataCell("$229,277,585", 3120, { shaded: true, align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [totalCell("10-Year Total", 3120), totalCell("", 3120), totalCell("$229,277,585", 3120, { align: AlignmentType.RIGHT })] }),
          ]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("The Robotic Dealer Alternative")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("A fleet of approximately 500 robotic dealing units would provide sufficient coverage for peak capacity, with units redeployable across tables as needed. Based on current humanoid robot pricing trends:")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Initial Capital Investment (Year 1)")] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [5460, 3900],
          rows: [
            new TableRow({ children: [headerCell("Investment Category", 5460), headerCell("Cost", 3900)] }),
            new TableRow({ children: [dataCell("500 robotic dealing units at $60,000 per unit", 5460), dataCell("$30,000,000", 3900, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Custom poker dealing software development", 5460, { shaded: true }), dataCell("$5,000,000", 3900, { shaded: true, align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Casino floor integration and installation", 5460), dataCell("$3,000,000", 3900, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Regulatory approval and compliance", 5460, { shaded: true }), dataCell("$2,000,000", 3900, { shaded: true, align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [totalCell("Total Initial Investment", 5460), totalCell("$40,000,000", 3900, { align: AlignmentType.RIGHT })] }),
          ]
        }),

        new Paragraph({ spacing: { before: 200 }, heading: HeadingLevel.HEADING_3, children: [new TextRun("Annual Operating Costs")] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [5460, 3900],
          rows: [
            new TableRow({ children: [headerCell("Operating Category", 5460), headerCell("Annual Cost", 3900)] }),
            new TableRow({ children: [dataCell("Maintenance and repairs ($8,000 per unit per year)", 5460), dataCell("$4,000,000", 3900, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Software updates, AI improvements, and game support", 5460, { shaded: true }), dataCell("$1,500,000", 3900, { shaded: true, align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("On-site technical staff (engineers and technicians)", 5460), dataCell("$2,000,000", 3900, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Replacement parts and unit refreshes", 5460, { shaded: true }), dataCell("$1,500,000", 3900, { shaded: true, align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Elite human dealers (50\u2013100 for TV and special events)", 5460), dataCell("$1,500,000", 3900, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [totalCell("Total Annual Operating Cost", 5460), totalCell("$10,500,000", 3900, { align: AlignmentType.RIGHT })] }),
          ]
        }),

        new Paragraph({ spacing: { before: 200 }, heading: HeadingLevel.HEADING_3, children: [new TextRun("Ten-Year Total Cost of Robotic Model")] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [5460, 3900],
          rows: [
            new TableRow({ children: [headerCell("Category", 5460), headerCell("Cost", 3900)] }),
            new TableRow({ children: [dataCell("Initial capital investment (Year 1)", 5460), dataCell("$40,000,000", 3900, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Annual operating costs (Years 1\u201310)", 5460, { shaded: true }), dataCell("$105,000,000", 3900, { shaded: true, align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Mid-life fleet upgrade and refresh (Year 5)", 5460), dataCell("$10,000,000", 3900, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [totalCell("Total 10-Year Cost of Robotic Model", 5460), totalCell("$155,000,000", 3900, { align: AlignmentType.RIGHT })] }),
          ]
        }),

        new Paragraph({ spacing: { before: 300 }, heading: HeadingLevel.HEADING_2, children: [new TextRun("Net Savings Over Ten Years")] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [5460, 3900],
          rows: [
            new TableRow({ children: [headerCell("Comparison", 5460), headerCell("10-Year Cost", 3900)] }),
            new TableRow({ children: [dataCell("Human dealer model (status quo)", 5460), dataCell("$229,277,585", 3900, { align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [dataCell("Robotic dealer model (with elite human dealers retained)", 5460, { shaded: true }), dataCell("$155,000,000", 3900, { shaded: true, align: AlignmentType.RIGHT })] }),
            new TableRow({ children: [totalCell("Estimated Net Savings", 5460), totalCell("$74,277,585", 3900, { align: AlignmentType.RIGHT })] }),
          ]
        }),

        new Paragraph({
          spacing: { before: 200, after: 200 },
          children: [new TextRun("This conservative estimate of approximately "), new TextRun({ text: "$74 million in savings over ten years", bold: true }), new TextRun(" does not account for revenue gains from faster dealing speed, the declining cost of humanoid robots, or the ability to accommodate more entries per event. The break-even point on the initial capital investment occurs in approximately Year 3.")]
        }),

        // PRESERVING ELITE HUMAN DEALERS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Elevating the Best: The Role of Elite Human Dealers")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("If dealers are truly the backbone of this industry, then the best of them deserve a system that treats them accordingly. Automation does not mean the elimination of every human dealer. It means the elimination of a model that treats the profession as interchangeable, seasonal, and disposable. The best dealers in the industry, those who have spent years perfecting their craft, have a permanent and elevated role in the future of casino gaming.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Television and Streamed Events")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Final tables broadcast on PokerGO, CBS Sports, and streaming platforms require a human presence at the center of the table. These are entertainment products, and the dealer is part of the visual experience for millions of viewers. Elite dealers who carry themselves with class and authority enhance the broadcast. This is a role that rewards the best in the profession with premium compensation and visibility.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("High-Stakes and VIP Events")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Premium buy-in events like the $250,000 Super High Roller, the $50,000 Poker Players Championship, and similar elite tournaments cater to players who expect the highest level of service. These events involve a small number of tables and the best dealers in the world. Human dealers are part of that curation.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("A Better Career for Fewer Dealers")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("The current model forces the best dealers in the world to share the floor with hundreds of inexperienced temps who dilute the brand and degrade the experience. In a hybrid model, the 50 to 100 elite dealers retained for premium roles would command higher compensation, better working conditions, and genuine prestige. Being a WSOP television dealer or a high-roller event dealer becomes a distinguished position, not a grueling seasonal gig. The profession is elevated, not eliminated. The people the poker community posts about with gratitude and respect are the ones who benefit most from this transition.")]
        }),

        // WHO'S ALREADY BUILDING THIS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Who\u2019s Already Building This")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("This thesis is not speculative. Multiple companies around the world are already developing, demonstrating, or commercially deploying robotic and automated dealer systems. The competitive landscape is fragmented but accelerating.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Sharpa (Singapore) \u2014 The Most Advanced Humanoid Demo")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("In January 2026, Singapore-based Sharpa demonstrated its \u201CNorth\u201D humanoid robot at CES 2026 in Las Vegas. North dealt blackjack autonomously for eight hours a day over four days on the show floor and won a CES Innovation Award for robotics. The robot\u2019s SharpaWave hand features 22 active degrees of freedom and over 1,000 tactile sensors per fingertip, with mini cameras embedded in each finger. It can detect force changes as small as 0.005 newtons. During the demo, North also played ping-pong, took selfies, and completed a 30-step paper windmill assembly, showcasing fine motor dexterity far beyond simple card dealing. Videos of the demo went viral. Production units are targeted for mid-2026. Sharpa is a general-purpose robotics company that chose casino dealing as a demonstration use case but has not yet committed to the casino vertical as a primary market.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Creedroomz (Armenia) \u2014 Commercially Deployed Today")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Creedroomz is the first and only company with a robotic dealer in actual commercial use. Its \u201CRoba\u201D system, a robotic arm rather than a humanoid, has been operational since 2022 in online live casino studios, dealing baccarat and Dragon Tiger around the clock. The company has partnered with over 1,000 operators including Betfair. Roba deals cards, collects them, loads the shuffler, manages outcomes, and operates at adjustable dealing speeds set by the operator. Creedroomz has positioned Roba as a complement to human dealers rather than a replacement, but the commercial viability of the model has been proven. They are expanding to blackjack.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("LT Game / Paradise Entertainment (Hong Kong) \u2014 The Longest-Running Player")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("LT Game, a subsidiary of publicly-traded Paradise Entertainment, has been developing robotic dealer prototypes since 2015. Their \u201CMin\u201D humanoid electronic croupier dealt cards 30 percent faster than human dealers and featured face recognition for VIP personalization. By 2019, their ADV2 LT Intelligent model was ready for casino deployment, specifically targeting the Macau market where regulatory restrictions require all dealers to be local residents, creating chronic labor shortages. In 2025, LT Game pivoted further into AI-powered systems through its \u201CHouse of Play\u201D platform, offering customizable AI dealer appearances that can be modified for different cultural markets. LT Game understands the casino industry better than any other company in this space.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("The Gap Nobody Has Filled")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Sharpa is demonstrating with blackjack. Creedroomz is deployed with baccarat. LT Game built for Macau\u2019s simple game formats. Nobody is building specifically for live casino poker dealing. Poker is the most complex table game to automate: full-deck shuffling, accurate multi-position card pitching, complex pot management, side pot calculations, reading player actions in real time, and handling mixed-game formats with different rule sets. This complexity is precisely why poker will be the last game automated and why the competitive moat for whoever solves it will be enormous. The companies building the robots understand engineering. They do not understand what a poker dealer actually does at a level that would let them design the product correctly. That gap between robotics capability and casino domain expertise is where the opportunity lives.")]
        }),

        // TECHNOLOGY READINESS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Technology Readiness")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("In early 2025, dozens of Unitree G1 humanoid robots performed the world\u2019s first fully autonomous robot cluster Kung Fu performance, executing quick and precise movements in coordinated formations. These robots demonstrated balance, speed, fine motor coordination, and real-time autonomous adaptation, all without human control.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("The cost curve is declining rapidly. The Unitree G1 is already available at $13,500. The Unitree H2, a full-size commercial humanoid, is available at $29,900. Tesla\u2019s Optimus is targeting $25,000 to $30,000 at production scale. Figure AI\u2019s robots are entering commercial deployment with BMW. The price trajectory mirrors the early days of industrial automation: expensive prototypes give way to affordable commercial units within years of first deployment.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Compared to autonomous martial arts choreography, the physical demands of casino dealing are dramatically simpler. The dexterity, precision, and responsiveness required to shuffle, pitch cards, and manage a table are well within the current capability envelope. The missing piece is not whether the technology can do it, but whether anyone in the casino industry is paying attention to the fact that it almost can.")]
        }),

        // IMPLEMENTATION PATHWAY
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Implementation Pathway")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 1: Simple Table Games")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Electronic and semi-automated versions of roulette, blackjack, and craps are already deployed and accepted. The next step is humanoid robotic dealers for these simpler games, validating the concept in a live casino environment. Sharpa\u2019s CES demo and Creedroomz\u2019s commercial deployment show this phase is already underway.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 2: Tournament Poker")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Tournament poker is the ideal bridge to full automation. Standardized structure, controlled environment, and the most acute pain point in the industry: surge staffing for major events. The WSOP and similar festivals are natural first adopters because the business case is immediate, player tolerance for imperfect dealers is proven, and the financial savings are substantial.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 3: Cash Game Poker")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Cash games require more nuanced dealing due to variable bet sizes, complex pot structures, and the continuous nature of the game. By this stage, the technology will have been refined through simpler deployments and the casino industry will have developed operational comfort with robotic dealing.")]
        }),

        // OPPORTUNITY GAP
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("The Opportunity Gap")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("The casino industry is notoriously slow to adopt new technology. Robotics companies understand engineering but not casino operations, game procedures, player psychology, or gaming regulations. Casino operators understand their business but are not tracking the pace of robotics development. This gap creates a high-value opportunity for those who can bridge both worlds: translating player needs into product requirements, designing deployment strategies, solving experiential questions, and navigating the regulatory landscape.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("The people best positioned for this role are those who have spent real time on both sides of the table and understand what actually matters to the people sitting in the seats. Not what market research assumes. Not what casino executives guess from their offices. What the player in Seat 5 actually thinks when a new dealer sits down.")]
        }),

        // CONCLUSION
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Conclusion")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Robotic casino dealers are inevitable. Every signal points in the same direction: players prefer automated alternatives when available, the dealer labor model is structurally broken and worsening, the business case for operators is overwhelming, and the technology is advancing faster than the casino industry is prepared for. Companies in Singapore, Armenia, and Hong Kong are already building and deploying. The WSOP alone could save over $74 million in a decade while simultaneously improving the experience for players and working conditions for the dealers who remain.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("This transition does not have to come at the expense of the people the poker community rightfully respects. The best dealers will not be replaced. They will be elevated to premium roles with better compensation, more prestige, and working conditions that match the skill they bring to the table. The dealers who are celebrated as the backbone of this industry deserve a system worthy of that description. The current model is not it.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("The insights in this document come not from market research reports or theoretical analysis. They come from a professional who has spent over 10,000 hours watching this industry from the seat that matters most: the one at the table.")]
        }),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/claude/The_Case_For_Robotic_Dealers.docx", buffer);
  console.log("Document created successfully");
});
