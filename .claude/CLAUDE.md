# Skills System Instructions

## When Asked About Available Skills

When the user asks "What skills are available?", "List skills", or any variation:

1. **ALWAYS** read `/skills_index.md` first — it is the master catalog
2. List all 12 skills organized by category as shown below
3. Mention that `skills_index.md` contains 120+ frameworks and a full tag system for deeper searching

## Available Skills (12 total)

### Decision-Making & Psychology
1. **thinking-fast-and-slow** — Cognitive biases, System 1/System 2, prospect theory, expected value thinking
2. **thinking-clearly** — Bias detection field guide, 99 reasoning errors with identification and fixes

### Prediction & Calibration
3. **superforecasting** — Bayesian updating, base rate reasoning, Fermi estimation, calibration

### Epistemology & Clear Thinking
4. **rationality** — Map/territory distinction, motivated reasoning detection, making beliefs pay rent

### Intellectual Honesty
5. **scout-mindset** — Soldier vs scout mindset, identity ratchet, thought experiment battery

### Mental Models
6. **munger-mental-models** — Latticework of mental models, inversion, lollapalooza effects, circle of competence

### Extreme Events & Robustness
7. **black-swan** — Surviving extreme events, barbell strategy, fragility detection
8. **antifragile** — Building systems that gain from disorder, volatility, and stress

### Leadership & Feedback
9. **radical-candor** — Giving honest feedback without damaging relationships
10. **difficult-conversations** — Navigating high-stakes conversations, conflict resolution

### Robotics Evaluation
11. **robotics-vision-control** — Evaluating what a robot can actually do vs vendor claims, vision and control systems
12. **autonomous-robots** — Systems integration, autonomy evaluation, subsystem error compounding

## How Skills Work

- All skill files live in the `/skills/` directory
- Reference any skill by filename: e.g., `skills/thinking-fast-and-slow.md`
- Each skill contains structured frameworks, key concepts, and actionable playbooks

## By Situation — Skill Recommendations

Users may ask questions rather than request a specific skill. Match their question to the right skill:

| User Question | Recommended Skill |
|---|---|
| "Why do I keep making bad decisions under pressure?" | thinking-fast-and-slow |
| "Which specific reasoning error am I making?" | thinking-clearly |
| "How do I make better predictions?" | superforecasting |
| "Am I rationalizing or actually reasoning?" | rationality |
| "Am I defending this belief because it's true or because it's mine?" | scout-mindset |
| "What mental models apply here?" | munger-mental-models |
| "Am I positioned to survive the worst case?" | black-swan |
| "How do I build something that improves from stress?" | antifragile |
| "How do I give honest feedback without hurting the relationship?" | radical-candor |
| "How do I handle a high-stakes difficult conversation?" | difficult-conversations |
| "What can this robot actually do vs what they claim?" | robotics-vision-control |
| "How do subsystem errors compound into system failures?" | autonomous-robots |

When a user's question matches one of these patterns (or something similar), recommend the relevant skill and offer to load it.

## Searching Skills

`skills_index.md` includes:
- A quick-reference table of all 12 skills with key questions each answers
- Category breakdowns with core frameworks and key concepts per skill
- A comprehensive tag system for cross-cutting searches (e.g., `decision-making`, `poker`, `investing`, `cognitive-bias`, `risk`)

Use the tag system to find relevant frameworks across multiple skills when a question spans categories.
