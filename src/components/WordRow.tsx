import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { gradeLabels, partOfSpeechLabels } from "@/constants/labels";
import { colors } from "@/constants/theme";
import { MasteryBadge } from "@/components/MasteryBadge";
import { getWordStatus } from "@/lib/stats";
import type { SelfGrade, WordCard, WordProgress } from "@/types/deck";

type Props = {
  word: WordCard;
  progress?: WordProgress;
  onGrade: (wordId: string, grade: SelfGrade) => void;
  onFavorite: (wordId: string) => void;
  onMastered: (wordId: string) => void;
};

export function WordRow({ word, progress, onGrade, onFavorite, onMastered }: Props) {
  const router = useRouter();
  const status = getWordStatus(word, progress);
  const mastery = progress?.manuallyMastered ? 100 : progress?.mastery ?? 0;

  return (
    <View style={styles.row}>
      <View style={styles.topLine}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(`/word/${word.id}`)}
          style={styles.wordBlock}
        >
          <Text numberOfLines={1} style={styles.spanish}>
            {word.spanish}
          </Text>
          <Text numberOfLines={1} style={styles.english}>
            {word.english.join("; ")}
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel={progress?.favorite ? "取消收藏" : "收藏"}
          accessibilityRole="button"
          onPress={() => onFavorite(word.id)}
          style={styles.iconButton}
        >
          <Text style={[styles.star, progress?.favorite ? styles.starActive : undefined]}>
            {progress?.favorite ? "★" : "☆"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.metaLine}>
        <Text style={styles.partOfSpeech}>{partOfSpeechLabels[word.partOfSpeech]}</Text>
        <MasteryBadge mastery={mastery} status={status} />
        {progress?.manuallyMastered ? <Text style={styles.masteredMark}>已手动掌握</Text> : null}
      </View>

      <View style={styles.actions}>
        {(["unknown", "fuzzy", "familiar"] as SelfGrade[]).map((grade) => (
          <Pressable
            accessibilityRole="button"
            key={grade}
            onPress={() => onGrade(word.id, grade)}
            style={[styles.gradeButton, grade === "unknown" ? styles.unknownButton : undefined]}
          >
            <Text style={styles.gradeText}>{gradeLabels[grade]}</Text>
          </Pressable>
        ))}
        <Pressable accessibilityRole="button" onPress={() => onMastered(word.id)} style={styles.masterButton}>
          <Text style={styles.masterText}>完全会了</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  topLine: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  wordBlock: {
    flex: 1,
    minWidth: 0
  },
  spanish: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  english: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 2
  },
  iconButton: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 36
  },
  star: {
    color: colors.muted,
    fontSize: 24,
    lineHeight: 28
  },
  starActive: {
    color: colors.gold
  },
  metaLine: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  partOfSpeech: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  masteredMark: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "800"
  },
  actions: {
    flexDirection: "row",
    gap: 6
  },
  gradeButton: {
    alignItems: "center",
    backgroundColor: colors.secondarySoft,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    minHeight: 36,
    paddingHorizontal: 6
  },
  unknownButton: {
    backgroundColor: colors.redSoft
  },
  gradeText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800"
  },
  masterButton: {
    alignItems: "center",
    backgroundColor: colors.greenSoft,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    minHeight: 36,
    paddingHorizontal: 6
  },
  masterText: {
    color: colors.green,
    fontSize: 13,
    fontWeight: "900"
  }
});
