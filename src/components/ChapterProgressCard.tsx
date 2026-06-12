import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";
import { ProgressBar } from "@/components/ProgressBar";
import type { Chapter, Section } from "@/types/deck";
import type { WordStats } from "@/lib/stats";

type Props = {
  chapter: Chapter;
  sections: Section[];
  stats: WordStats;
  onPress?: () => void;
};

export function ChapterProgressCard({ chapter, sections, stats, onPress }: Props) {
  const progress = stats.total === 0 ? 0 : Math.round((stats.mastered / stats.total) * 100);

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{chapter.title}</Text>
        <Text style={styles.count}>{stats.total} 词</Text>
      </View>
      {chapter.description ? <Text style={styles.description}>{chapter.description}</Text> : null}
      <ProgressBar value={progress} />
      <Text style={styles.meta}>
        完全会了 {stats.mastered} · 熟悉 {stats.familiar} · 模糊 {stats.fuzzy} · 不认识 {stats.unknown}
      </Text>
      <View style={styles.sectionWrap}>
        {sections.map((section) => (
          <Text key={section.id} style={styles.sectionPill}>
            {section.title}
          </Text>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 9,
    padding: 16
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: 19,
    fontWeight: "900"
  },
  count: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  meta: {
    color: colors.muted,
    fontSize: 13
  },
  sectionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  },
  sectionPill: {
    backgroundColor: colors.secondarySoft,
    borderRadius: 999,
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4
  }
});
