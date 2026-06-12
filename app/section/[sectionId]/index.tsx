import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AppButton } from "@/components/AppButton";
import { EmptyState } from "@/components/EmptyState";
import { OptionChips } from "@/components/OptionChips";
import { SearchBar } from "@/components/SearchBar";
import { SectionTitle } from "@/components/SectionTitle";
import { WordRow } from "@/components/WordRow";
import { statusFilterLabels } from "@/constants/labels";
import { colors } from "@/constants/theme";
import {
  getAllWords,
  getChapterById,
  getSectionById,
  searchWords,
  sortWords
} from "@/lib/deck";
import { computeSectionStats } from "@/lib/stats";
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

export default function SectionDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sectionId?: string }>();
  const sectionId = typeof params.sectionId === "string" ? params.sectionId : "";
  const section = getSectionById(sectionId);
  const chapter = section ? getChapterById(section.chapterId) : undefined;
  const words = getAllWords();
  const { gradeWord, markWordMastered, progressMap, toggleFavorite } = useProgress();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("default");

  const visibleWords = useMemo(() => {
    const filtered = searchWords(query, { sectionId, status }, progressMap);
    return sortWords(filtered, sortMode, progressMap);
  }, [progressMap, query, sectionId, sortMode, status]);

  if (!section) {
    return (
      <View style={styles.centered}>
        <EmptyState title="找不到这个小节" description="请返回词库重新选择小节。" />
        <AppButton label="返回词库" onPress={() => router.push("/chapters")} variant="secondary" />
      </View>
    );
  }

  const stats = computeSectionStats(section.id, words, progressMap);

  return (
    <FlatList
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <EmptyState title="没有匹配的单词" description="换一个关键词或筛选条件试试。" />
        </View>
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <SectionTitle
            title={section.title}
            subtitle={`${chapter?.title ?? "词库"} · ${stats.total} 词 · 完全会了 ${stats.mastered} · 薄弱词 ${stats.weak}`}
          />
          <SearchBar onChangeText={setQuery} placeholder="在本小节搜索" value={query} />
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
  },
  centered: {
    backgroundColor: colors.background,
    flex: 1,
    gap: 12,
    padding: 16
  }
});
