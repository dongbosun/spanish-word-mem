import { useMemo } from "react";
import { useRouter } from "expo-router";

import { ChapterProgressCard } from "@/components/ChapterProgressCard";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { getAllWords, getChapters, getSectionsForChapter } from "@/lib/deck";
import { computeChapterStats } from "@/lib/stats";
import { useProgress } from "@/state/ProgressContext";

export default function ChaptersScreen() {
  const router = useRouter();
  const { progressMap } = useProgress();
  const words = getAllWords();
  const chapters = getChapters();
  const cards = useMemo(
    () =>
      chapters.map((chapter) => ({
        chapter,
        sections: getSectionsForChapter(chapter.id),
        stats: computeChapterStats(chapter.id, words, progressMap)
      })),
    [chapters, progressMap, words]
  );

  return (
    <Screen>
      <SectionTitle title="词库" subtitle="按章节和小节浏览完整词库，不隐藏任何单词。" />
      {cards.map(({ chapter, sections, stats }) => (
        <ChapterProgressCard
          chapter={chapter}
          key={chapter.id}
          onPress={() =>
            router.push({
              pathname: "/chapter/[chapterId]",
              params: { chapterId: chapter.id }
            })
          }
          sections={sections}
          stats={stats}
        />
      ))}
    </Screen>
  );
}
