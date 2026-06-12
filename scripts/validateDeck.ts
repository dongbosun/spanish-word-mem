import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const partOfSpeechValues = new Set([
  "noun",
  "verb",
  "adjective",
  "adverb",
  "pronoun",
  "preposition",
  "conjunction",
  "phrase",
  "other"
]);

type JsonObject = Record<string, unknown>;

type ChapterRecord = {
  id: string;
};

type SectionRecord = {
  id: string;
  chapterId: string;
};

type WordRecord = {
  id: string;
  spanish: string;
  english: string[];
  partOfSpeech: string;
  chapterId: string;
  sectionId: string;
  tags: string[];
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const dataDir = path.join(projectRoot, "src", "data");

function readJsonArray(fileName: string): unknown[] {
  const filePath = path.join(dataDir, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error(`${fileName} must contain a JSON array.`);
  }

  return parsed;
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function labelAt(fileName: string, index: number, id?: unknown): string {
  return `${fileName}[${index}]${typeof id === "string" ? ` (${id})` : ""}`;
}

function validateUniqueIds(records: Array<{ id: string }>, fileName: string, errors: string[]) {
  const seen = new Map<string, number>();

  records.forEach((record, index) => {
    const firstIndex = seen.get(record.id);
    if (firstIndex !== undefined) {
      errors.push(
        `${labelAt(fileName, index, record.id)} duplicates id already used at ${fileName}[${firstIndex}].`
      );
      return;
    }

    seen.set(record.id, index);
  });
}

function validateChapters(rawChapters: unknown[], errors: string[]): ChapterRecord[] {
  const chapters: ChapterRecord[] = [];

  rawChapters.forEach((rawChapter, index) => {
    if (!isObject(rawChapter)) {
      errors.push(`${labelAt("chapters.json", index)} must be an object.`);
      return;
    }

    if (!isNonEmptyString(rawChapter.id)) {
      errors.push(`${labelAt("chapters.json", index)} is missing required string field "id".`);
      return;
    }

    chapters.push({ id: rawChapter.id });
  });

  validateUniqueIds(chapters, "chapters.json", errors);
  return chapters;
}

function validateSections(
  rawSections: unknown[],
  chapterIds: Set<string>,
  errors: string[]
): SectionRecord[] {
  const sections: SectionRecord[] = [];

  rawSections.forEach((rawSection, index) => {
    if (!isObject(rawSection)) {
      errors.push(`${labelAt("sections.json", index)} must be an object.`);
      return;
    }

    if (!isNonEmptyString(rawSection.id)) {
      errors.push(`${labelAt("sections.json", index)} is missing required string field "id".`);
      return;
    }

    if (!isNonEmptyString(rawSection.chapterId)) {
      errors.push(`${labelAt("sections.json", index, rawSection.id)} is missing required string field "chapterId".`);
      return;
    }

    if (!chapterIds.has(rawSection.chapterId)) {
      errors.push(
        `${labelAt("sections.json", index, rawSection.id)} references unknown chapterId "${rawSection.chapterId}".`
      );
    }

    sections.push({ id: rawSection.id, chapterId: rawSection.chapterId });
  });

  validateUniqueIds(sections, "sections.json", errors);
  return sections;
}

function validateWords(
  rawWords: unknown[],
  chapterIds: Set<string>,
  sectionById: Map<string, SectionRecord>,
  errors: string[]
): WordRecord[] {
  const words: WordRecord[] = [];

  rawWords.forEach((rawWord, index) => {
    if (!isObject(rawWord)) {
      errors.push(`${labelAt("words.json", index)} must be an object.`);
      return;
    }

    const location = labelAt("words.json", index, rawWord.id);
    const requiredStringFields = ["id", "spanish", "partOfSpeech", "chapterId", "sectionId"] as const;

    for (const field of requiredStringFields) {
      if (!isNonEmptyString(rawWord[field])) {
        errors.push(`${location} is missing required string field "${field}".`);
      }
    }

    if (!isStringArray(rawWord.english) || rawWord.english.length === 0) {
      errors.push(`${location} is missing required non-empty string array field "english".`);
    } else if (rawWord.english.some((item) => item.trim().length === 0)) {
      errors.push(`${location} has an empty string inside "english".`);
    }

    if (!isStringArray(rawWord.tags)) {
      errors.push(`${location} is missing required string array field "tags".`);
    }

    if (isNonEmptyString(rawWord.partOfSpeech) && !partOfSpeechValues.has(rawWord.partOfSpeech)) {
      errors.push(`${location} has invalid partOfSpeech "${rawWord.partOfSpeech}".`);
    }

    if (isNonEmptyString(rawWord.chapterId) && !chapterIds.has(rawWord.chapterId)) {
      errors.push(`${location} references unknown chapterId "${rawWord.chapterId}".`);
    }

    if (isNonEmptyString(rawWord.sectionId) && !sectionById.has(rawWord.sectionId)) {
      errors.push(`${location} references unknown sectionId "${rawWord.sectionId}".`);
    }

    const section = isNonEmptyString(rawWord.sectionId) ? sectionById.get(rawWord.sectionId) : undefined;
    if (
      section &&
      isNonEmptyString(rawWord.chapterId) &&
      section.chapterId !== rawWord.chapterId
    ) {
      errors.push(
        `${location} uses sectionId "${rawWord.sectionId}" from chapterId "${section.chapterId}", but word chapterId is "${rawWord.chapterId}".`
      );
    }

    if (
      isNonEmptyString(rawWord.id) &&
      isNonEmptyString(rawWord.spanish) &&
      isStringArray(rawWord.english) &&
      rawWord.english.length > 0 &&
      isNonEmptyString(rawWord.partOfSpeech) &&
      isNonEmptyString(rawWord.chapterId) &&
      isNonEmptyString(rawWord.sectionId) &&
      isStringArray(rawWord.tags)
    ) {
      words.push({
        id: rawWord.id,
        spanish: rawWord.spanish,
        english: rawWord.english,
        partOfSpeech: rawWord.partOfSpeech,
        chapterId: rawWord.chapterId,
        sectionId: rawWord.sectionId,
        tags: rawWord.tags
      });
    }
  });

  validateUniqueIds(words, "words.json", errors);
  return words;
}

function main() {
  const errors: string[] = [];
  const rawChapters = readJsonArray("chapters.json");
  const rawSections = readJsonArray("sections.json");
  const rawWords = readJsonArray("words.json");

  const chapters = validateChapters(rawChapters, errors);
  const chapterIds = new Set(chapters.map((chapter) => chapter.id));
  const sections = validateSections(rawSections, chapterIds, errors);
  const sectionById = new Map(sections.map((section) => [section.id, section]));
  const words = validateWords(rawWords, chapterIds, sectionById, errors);

  if (errors.length > 0) {
    console.error(`Deck validation failed with ${errors.length} error(s):`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Deck validation passed.");
  console.log(`Chapters: ${chapters.length}`);
  console.log(`Sections: ${sections.length}`);
  console.log(`Words: ${words.length}`);
}

try {
  main();
} catch (error) {
  console.error("Deck validation failed before schema checks:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
