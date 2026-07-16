import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function runTest(name, setup, assert) {
  const tmp = join(tmpdir(), `validate-skills-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(join(tmp, "skills", "test"), { recursive: true });
  setup(tmp);
  try {
    assert(tmp);
    console.log(`PASS: ${name}`);
  } catch (e) {
    console.error(`FAIL: ${name}`);
    console.error(e.stderr?.toString() || e.message);
    process.exit(1);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function expectExit1(tmp, expectedMessage) {
  try {
    execFileSync("node", ["scripts/validate-skills.mjs", tmp], {
      cwd: "/Users/jisookim/Downloads/self-define-skills",
      stdio: "pipe",
    });
    throw new Error("expected exit 1");
  } catch (e) {
    if (e.message === "expected exit 1") throw e;
    const stderr = e.stderr?.toString() || "";
    if (!stderr.includes(expectedMessage)) {
      throw new Error(`expected "${expectedMessage}", got: ${stderr}`);
    }
  }
}

runTest(
  "valid skills exit 0",
  (tmp) => {
    writeFileSync(
      join(tmp, "skills", "test", "SKILL.md"),
      "---\nname: test\ndescription: A test skill\n---\n\n# Test\n"
    );
  },
  (tmp) => {
    execFileSync("node", ["scripts/validate-skills.mjs", tmp], {
      cwd: "/Users/jisookim/Downloads/self-define-skills",
      stdio: "pipe",
    });
  }
);

runTest(
  "missing name exits 1 and reports file",
  (tmp) => {
    writeFileSync(
      join(tmp, "skills", "test", "SKILL.md"),
      "---\ndescription: A test skill\n---\n\n# Test\n"
    );
  },
  (tmp) => {
    expectExit1(tmp, "Missing 'name'");
  }
);

runTest(
  "missing description exits 1 and reports file",
  (tmp) => {
    writeFileSync(
      join(tmp, "skills", "test", "SKILL.md"),
      "---\nname: test\n---\n\n# Test\n"
    );
  },
  (tmp) => {
    expectExit1(tmp, "Missing 'description'");
  }
);
