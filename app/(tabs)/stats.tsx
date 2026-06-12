import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { AppButton } from "@/components/AppButton";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { StatTile } from "@/components/StatTile";
import { colors } from "@/constants/theme";
import {
  getAllWords,
  getChapters,
  getSections
} from "@/lib/deck";
import {
  computeChapterStats,
  computeOverallStats,
  computeSectionStats
} from "@/lib/stats";
import { useProgress } from "@/state/ProgressContext";

export default function StatsScreen() {
  const router = useRouter();
  const { progressMap } = useProgress();
  const words = getAllWords();
  const chapters = getChapters();
  const sections = getSections();
  const stats = computeOverallStats(words, progressMap);

  const difficultWords = useMemo(
    () =>
      [...words]
        .sort((a, b) => {
          const progressA = progressMap[a.id];
          const progressB = progressMap[b.id];
          return (
            (progressA?.mastery ?? 0) - (progressB?.mastery ?? 0) ||
            (progressB?.selfGradeCounts.unknown ?? 0) - (progressA?.selfGradeCounts.unknown ?? 0)
          );
        })
        .slice(0, 8),
    [progressMap, words]
  );

  const recentWords = useMemo(
    () =>
      words
        .filter((word) => progressMap[word.id]?.lastTestedAt)
        .sort(
          (a, b) =>
            Date.parse(progressMap[b.id]?.lastTestedAt ?? "") -
            Date.parse(progressMap[a.id]?.lastTestedAt ?? "")
        )
        .slice(0, 8),
    [progressMap, words]
  );

  return (
    <Screen>
      <SectionTitle title="统计" subtitle="根据本地进度实时计算，不上传任何数据。" />
      <View style={styles.statsGrid}>
        <StatTile label="总词数" value={stats.total} />
        <StatTile label="收藏" value={stats.favorites} />
        <StatTile label="完全会了" value={stats.mastered} />
        <StatTile label="熟悉" value={stats.familiar} />
        <StatTile label="模糊" value={stats.fuzzy} />
        <StatTile label="不认识" value={stats.unknown} />
        <StatTile label="薄弱词" value={stats.weak} />
        <StatTile label="已测试" value={stats.tested} />
        <StatTile label="未测试" value={stats.neverTested} />
      </View>

      <SectionTitle title="按章节" />
      {chapters.map((chapter) => {
        const chapterStats = computeChapterStats(chapter.id, words, progressMap);
        return (
          <View key={chapter.id} style={styles.rowCard}>
            <Text style={styles.rowTitle}>{chapter.title}</Text>
            <Text style={styles.rowText}>
              {chapterStats.mastered}/{chapterStats.total} 完全会了 · 薄弱词 {chapterStats.weak}
            </Text>
          </View>
        );
      })}

      <SectionTitle title="按小节" />
      {sections.map((section) => {
        const sectionStats = computeSectionStats(section.id, words, progressMap);
        return (
          <View key={section.id} style={styles.rowCard}>
            <Text style={styles.rowTitle}>{section.title}</Text>
            <Text style={styles.rowText}>
              {sectionStats.mastered}/{sectionStats.total} 完全会了 · 模糊 {sectionStats.fuzzy} · 不认识{" "}
              {sectionStats.unknown}
            </Text>
          </View>
        );
      })}

      <SectionTitle title="最难的词" subtitle="按低熟练度和不认识次数排序。" />
      {difficultWords.map((word) => (
        <View key={word.id} style={styles.wordLine}>
          <View style={styles.wordTextWrap}>
            <Text style={styles.wordSpanish}>{word.spanish}</Text>
            <Text style={styles.rowText}>{word.english.join("; ")}</Text>
          </View>
          <Text style={styles.score}>{progressMap[word.id]?.mastery ?? 0}</Text>
        </View>
      ))}

      <SectionTitle title="最近测试" />
      {recentWords.length === 0 ? (
        <View style={styles.rowCard}>
          <Text style={styles.rowText}>还没有测试记录。</Text>
        </View>
      ) : (
        recentWords.map((word) => (
          <View key={word.id} style={styles.wordLine}>
            <View style={styles.wordTextWrap}>
              <Text style={styles.wordSpanish}>{word.spanish}</Text>
              <Text style={styles.rowText}>{word.english.join("; ")}</Text>
            </View>
            <Text style={styles.score}>{progressMap[word.id]?.testCount ?? 0} 次</Text>
          </View>
        ))
      )}

      <AppButton
        label="查看薄弱词"
        onPress={() =>
          router.push({
            pathname: "/words",
            params: { status: "weak" }
          })
        }
        variant="secondary"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  rowCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 13
  },
  rowTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  rowText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  wordLine: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    padding: 13
  },
  wordTextWrap: {
    flex: 1,
    minWidth: 0
  },
  wordSpanish: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  score: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900"
  }
});
