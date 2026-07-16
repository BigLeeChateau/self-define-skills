import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const skillsDir = join(root, "skills");

function findSkillFiles(dir) {
  const files = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch (e) {
    console.error(`Error reading ${dir}: ${e.message}`);
    process.exit(1);
  }
  for (const entry of entries) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      files.push(...findSkillFiles(path));
    } else if (entry === "SKILL.md") {
      files.push(path);
    }
  }
  return files;
}

const skillFiles = findSkillFiles(skillsDir);

if (skillFiles.length === 0) {
  console.error(`No SKILL.md files found in ${skillsDir}`);
  process.exit(1);
}

let hasError = false;
for (const file of skillFiles) {
  const content = readFileSync(file, "utf-8");
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    console.error(`Missing frontmatter: ${file}`);
    hasError = true;
    continue;
  }
  const frontmatter = match[1];
  if (!/^name:/m.test(frontmatter)) {
    console.error(`Missing 'name' in frontmatter: ${file}`);
    hasError = true;
  }
  if (!/^description:/m.test(frontmatter)) {
    console.error(`Missing 'description' in frontmatter: ${file}`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

console.log("All skills valid");
