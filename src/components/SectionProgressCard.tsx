import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";
import { ProgressBar } from "@/components/ProgressBar";
import type { Section } from "@/types/deck";
import type { WordStats } from "@/lib/stats";

type Props = {
  section: Section;
  stats: WordStats;
  onPress?: () => void;
};

export function SectionProgressCard({ section, stats, onPress }: Props) {
  const progress = stats.total === 0 ? 0 : Math.round((stats.mastered / stats.total) * 100);

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{section.title}</Text>
        <Text style={styles.count}>{stats.total} 词</Text>
      </View>
      {section.description ? <Text style={styles.description}>{section.description}</Text> : null}
      <ProgressBar value={progress} />
      <Text style={styles.meta}>
        完全会了 {stats.mastered} · 熟悉 {stats.familiar} · 模糊 {stats.fuzzy} · 不认识 {stats.unknown}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 14
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
    fontSize: 17,
    fontWeight: "800"
  },
  count: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18
  }
});
