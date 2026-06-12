import type { MasteryStatus, PartOfSpeech, SelfGrade, StatusFilter } from "@/types/deck";

export const masteryLabels: Record<MasteryStatus, string> = {
  unknown: "不认识",
  fuzzy: "模糊",
  familiar: "熟悉",
  mastered: "完全会了"
};

export const gradeLabels: Record<SelfGrade, string> = {
  unknown: "不认识",
  fuzzy: "模糊",
  familiar: "熟悉"
};

export const statusFilterLabels: Record<StatusFilter, string> = {
  all: "全部",
  favorite: "收藏",
  unknown: "不认识",
  fuzzy: "模糊",
  familiar: "熟悉",
  mastered: "完全会了",
  unmastered: "未掌握",
  weak: "薄弱词"
};

export const partOfSpeechLabels: Record<PartOfSpeech, string> = {
  noun: "名词",
  verb: "动词",
  adjective: "形容词",
  adverb: "副词",
  pronoun: "代词",
  preposition: "介词",
  conjunction: "连词",
  phrase: "短语",
  other: "其他"
};
