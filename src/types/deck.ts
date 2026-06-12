export type Chapter = {
  id: string;
  title: string;
  description?: string;
  order: number;
};

export type Section = {
  id: string;
  chapterId: string;
  title: string;
  description?: string;
  order: number;
};

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "preposition"
  | "conjunction"
  | "phrase"
  | "other";

export type WordCard = {
  id: string;
  spanish: string;
  english: string[];
  partOfSpeech: PartOfSpeech;
  chapterId: string;
  sectionId: string;
  tags: string[];
  frequencyRank?: number;
  exampleSpanish?: string;
  exampleEnglish?: string;
  notes?: string;
};

export type SelfGrade = "unknown" | "fuzzy" | "familiar";

export type GradeSource = "list" | "test";

export type WordProgress = {
  wordId: string;
  mastery: number;
  favorite: boolean;
  manuallyMastered: boolean;
  selfGradeCounts: {
    unknown: number;
    fuzzy: number;
    familiar: number;
  };
  testCount: number;
  lastTestedAt?: string;
  lastUpdatedAt?: string;
};

export type ProgressMap = Record<string, WordProgress>;

export type MasteryStatus =
  | "unknown"
  | "fuzzy"
  | "familiar"
  | "mastered";

export type StatusFilter =
  | "all"
  | "favorite"
  | "unknown"
  | "fuzzy"
  | "familiar"
  | "mastered"
  | "unmastered"
  | "weak";

export type SortMode =
  | "default"
  | "spanish-az"
  | "mastery-asc"
  | "mastery-desc"
  | "favorite-first";

export type TestScope =
  | "all"
  | "chapter"
  | "section"
  | "favorites"
  | "weak"
  | "unmastered";

export type DirectionMode = "es-en" | "en-es" | "mixed";

export type TestDirection = "es-en" | "en-es";

export type TestCountOption = 10 | 20 | 50 | "all";

export type SamplingMode = "random" | "weak-first";

export type TestOptions = {
  scope: TestScope;
  chapterId?: string;
  sectionId?: string;
  direction: DirectionMode;
  count: TestCountOption;
  sampling: SamplingMode;
};
