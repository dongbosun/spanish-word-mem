import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { ProgressProvider } from "@/state/ProgressContext";

export default function RootLayout() {
  return (
    <ProgressProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="chapter/[chapterId]/index" options={{ title: "章节详情" }} />
        <Stack.Screen name="section/[sectionId]/index" options={{ title: "小节词表" }} />
        <Stack.Screen name="word/[wordId]/index" options={{ title: "单词详情" }} />
        <Stack.Screen name="words" options={{ title: "全部词汇" }} />
        <Stack.Screen name="test/session" options={{ title: "自测" }} />
        <Stack.Screen name="sources" options={{ title: "数据来源" }} />
      </Stack>
      <StatusBar style="dark" />
    </ProgressProvider>
  );
}
