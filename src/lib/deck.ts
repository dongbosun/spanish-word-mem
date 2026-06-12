import chaptersJson from "@/data/chapters.json";
import sectionsJson from "@/data/sections.json";
import wordsJson from "@/data/words.json";
import { isUnmastered, isWeak, getWordStatus } from "@/lib/stats";
import type {
  Chapter,
  ProgressMap,
  Section,
  SortMode,
  StatusFilter,
  WordCard
} from "@/types/deck";

export type WordSearchFilters = {
  chapterId?: string;
  sectionId?: string;
  status?: StatusFilter;
  query?: string;
};

const chapters = [...(chaptersJson as Chapter[])].sort((a, b) => a.order - b.order);
const sections = [...(sectionsJson as Section[])].sort((a, b) => a.order - b.order);
const words = [...(wordsJson as WordCard[])].sort(
  (a, b) => (a.frequencyRank ?? Number.MAX_SAFE_INTEGER) - (b.frequencyRank ?? Number.MAX_SAFE_INTEGER)
);

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getAllWords(): WordCard[] {
  return words;
}

export function getWordById(id: string): WordCard | undefined {
  return words.find((word) => word.id === id);
}

export function getChapters(): Chapter[] {
  return chapters;
}

export function getChapterById(id: string): Chapter | undefined {
  return chapters.find((chapter) => chapter.id === id);
}

export function getSections(): Section[] {
  return sections;
}

export function getSectionById(id: string): Section | undefined {
  return sections.find((section) => section.id === id);
}

export function getSectionsForChapter(chapterId: string): Section[] {
  return sections.filter((section) => section.chapterId === chapterId);
}

export function getWordsForChapter(chapterId: string): WordCard[] {
  return words.filter((word) => word.chapterId === chapterId);
}

export function getWordsForSection(sectionId: string): WordCard[] {
  return words.filter((word) => word.sectionId === sectionId);
}

export function searchWords(
  query: string,
  filters: WordSearchFilters,
  progressMap: ProgressMap
): WordCard[] {
  const normalizedQuery = normalizeText(query.trim());

  return words.filter((word) => {
    if (filters.chapterId && word.chapterId !== filters.chapterId) return false;
    if (filters.sectionId && word.sectionId !== filters.sectionId) return false;

    const progress = progressMap[word.id];
    const status = filters.status ?? "all";

    if (status === "favorite" && !progress?.favorite) return false;
    if (status === "weak" && !isWeak(progress)) return false;
    if (status === "unmastered" && !isUnmastered(progress)) return false;
    if (
      ["unknown", "fuzzy", "familiar", "mastered"].includes(status) &&
      getWordStatus(word, progress) !== status
    ) {
      return false;
    }

    if (!normalizedQuery) return true;

    const haystack = normalizeText(
      [
        word.spanish,
        ...word.english,
        word.partOfSpeech,
        word.exampleSpanish ?? "",
        word.exampleEnglish ?? "",
        word.notes ?? "",
        ...word.tags
      ].join(" ")
    );

    return haystack.includes(normalizedQuery);
  });
}

export function sortWords(
  wordList: WordCard[],
  sortMode: SortMode,
  progressMap: ProgressMap
): WordCard[] {
  const list = [...wordList];

  if (sortMode === "spanish-az") {
    return list.sort((a, b) => a.spanish.localeCompare(b.spanish, "es"));
  }

  if (sortMode === "mastery-asc") {
    return list.sort((a, b) => (progressMap[a.id]?.mastery ?? 0) - (progressMap[b.id]?.mastery ?? 0));
  }

  if (sortMode === "mastery-desc") {
    return list.sort((a, b) => (progressMap[b.id]?.mastery ?? 0) - (progressMap[a.id]?.mastery ?? 0));
  }

  if (sortMode === "favorite-first") {
    return list.sort((a, b) => {
      const favoriteDiff = Number(Boolean(progressMap[b.id]?.favorite)) - Number(Boolean(progressMap[a.id]?.favorite));
      if (favoriteDiff !== 0) return favoriteDiff;
      return (a.frequencyRank ?? 0) - (b.frequencyRank ?? 0);
    });
  }

  return list.sort((a, b) => (a.frequencyRank ?? 0) - (b.frequencyRank ?? 0));
}
