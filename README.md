# Self-Define Skills (Alpha)

> **Status: Alpha**  
> These skills are experimental and not yet considered stable. Expect changes to prompts, structure, and behavior as I refine them through daily use.

A small set of agent skills I built for my own workflow, extending ideas from [mattpocock/skills](https://github.com/mattpocock/skills).

Currently focused on two things:

1. Adding a Charlie Munger-style "invert, always invert" pass after grilling or ticket-breaking sessions.
2. Extending TDD with a built-in Verify gate so code is checked against the originating spec and project standards before the loop ends.

## Skills

### `/grill-me-invert`

Run after `/grill-me`. Reads the previous grilling output from context and relentlessly questions the plan, decision, or idea from reverse angles:

1. **Risk Scan** — single points of failure, hidden dependencies, second-order effects.
2. **Invert Assumptions** — flip the plan's foundational premises.
3. **Devil's Advocate** — attack each key decision as an opponent would.
4. **Inversion From Failure** — assume the plan fails in 3 years, then work backwards.

See [`skills/productivity/grill-me-invert/SKILL.md`](./skills/productivity/grill-me-invert/SKILL.md).

### `/to-tickets-invert`

Run after `/to-tickets`. Reads the previous ticket breakdown from context and checks it for hidden risks, reversed assumptions, and fragile dependencies. Produces a structured review report + a diff of suggested changes, then optionally drills deeper into specific risks.

See [`skills/engineering/to-tickets-invert/SKILL.md`](./skills/engineering/to-tickets-invert/SKILL.md).

### `/tdd-loop`

A fork of [`/tdd`](https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md) with a mandatory Verify gate. Runs the full `RED → GREEN → VERIFY` loop, where VERIFY checks the diff against the originating issue/spec and project standards.

See [`skills/engineering/tdd-loop/SKILL.md`](./skills/engineering/tdd-loop/SKILL.md).

## Install

### For Claude Code / Codex / OpenCode

Use the same installer as [mattpocock/skills](https://github.com/mattpocock/skills):

```bash
npx skills@latest add BigLeeChateau/self-define-skills
```

Then pick the skills you want and the agents you want to install them on.

### For Kimi Code CLI

Clone or keep this repo anywhere, then symlink the skill directories:

```bash
ln -s /path/to/self-define-skills/skills/productivity/grill-me-invert ~/.agents/skills/grill-me-invert
ln -s /path/to/self-define-skills/skills/engineering/to-tickets-invert ~/.agents/skills/to-tickets-invert
ln -s /path/to/self-define-skills/skills/engineering/tdd-loop ~/.agents/skills/tdd-loop
```

## Why Alpha?

- Prompts have not been battle-tested across enough real plans.
- The balance between "relentless grilling" and "structured report" may shift.
- Cross-agent compatibility (Kimi, Claude, Codex, OpenCode) is not fully verified.
- The `/tdd-loop` Verify gate relies on sub-agent review, which can still suffer from model hallucination or confirmation bias.

Use at your own discretion, and please open an issue if something feels off.

## License

MIT
