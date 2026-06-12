import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AppButton } from "@/components/AppButton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { MasteryBadge } from "@/components/MasteryBadge";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { gradeLabels, partOfSpeechLabels } from "@/constants/labels";
import { colors } from "@/constants/theme";
import {
  getChapterById,
  getSectionById,
  getWordById
} from "@/lib/deck";
import { getWordStatus } from "@/lib/stats";
import { useProgress } from "@/state/ProgressContext";
import type { SelfGrade } from "@/types/deck";

export default function WordDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ wordId?: string }>();
  const wordId = typeof params.wordId === "string" ? params.wordId : "";
  const word = getWordById(wordId);
  const {
    gradeWord,
    markWordMastered,
    progressMap,
    resetWord,
    toggleFavorite,
    undoWordMastered
  } = useProgress();

  if (!word) {
    return (
      <Screen>
        <EmptyState title="找不到这个单词" description="请返回词表重新选择。" />
        <AppButton label="返回全部词" onPress={() => router.push("/words")} variant="secondary" />
      </Screen>
    );
  }

  const progress = progressMap[word.id];
  const status = getWordStatus(word, progress);
  const mastery = progress?.manuallyMastered ? 100 : progress?.mastery ?? 0;
  const chapter = getChapterById(word.chapterId);
  const section = getSectionById(word.sectionId);

  return (
    <Screen>
      <View style={styles.header}>
        <SectionTitle title={word.spanish} subtitle={word.english.join("; ")} />
        <MasteryBadge mastery={mastery} status={status} />
      </View>

      <View style={styles.card}>
        <Info label="词性" value={partOfSpeechLabels[word.partOfSpeech]} />
        <Info label="章节" value={chapter?.title ?? "未知章节"} />
        <Info label="小节" value={section?.title ?? "未知小节"} />
        <Info label="标签" value={word.tags.join(", ")} />
        <Info label="掌握度" value={`${mastery}/100`} />
        <Info label="测试次数" value={String(progress?.testCount ?? 0)} />
        {word.exampleSpanish ? <Info label="例句" value={word.exampleSpanish} /> : null}
        {word.exampleEnglish ? <Info label="例句翻译" value={word.exampleEnglish} /> : null}
        {word.notes ? <Info label="备注" value={word.notes} /> : null}
      </View>

      <View style={styles.actionGrid}>
        {(["unknown", "fuzzy", "familiar"] as SelfGrade[]).map((grade) => (
          <AppButton
            key={grade}
            label={gradeLabels[grade]}
            onPress={() => gradeWord(word.id, grade, "list")}
            variant="plain"
          />
        ))}
        <AppButton label="完全会了" onPress={() => markWordMastered(word.id)} />
        <AppButton
          label={progress?.favorite ? "取消收藏" : "收藏"}
          onPress={() => toggleFavorite(word.id)}
          variant="secondary"
        />
        <AppButton
          disabled={!progress?.manuallyMastered}
          label="取消完全会了"
          onPress={() => undoWordMastered(word.id)}
          variant="secondary"
        />
        <ConfirmDialog
          destructive
          label="重置这个词进度"
          message={`确定要重置 ${word.spanish} 的学习进度吗？`}
          onConfirm={() => resetWord(word.id)}
        />
      </View>
    </Screen>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 10
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16
  },
  infoRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 4,
    paddingVertical: 10
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  infoValue: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  }
});
