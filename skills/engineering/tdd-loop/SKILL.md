---
name: tdd-loop
description: Test-driven development with a built-in spec/standards verification gate. Use when you want RED→GREEN→REFACTOR→VERIFY, where VERIFY checks code against the originating issue/spec and project standards.
---

# TDD Loop

A fork of [mattpocock/skills/tdd](https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md) with one addition: a mandatory **Verify** gate after Refactor.

Tests going green is not enough. This skill keeps the code aligned with the originating issue/spec and the project's documented standards before the loop ends.

## Philosophy

**Core principle**: Tests should verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't.

**Additional principle**: A TDD cycle ends at **Verify**, not at green tests. The Verify gate checks that the implementation matches the spec and standards that the tests alone may not enforce.

## Workflow

```
Planning → Tracer Bullet → Incremental Loop → Refactor → Verify → Done
```

### 1. Planning

Before writing any code:

- [ ] Confirm with the user what interface changes are needed.
- [ ] Confirm which behaviors to test (prioritize critical paths).
- [ ] Identify opportunities for deep modules.
- [ ] Design interfaces for testability.
- [ ] List the behaviors to test.
- **Record the starting commit**: `git rev-parse HEAD`. This is the fixed point for the final diff.
- **Record the spec source**: the originating issue, PRD, or spec file that this TDD cycle implements. Ask the user if it's not obvious.
- **List spec items NOT covered by tests**: explicitly note which acceptance criteria or spec clauses are out of scope for this cycle, so the Verify gate doesn't falsely flag them.
- [ ] Get user approval on the plan.

### 2. Tracer Bullet

Write ONE test that confirms ONE thing about the system:

```
RED: Write test for first behavior → test fails
GREEN: Write minimal code to pass → test passes
```

### 3. Incremental Loop

For each remaining behavior:

```
RED: Write next test → fails
GREEN: Minimal code to pass → passes
```

Rules:

- One test at a time.
- Only enough code to pass the current test.
- Don't anticipate future tests.
- Keep tests focused on observable behavior.

### 4. Refactor

After all tests pass:

- [ ] Extract duplication.
- [ ] Deepen modules.
- [ ] Apply SOLID principles where natural.
- [ ] Run tests after each refactor step.

**Never refactor while RED.**

### 5. Verify

The Verify gate runs **after** Refactor and is mandatory for `/tdd-loop`. If the user does not want verification, they should use `/tdd` instead.

#### 5.1 Capture the diff

Use the starting commit recorded in Planning:

```bash
git diff <start-commit>...HEAD
```

Also capture the list of commits:

```bash
git log <start-commit>..HEAD --oneline
```

#### 5.2 Identify standards sources

Find project standards docs such as `CODING_STANDARDS.md`, `CONTRIBUTING.md`, `AGENTS.md`, `CLAUDE.md`, or similar.

#### 5.3 Spawn parallel review sub-agents

Run two sub-agents in parallel. Neither should see the TDD conversation history or intermediate reasoning — only the diff, the spec, and the standards.

**Standards sub-agent**

- Input: diff command, commit list, standards sources.
- Brief: "Report every place the diff violates a documented standard. Cite the standard (file + rule). Distinguish hard violations from judgement calls. Skip anything tooling already enforces. Under 400 words."

**Spec sub-agent**

- Input: diff command, commit list, spec source.
- Brief: "Report: (a) spec requirements that are missing or partial; (b) behavior in the diff that wasn't asked for (scope creep); (c) requirements that look implemented but where the implementation looks wrong. Quote the spec for each finding. Under 400 words."

#### 5.4 Classify findings

Map each finding into one of three buckets:

| Type | Meaning | Action |
|------|---------|--------|
| **Type 1** | Spec conflicts with tests / reality | Record, present to user after full review |
| **Type 2 Major** | Implementation misses spec; fixing it won't break tests | Stop and ask user |
| **Type 2 Minor** | Implementation misses spec; low-risk fix | Auto-fix, then re-verify |

#### 5.5 Auto-fix Type 2 Minor

Apply minor fixes. After all minor fixes are applied, re-run:

- The full test suite.
- The full Verify gate (up to a maximum of 3 rounds to prevent loops).

If a minor fix introduces new findings, classify them again.

#### 5.6 Present the report

Output structure:

```markdown
## TDD Loop Verdict

**Status**: PASS | NEEDS_FIX | SPEC_CONFLICT
- Tests: ✅ green
- Spec compliance: <summary>
- Standards: <summary>

## Type 1 — Spec/Test Conflicts
| Spec Reference | Spec Text | Conflict | Recommendation |

## Type 2 Major — Needs Your Decision
| Spec Reference | Issue | Why It Matters | Options |

## Type 2 Minor — Auto-Fixed
| Spec Reference | Issue | Fix Applied |

## Next Step
- If PASS: suggest committing.
- If NEEDS_FIX: wait for user decision on each Type 2 Major.
- If SPEC_CONFLICT: wait for user decision on each Type 1.
```

Write the full report to `.tdd-review/<timestamp>-<issue-slug>.md`.

#### 5.7 Handle Type 1 and Type 2 Major

For each Type 1 or Type 2 Major finding, stop and ask the user:

- Fix the implementation to match spec?
- Update the spec to match implementation/reality?
- Accept the deviation and record it in `docs/deviations/` or the report?

Do not proceed until the user resolves every major finding.

## Checklist Per Cycle

```
[ ] Test describes behavior, not implementation
[ ] Test uses public interface only
[ ] Test would survive internal refactor
[ ] Code is minimal for this test
[ ] No speculative features added
[ ] Starting commit recorded
[ ] Spec source recorded
[ ] Uncovered spec items explicitly listed
[ ] Verify gate completed
```

## Rules

- One test at a time during RED/GREEN.
- Never refactor while RED.
- Verify is mandatory for `/tdd-loop`. Use `/tdd` if you want the original behavior without the gate.
- Review sub-agents must not see TDD conversation history or reasoning.
- Every spec finding must quote the spec.
- Every standards finding must cite the standard source.
- Type 2 Minor fixes trigger a re-verify (max 3 rounds).
- Major findings always stop for user decision.
- Use the user's language for all output.
