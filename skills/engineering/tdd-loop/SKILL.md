---
name: tdd-loop
description: Test-driven development with a built-in spec/standards verification gate. Use when you want RED→GREEN→VERIFY, where VERIFY checks code against the originating issue/spec and project standards.
---

# TDD Loop

A fork of [mattpocock/skills/tdd](https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md) with one addition: a mandatory **Verify** gate after the red → green loop.

Tests going green is not enough. This skill keeps the code aligned with the originating issue/spec and the project's documented standards before the loop ends.

## Philosophy

**Core principle**: Tests should verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't.

**Additional principle**: A TDD cycle ends at **Verify**, not at green tests. The Verify gate checks that the implementation matches the spec and standards that the tests alone may not enforce.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. A good test reads like a specification — "user can checkout with valid cart" tells you exactly what capability exists — and survives refactors because it doesn't care about internal structure.

## Seams — where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** Before writing any test, write down the seams under test and confirm them with the user. No test is written at an unconfirmed seam. You can't test everything — agreeing the seams up front is how testing effort lands on the critical paths and complex logic instead of every edge case.

Ask: "What's the public interface, and which seams should we test?"

## Anti-patterns

- **Implementation-coupled** — mocks internal collaborators, tests private methods, or verifies through a side channel (querying the database instead of using the interface). The tell: the test breaks when you refactor but behavior hasn't changed.
- **Tautological** — the assertion recomputes the expected value the way the code does (`expect(add(a, b)).toBe(a + b)`, a snapshot derived by hand the same way, a constant asserted equal to itself), so it passes by construction and can never disagree with the code. Expected values must come from an independent source of truth — a known-good literal, a worked example, the spec.
- **Horizontal slicing** — writing all tests first, then all implementation. Bulk tests verify _imagined_ behavior: you test the _shape_ of things rather than user-facing behavior, the tests go insensitive to real changes, and you commit to test structure before understanding the implementation. Work in **vertical slices** instead — one test → one implementation → repeat, each test a **tracer bullet** that responds to what the last cycle taught you.

## Workflow

```
Planning → Tracer Bullet → Incremental Loop → Verify → Done
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
- Never refactor while RED.

### 4. Verify

The Verify gate runs **after** the red → green loop and is mandatory for `/tdd-loop`. If the user does not want verification, they should use `/tdd` instead.

Verify is a code-review-style check on the diff. It may perform **minimal, behavior-preserving refactoring** when needed to satisfy standards or spec findings. Structural refactoring is out of scope and stops for user decision or belongs to the `code-review` skill.

#### 4.1 Capture the diff

Use the starting commit recorded in Planning:

```bash
git diff <start-commit>...HEAD
```

Also capture the list of commits:

```bash
git log <start-commit>..HEAD --oneline
```

#### 4.2 Identify standards sources

Find project standards docs such as `CODING_STANDARDS.md`, `CONTRIBUTING.md`, `AGENTS.md`, `CLAUDE.md`, or similar.

#### 4.3 Spawn parallel review sub-agents

Run two sub-agents in parallel. Neither should see the TDD conversation history or intermediate reasoning — only the diff, the spec, and the standards.

**Standards sub-agent**

- Input: diff command, commit list, standards sources.
- Brief: "Report every place the diff violates a documented standard. Cite the standard (file + rule). Distinguish hard violations from judgement calls. Skip anything tooling already enforces. Under 400 words."

**Spec sub-agent**

- Input: diff command, commit list, spec source.
- Brief: "Report: (a) spec requirements that are missing or partial; (b) behavior in the diff that wasn't asked for (scope creep); (c) requirements that look implemented but where the implementation looks wrong. Quote the spec for each finding. Under 400 words."

#### 4.4 Classify findings

Map each finding into one of three buckets:

| Type | Meaning | Action |
|------|---------|--------|
| **Type 1** | Spec conflicts with tests / reality | Record, present to user after full review |
| **Type 2 Major** | Implementation misses spec; fixing it won't break tests | Stop and ask user |
| **Type 2 Minor** | Implementation misses spec; low-risk fix | Auto-fix, then re-verify once |

#### 4.5 Auto-fix Type 2 Minor

Apply minor fixes. After all minor fixes are applied, re-run:

- The full test suite.
- The full Verify gate (maximum 1 round to prevent loops).

If a minor fix introduces new findings, classify them again. After the single re-verify round, any remaining findings are reported and the loop stops.

#### 4.6 Present the report

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

#### 4.7 Handle Type 1 and Type 2 Major

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
- Verify may do minimal, behavior-preserving refactoring; structural refactoring stops for user decision.
- Review sub-agents must not see TDD conversation history or reasoning.
- Every spec finding must quote the spec.
- Every standards finding must cite the standard source.
- Type 2 Minor fixes trigger at most one re-verify round.
- Major findings always stop for user decision.
- Use the user's language for all output.
