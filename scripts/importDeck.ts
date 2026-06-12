import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const dataDir = path.join(projectRoot, "src", "data");

function writeJson(fileName: string, value: unknown) {
  fs.writeFileSync(path.join(dataDir, fileName), `${JSON.stringify(value, null, 2)}\n`);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("Usage: npm run import:deck -- path/to/deck.json");
    console.error("Deck JSON must be an object with chapters, sections, and words arrays.");
    process.exit(1);
  }

  const resolvedInputPath = path.resolve(projectRoot, inputPath);
  const parsed = JSON.parse(fs.readFileSync(resolvedInputPath, "utf8"));

  if (
    !isObject(parsed) ||
    !Array.isArray(parsed.chapters) ||
    !Array.isArray(parsed.sections) ||
    !Array.isArray(parsed.words)
  ) {
    throw new Error("Deck JSON must be an object with chapters, sections, and words arrays.");
  }

  writeJson("chapters.json", parsed.chapters);
  writeJson("sections.json", parsed.sections);
  writeJson("words.json", parsed.words);

  execFileSync(process.execPath, ["--import", "tsx", "scripts/validateDeck.ts"], {
    cwd: projectRoot,
    stdio: "inherit"
  });

  console.log(`Imported deck from ${resolvedInputPath}.`);
}

main();
