import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AppButton } from "@/components/AppButton";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { StatTile } from "@/components/StatTile";
import { gradeLabels } from "@/constants/labels";
import { colors } from "@/constants/theme";
import { getAllWords } from "@/lib/deck";
import { computeOverallStats } from "@/lib/stats";
import { assignDirection, buildTestPool, sampleTestWords } from "@/lib/testSelection";
import { useProgress } from "@/state/ProgressContext";
import type {
  DirectionMode,
  SamplingMode,
  SelfGrade,
  TestCountOption,
  TestDirection,
  TestScope,
  WordCard
} from "@/types/deck";

type CountValue = "10" | "20" | "50" | "all";
type TestCard = {
  word: WordCard;
  direction: TestDirection;
};

function parseCount(value: string | undefined): TestCountOption {
  if (value === "20") return 20;
  if (value === "50") return 50;
  if (value === "all") return "all";
  return 10;
}

function normalizeScope(value: string | undefined): TestScope {
  if (value === "chapter" || value === "section" || value === "favorites" || value === "weak" || value === "unmastered") {
    return value;
  }
  return "all";
}

function normalizeDirection(value: string | undefined): DirectionMode {
  if (value === "es-en" || value === "en-es" || value === "mixed") {
    return value;
  }
  return "mixed";
}

function normalizeSampling(value: string | undefined): SamplingMode {
  return value === "weak-first" ? "weak-first" : "random";
}

export default function TestSessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    scope?: string;
    chapterId?: string;
    sectionId?: string;
    direction?: string;
    count?: CountValue;
    sampling?: string;
  }>();
  const words = getAllWords();
  const { gradeWord, progressMap } = useProgress();
  const options = useMemo(
    () => ({
      scope: normalizeScope(params.scope),
      chapterId: typeof params.chapterId === "string" ? params.chapterId : undefined,
      sectionId: typeof params.sectionId === "string" ? params.sectionId : undefined,
      direction: normalizeDirection(params.direction),
      count: parseCount(params.count),
      sampling: normalizeSampling(params.sampling)
    }),
    [params.chapterId, params.count, params.direction, params.sampling, params.scope, params.sectionId]
  );

  const createCards = () => {
    const pool = buildTestPool(options, words, progressMap);
    return sampleTestWords(pool, options.count, options.sampling, progressMap).map((word) => ({
      word,
      direction: assignDirection(word, options.direction)
    }));
  };

  const [cards, setCards] = useState<TestCard[]>(createCards);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [summary, setSummary] = useState<Record<SelfGrade, number>>({
    unknown: 0,
    fuzzy: 0,
    familiar: 0
  });

  const current = cards[index];
  const finished = cards.length > 0 && index >= cards.length;
  const stats = computeOverallStats(words, progressMap);

  const handleGrade = (grade: SelfGrade) => {
    if (!current) return;
    gradeWord(current.word.id, grade, "test");
    setSummary((previous) => ({ ...previous, [grade]: previous[grade] + 1 }));
    setRevealed(false);
    setIndex((previous) => previous + 1);
  };

  if (cards.length === 0) {
    return (
      <Screen>
        <EmptyState title="没有可测试的单词" description="返回测试中心换一个范围试试。" />
        <AppButton label="返回测试中心" onPress={() => router.push("/test")} />
      </Screen>
    );
  }

  if (finished) {
    return (
      <Screen>
        <SectionTitle title="测试完成" subtitle={`本次共测试 ${cards.length} 个单词。`} />
        <View style={styles.statsGrid}>
          <StatTile label="本次不认识" value={summary.unknown} />
          <StatTile label="本次模糊" value={summary.fuzzy} />
          <StatTile label="本次熟悉" value={summary.familiar} />
          <StatTile label="完全会了" value={stats.mastered} />
          <StatTile label="熟悉" value={stats.familiar} />
          <StatTile label="模糊" value={stats.fuzzy} />
          <StatTile label="不认识" value={stats.unknown} />
          <StatTile label="薄弱词" value={stats.weak} />
        </View>
        <View style={styles.actionRow}>
          <AppButton
            label="再测一次"
            onPress={() => {
              setCards(createCards());
              setIndex(0);
              setRevealed(false);
              setSummary({ unknown: 0, fuzzy: 0, familiar: 0 });
            }}
          />
          <AppButton label="返回测试中心" onPress={() => router.push("/test")} variant="secondary" />
          <AppButton
            label="查看薄弱词"
            onPress={() =>
              router.push({
                pathname: "/words",
                params: { status: "weak" }
              })
            }
            variant="plain"
          />
        </View>
      </Screen>
    );
  }

  const prompt = current.direction === "es-en" ? current.word.spanish : current.word.english.join("; ");
  const answer = current.direction === "es-en" ? current.word.english.join("; ") : current.word.spanish;
  const directionLabel = current.direction === "es-en" ? "西语 → 英语" : "英语 → 西语";

  return (
    <Screen>
      <SectionTitle title={`第 ${index + 1} / ${cards.length} 题`} subtitle={directionLabel} />
      <View style={styles.card}>
        <Text style={styles.prompt}>{prompt}</Text>
        {revealed ? (
          <View style={styles.answerBox}>
            <Text style={styles.answerLabel}>答案</Text>
            <Text style={styles.answer}>{answer}</Text>
            {current.word.exampleSpanish ? (
              <Text style={styles.example}>{current.word.exampleSpanish}</Text>
            ) : null}
            {current.word.exampleEnglish ? (
              <Text style={styles.example}>{current.word.exampleEnglish}</Text>
            ) : null}
          </View>
        ) : null}
      </View>

      {!revealed ? (
        <AppButton label="显示答案" onPress={() => setRevealed(true)} />
      ) : (
        <View style={styles.actionRow}>
          {(["unknown", "fuzzy", "familiar"] as SelfGrade[]).map((grade) => (
            <AppButton
              key={grade}
              label={gradeLabels[grade]}
              onPress={() => handleGrade(grade)}
              variant={grade === "unknown" ? "plain" : "secondary"}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 18,
    minHeight: 220,
    justifyContent: "center",
    padding: 22
  },
  prompt: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 42,
    textAlign: "center"
  },
  answerBox: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: 6,
    paddingTop: 16
  },
  answerLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "900"
  },
  answer: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 28
  },
  example: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  }
});
