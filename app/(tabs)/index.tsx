import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import { AppButton } from "@/components/AppButton";
import { ChapterProgressCard } from "@/components/ChapterProgressCard";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { StatTile } from "@/components/StatTile";
import { getAllWords, getChapters, getSectionsForChapter } from "@/lib/deck";
import { computeChapterStats, computeOverallStats } from "@/lib/stats";
import { useProgress } from "@/state/ProgressContext";

export default function OverviewScreen() {
  const router = useRouter();
  const { progressMap } = useProgress();
  const words = getAllWords();
  const chapters = getChapters();
  const stats = useMemo(() => computeOverallStats(words, progressMap), [progressMap, words]);

  return (
    <Screen>
      <SectionTitle
        title="总览"
        subtitle="自由浏览完整词库，按自己的节奏标记掌握程度。这里不会安排今日任务。"
      />

      <View style={styles.statsGrid}>
        <StatTile label="总词数" value={stats.total} />
        <StatTile label="完全会了" value={stats.mastered} />
        <StatTile label="熟悉" value={stats.familiar} />
        <StatTile label="模糊" value={stats.fuzzy} />
        <StatTile label="不认识" value={stats.unknown} />
        <StatTile label="收藏" value={stats.favorites} />
        <StatTile label="薄弱词" value={stats.weak} />
        <StatTile label="平均掌握" value={`${stats.averageMastery}%`} />
      </View>

      <View style={styles.actionRow}>
        <AppButton label="打开全部词" onPress={() => router.push("/words")} />
        <AppButton label="开始测试" onPress={() => router.push("/test")} variant="secondary" />
      </View>

      <SectionTitle title="章节进度" subtitle="点击章节继续浏览。" />
      {chapters.map((chapter) => (
        <ChapterProgressCard
          chapter={chapter}
          key={chapter.id}
          onPress={() =>
            router.push({
              pathname: "/chapter/[chapterId]",
              params: { chapterId: chapter.id }
            })
          }
          sections={getSectionsForChapter(chapter.id)}
          stats={computeChapterStats(chapter.id, words, progressMap)}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  }
});
