import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { colors } from "@/constants/theme";

type IconName = keyof typeof Ionicons.glyphMap;

function tabIcon(name: IconName) {
  return ({ color, size }: { color: string; size: number }) => (
    <Ionicons color={color} name={name} size={size} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text, fontWeight: "900" },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          minHeight: 62,
          paddingBottom: 8,
          paddingTop: 6
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "800"
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "总览", tabBarIcon: tabIcon("grid-outline") }}
      />
      <Tabs.Screen
        name="chapters"
        options={{ title: "词库", tabBarIcon: tabIcon("library-outline") }}
      />
      <Tabs.Screen
        name="test"
        options={{ title: "测试", tabBarIcon: tabIcon("flash-outline") }}
      />
      <Tabs.Screen
        name="stats"
        options={{ title: "统计", tabBarIcon: tabIcon("bar-chart-outline") }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: "设置", tabBarIcon: tabIcon("settings-outline") }}
      />
    </Tabs>
  );
}
