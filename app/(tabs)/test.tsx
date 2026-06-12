import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AppButton } from "@/components/AppButton";
import { EmptyState } from "@/components/EmptyState";
import { OptionChips } from "@/components/OptionChips";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { colors } from "@/constants/theme";
import { getAllWords, getChapters, getSections } from "@/lib/deck";
import { buildTestPool } from "@/lib/testSelection";
import { useProgress } from "@/state/ProgressContext";
import type { DirectionMode, SamplingMode, TestCountOption, TestScope } from "@/types/deck";

type CountValue = "10" | "20" | "50" | "all";

const scopeOptions: { label: string; value: TestScope }[] = [
  { label: "全部词", value: "all" },
  { label: "选择 Chapter", value: "chapter" },
  { label: "选择 Section", value: "section" },
  { label: "收藏词", value: "favorites" },
  { label: "薄弱词", value: "weak" },
  { label: "未掌握词", value: "unmastered" }
];

const directionOptions: { label: string; value: DirectionMode }[] = [
  { label: "西语 → 英语", value: "es-en" },
  { label: "英语 → 西语", value: "en-es" },
  { label: "混合", value: "mixed" }
];

const countOptions: { label: string; value: CountValue }[] = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "50", value: "50" },
  { label: "全部", value: "all" }
];

const samplingOptions: { label: string; value: SamplingMode }[] = [
  { label: "随机", value: "random" },
  { label: "薄弱优先", value: "weak-first" }
];

function parseCount(value: CountValue): TestCountOption {
  if (value === "all") return "all";
  return Number(value) as 10 | 20 | 50;
}

export default function TestSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ scope?: TestScope; chapterId?: string; sectionId?: string }>();
  const words = getAllWords();
  const chapters = getChapters();
  const sections = getSections();
  const { progressMap } = useProgress();
  const [scope, setScope] = useState<TestScope>(
    typeof params.scope === "string" ? params.scope : "all"
  );
  const [chapterId, setChapterId] = useState(
    typeof params.chapterId === "string" ? params.chapterId : chapters[0]?.id ?? ""
  );
  const [sectionId, setSectionId] = useState(
    typeof params.sectionId === "string" ? params.sectionId : sections[0]?.id ?? ""
  );
  const [direction, setDirection] = useState<DirectionMode>("mixed");
  const [count, setCount] = useState<CountValue>("10");
  const [sampling, setSampling] = useState<SamplingMode>("random");

  const pool = useMemo(
    () =>
      buildTestPool(
        {
          scope,
          chapterId,
          sectionId,
          direction,
          count: parseCount(count),
          sampling
        },
        words,
        progressMap
      ),
    [chapterId, count, direction, progressMap, sampling, scope, sectionId, words]
  );

  const startTest = () => {
    router.push({
      pathname: "/test/session",
      params: {
        scope,
        chapterId,
        sectionId,
        direction,
        count,
        sampling
      }
    });
  };

  return (
    <Screen>
      <SectionTitle
        title="测试中心"
        subtitle="只做自评测试：先看题面，再显示答案，然后选择不认识、模糊或熟悉。"
      />

      <View style={styles.group}>
        <Text style={styles.label}>测试范围</Text>
        <OptionChips onChange={setScope} options={scopeOptions} value={scope} />
      </View>

      {scope === "chapter" ? (
        <View style={styles.group}>
          <Text style={styles.label}>选择 Chapter</Text>
          <OptionChips
            onChange={setChapterId}
            options={chapters.map((chapter) => ({ label: chapter.title, value: chapter.id }))}
            value={chapterId}
          />
        </View>
      ) : null}

      {scope === "section" ? (
        <View style={styles.group}>
          <Text style={styles.label}>选择 Section</Text>
          <OptionChips
            onChange={setSectionId}
            options={sections.map((section) => ({ label: section.title, value: section.id }))}
            value={sectionId}
          />
        </View>
      ) : null}

      <View style={styles.group}>
        <Text style={styles.label}>测试方向</Text>
        <OptionChips onChange={setDirection} options={directionOptions} value={direction} />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>测试数量</Text>
        <OptionChips onChange={setCount} options={countOptions} value={count} />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>抽样方式</Text>
        <OptionChips onChange={setSampling} options={samplingOptions} value={sampling} />
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>当前可测试词数：{pool.length}</Text>
      </View>

      {pool.length === 0 ? (
        <EmptyState title="这个范围暂时没有单词" description="可以换一个范围，或先收藏、标记一些词。" />
      ) : null}

      <AppButton disabled={pool.length === 0} label="开始测试" onPress={startTest} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 8
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "900"
  },
  summary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14
  },
  summaryText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  }
});
