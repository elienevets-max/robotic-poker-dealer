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
          children: [new TextRun("This thesis is built from over 10,000 hours spent at live casino tables in Las Vegas, observing the reality of dealer quality, player preferences, casino operations, and the growing gap between what the industry needs and what the human labor model can deliver. It includes a detailed financial analysis of the World Series of Poker, demonstrating that the WSOP alone could save an estimated $80 to $120 million over a ten-year period by transitioning to robotic dealers while preserving elite human dealers for television broadcasts, final tables, and premium events.")]
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
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("The Dealer Labor Problem")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Casino dealing is a tough job. Long hours on your feet, repetitive motions that cause chronic wrist and shoulder injuries, inconsistent income dependent on tips, and constant exposure to difficult or intoxicated customers. Walk across any casino floor and you can see the reality: many dealers are visibly unhappy. Their energy, or lack of it, directly affects the atmosphere at the table and the experience for every player sitting in front of them.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("The dealer labor pool is not improving. Training programs produce dealers with highly variable skill levels. Turnover is high. Recruiting for a job that offers physical strain, irregular hours, and tip-dependent pay is becoming harder as workers have more options. This creates a chronic quality and consistency problem that no amount of hiring or training has been able to solve, because the issue is structural, not managerial.")]
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

        // Cost breakdown table
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
          children: [new TextRun("With the WSOP growing each year, expanding from 99 events in 2024 to 100 in 2025 and likely continuing to add events, these costs will increase. Assuming a conservative 3 percent annual growth in dealer-related expenses due to inflation, series expansion, and rising labor costs, the ten-year cumulative cost of the human dealer model is approximately "), new TextRun({ text: "$229 million.", bold: true })]
        }),

        // 10-year human cost table
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

        // ROBOT MODEL
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("The Robotic Dealer Alternative")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("A robotic dealer fleet eliminates the need for 1,700 human dealers because robots do not require shift rotations, breaks, or replacements. A fleet of approximately 500 robotic dealing units would provide sufficient coverage for peak capacity during the largest events, with units redeployable across tables as needed. Based on current humanoid robot pricing trends, with commercial units from companies like Unitree, Tesla, and Figure AI entering the $25,000 to $75,000 range, the following model estimates total cost of ownership:")]
        }),

        // Robot cost table
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

        // SAVINGS SUMMARY
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
          children: [new TextRun("This conservative estimate of approximately "), new TextRun({ text: "$74 million in savings over ten years", bold: true }), new TextRun(" does not account for additional revenue gains from faster dealing speed, which would produce more hands per tournament level and potentially accommodate more entries per event. It also does not account for the declining cost of humanoid robots, which are on a trajectory similar to industrial automation, meaning the actual savings are likely significantly higher. The break-even point on the initial capital investment occurs in approximately Year 3.")]
        }),

        // PRESERVING ELITE HUMAN DEALERS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("The Role of Elite Human Dealers")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Automation does not mean the elimination of every human dealer. The best dealers in the industry, those who have spent years perfecting their craft and who bring genuine skill, personality, and professionalism to the table, have a permanent and elevated role in the future of casino gaming. The transition to robotic dealers should preserve and celebrate these individuals rather than displace them.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Television and Streamed Events")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Final tables broadcast on PokerGO, CBS Sports, and streaming platforms require a human presence at the center of the table. These are entertainment products, and the dealer is part of the visual experience for millions of viewers. Elite dealers who carry themselves with class and authority enhance the broadcast. This is a role that rewards the best in the profession with premium compensation and visibility.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("High-Stakes and VIP Events")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Premium buy-in events like the $250,000 Super High Roller, the $50,000 Poker Players Championship, and similar elite tournaments cater to players who expect the highest level of service. These events involve a small number of tables and a small number of the best dealers in the world. The experience here is curated, not mass-produced, and human dealers are part of that curation.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Special Occasions and Ceremonial Moments")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Opening ceremonies, heads-up championship matches, charity events, and other moments where the human element adds to the occasion will always benefit from a skilled human dealer. These are the events where the audience is small, the stakes are personal, and the tradition of the game matters most.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("A Better Career for Fewer Dealers")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("The current model forces the best dealers in the world to share the floor with hundreds of inexperienced temps who dilute the brand and degrade the experience. In a hybrid model, the 50 to 100 elite dealers retained for premium roles would command higher compensation, better working conditions, and genuine prestige. Being a WSOP television dealer or a high-roller event dealer becomes a distinguished position, not a grueling seasonal gig. The profession is elevated, not eliminated.")]
        }),

        // TECHNOLOGY READINESS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("The Technology Is Ready Sooner Than Expected")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("In early 2025, dozens of Unitree G1 humanoid robots performed the world\u2019s first fully autonomous robot cluster Kung Fu performance, executing quick and precise movements in coordinated formations. These robots demonstrated balance, speed, fine motor coordination, and real-time autonomous adaptation, all without human control.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("The cost curve is declining rapidly. The Unitree G1 is already available at $13,500. The Unitree H2, a full-size commercial humanoid, is available at $29,900. Tesla\u2019s Optimus is targeting $25,000 to $30,000 at production scale. Figure AI\u2019s robots are entering commercial deployment with BMW. The price trajectory of humanoid robots mirrors the early days of industrial automation: expensive prototypes give way to affordable commercial units within a few years of the first deployments.")]
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
          children: [new TextRun("Electronic and semi-automated versions of roulette, blackjack, and craps are already deployed and accepted. The next step is humanoid robotic dealers for these simpler games, where the dealing mechanics are straightforward and the player has already demonstrated willingness to interact with a machine.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 2: Tournament Poker")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Tournament poker is the ideal bridge to full automation. The game structure is standardized, the environment is controlled, and the biggest pain point, surge staffing for major events, is well-documented. The WSOP and similar festivals are natural first adopters because the business case is immediate, the player tolerance for imperfect dealers is proven, and the financial savings are substantial.")]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Phase 3: Cash Game Poker")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Cash games require more nuanced dealing because of variable bet sizes, complex pot structures, and the continuous nature of the game. By this stage, the technology will have been refined through simpler deployments and the casino industry will have developed operational comfort with robotic dealing.")]
        }),

        // OPPORTUNITY GAP
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("The Opportunity Gap")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("The casino industry is notoriously slow to adopt new technology. When robotic dealing technology reaches deployment readiness, there will be a significant gap between what is possible and what casinos are implementing. Robotics companies understand engineering but not casino operations, game procedures, player psychology, or gaming regulations. Casino operators understand their business but are not tracking the pace of robotics development.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("This gap creates a high-value opportunity for individuals and companies that can bridge both worlds: translating player needs into product requirements, designing deployment strategies, solving experiential questions, and navigating the regulatory landscape. The people best positioned to fill this role are those who have spent real time on both sides of the table and understand what actually matters to the people sitting in the seats.")]
        }),

        // CONCLUSION
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Conclusion")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("Robotic casino dealers are inevitable. Every signal points in the same direction: players prefer automated alternatives when available, the dealer labor model is structurally broken and worsening, the business case for operators is overwhelming, and the robotics technology is advancing faster than the casino industry is prepared for. The WSOP alone could save over $74 million in a decade while simultaneously improving the player experience.")]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun("The transition will not eliminate all human dealers. The best in the profession will be elevated to premium roles in television, high-stakes events, and special occasions, earning more respect and better compensation than today\u2019s model provides. The result is a better product for players, a better business for operators, and a better career for the dealers who have earned their place at the top of the profession.")]
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
  fs.writeFileSync("/home/claude/robotic_dealers_thesis_v2.docx", buffer);
  console.log("Document created successfully");
});
