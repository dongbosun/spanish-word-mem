import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppButton } from "@/components/AppButton";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { SectionProgressCard } from "@/components/SectionProgressCard";
import { SectionTitle } from "@/components/SectionTitle";
import { StatTile } from "@/components/StatTile";
import {
  getAllWords,
  getChapterById,
  getSectionsForChapter
} from "@/lib/deck";
import { computeChapterStats, computeSectionStats } from "@/lib/stats";
import { useProgress } from "@/state/ProgressContext";

export default function ChapterDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ chapterId?: string }>();
  const chapterId = typeof params.chapterId === "string" ? params.chapterId : "";
  const chapter = getChapterById(chapterId);
  const sections = getSectionsForChapter(chapterId);
  const words = getAllWords();
  const { progressMap } = useProgress();

  if (!chapter) {
    return (
      <Screen>
        <EmptyState title="找不到这个章节" description="请返回词库重新选择章节。" />
        <AppButton label="返回词库" onPress={() => router.push("/chapters")} variant="secondary" />
      </Screen>
    );
  }

  const stats = computeChapterStats(chapter.id, words, progressMap);

  return (
    <Screen>
      <SectionTitle title={chapter.title} subtitle={chapter.description} />
      <View style={styles.statsGrid}>
        <StatTile label="本章词数" value={stats.total} />
        <StatTile label="完全会了" value={stats.mastered} />
        <StatTile label="熟悉" value={stats.familiar} />
        <StatTile label="模糊" value={stats.fuzzy} />
        <StatTile label="不认识" value={stats.unknown} />
        <StatTile label="薄弱词" value={stats.weak} />
      </View>
      <View style={styles.actionRow}>
        <AppButton
          label="查看本章全部词"
          onPress={() =>
            router.push({
              pathname: "/words",
              params: { chapterId: chapter.id }
            })
          }
        />
        <AppButton
          label="测试本章"
          onPress={() =>
            router.push({
              pathname: "/test",
              params: { scope: "chapter", chapterId: chapter.id }
            })
          }
          variant="secondary"
        />
      </View>

      <SectionTitle title="小节" subtitle="选择小节查看紧凑词表。" />
      {sections.map((section) => (
        <SectionProgressCard
          key={section.id}
          onPress={() =>
            router.push({
              pathname: "/section/[sectionId]",
              params: { sectionId: section.id }
            })
          }
          section={section}
          stats={computeSectionStats(section.id, words, progressMap)}
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
