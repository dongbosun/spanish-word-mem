import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { EmptyState } from "@/components/EmptyState";
import { OptionChips } from "@/components/OptionChips";
import { SearchBar } from "@/components/SearchBar";
import { SectionTitle } from "@/components/SectionTitle";
import { WordRow } from "@/components/WordRow";
import { statusFilterLabels } from "@/constants/labels";
import { colors } from "@/constants/theme";
import {
  getChapters,
  getSectionById,
  getSections,
  searchWords,
  sortWords
} from "@/lib/deck";
import { useProgress } from "@/state/ProgressContext";
import type { SortMode, StatusFilter } from "@/types/deck";

const statusOptions: { label: string; value: StatusFilter }[] = [
  "all",
  "favorite",
  "unknown",
  "fuzzy",
  "familiar",
  "mastered",
  "unmastered",
  "weak"
].map((value) => ({ value: value as StatusFilter, label: statusFilterLabels[value as StatusFilter] }));

const sortOptions: { label: string; value: SortMode }[] = [
  { label: "默认顺序", value: "default" },
  { label: "西语 A-Z", value: "spanish-az" },
  { label: "熟练度低到高", value: "mastery-asc" },
  { label: "熟练度高到低", value: "mastery-desc" },
  { label: "收藏优先", value: "favorite-first" }
];

export default function AllWordsScreen() {
  const params = useLocalSearchParams<{
    chapterId?: string;
    sectionId?: string;
    status?: StatusFilter;
  }>();
  const { gradeWord, markWordMastered, progressMap, toggleFavorite } = useProgress();
  const chapters = getChapters();
  const sections = getSections();
  const initialSection = typeof params.sectionId === "string" ? params.sectionId : "all";
  const initialChapter =
    typeof params.chapterId === "string"
      ? params.chapterId
      : initialSection !== "all"
        ? getSectionById(initialSection)?.chapterId ?? "all"
        : "all";
  const [query, setQuery] = useState("");
  const [chapterId, setChapterId] = useState(initialChapter);
  const [sectionId, setSectionId] = useState(initialSection);
  const [status, setStatus] = useState<StatusFilter>(
    typeof params.status === "string" ? params.status : "all"
  );
  const [sortMode, setSortMode] = useState<SortMode>("default");

  const chapterOptions = [
    { label: "全部章节", value: "all" },
    ...chapters.map((chapter) => ({ label: chapter.title, value: chapter.id }))
  ];
  const sectionOptions = [
    { label: "全部小节", value: "all" },
    ...sections
      .filter((section) => chapterId === "all" || section.chapterId === chapterId)
      .map((section) => ({ label: section.title, value: section.id }))
  ];

  const visibleWords = useMemo(() => {
    const filtered = searchWords(
      query,
      {
        chapterId: chapterId === "all" ? undefined : chapterId,
        sectionId: sectionId === "all" ? undefined : sectionId,
        status
      },
      progressMap
    );
    return sortWords(filtered, sortMode, progressMap);
  }, [chapterId, progressMap, query, sectionId, sortMode, status]);

  const handleChapterChange = (nextChapterId: string) => {
    setChapterId(nextChapterId);
    setSectionId("all");
  };

  return (
    <FlatList
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <EmptyState title="没有匹配的单词" description="换一个关键词、章节或筛选条件试试。" />
        </View>
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <SectionTitle title="全部词汇" subtitle={`${visibleWords.length} 个匹配结果`} />
          <SearchBar onChangeText={setQuery} value={query} />
          <View style={styles.group}>
            <Text style={styles.groupLabel}>章节</Text>
            <OptionChips onChange={handleChapterChange} options={chapterOptions} value={chapterId} />
          </View>
          <View style={styles.group}>
            <Text style={styles.groupLabel}>小节</Text>
            <OptionChips onChange={setSectionId} options={sectionOptions} value={sectionId} />
          </View>
          <View style={styles.group}>
            <Text style={styles.groupLabel}>状态</Text>
            <OptionChips onChange={setStatus} options={statusOptions} value={status} />
          </View>
          <View style={styles.group}>
            <Text style={styles.groupLabel}>排序</Text>
            <OptionChips onChange={setSortMode} options={sortOptions} value={sortMode} />
          </View>
        </View>
      }
      contentContainerStyle={styles.listContent}
      data={visibleWords}
      keyExtractor={(word) => word.id}
      renderItem={({ item }) => (
        <WordRow
          onFavorite={toggleFavorite}
          onGrade={(wordId, grade) => gradeWord(wordId, grade, "list")}
          onMastered={markWordMastered}
          progress={progressMap[item.id]}
          word={item}
        />
      )}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.background,
    flex: 1
  },
  listContent: {
    marginHorizontal: "auto" as never,
    maxWidth: 980,
    paddingBottom: 32,
    width: "100%"
  },
  header: {
    gap: 12,
    padding: 16
  },
  group: {
    gap: 8
  },
  groupLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "900"
  },
  emptyWrap: {
    padding: 16
  }
});
