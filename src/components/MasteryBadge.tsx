import { StyleSheet, Text, View } from "react-native";

import { masteryLabels } from "@/constants/labels";
import { colors } from "@/constants/theme";
import type { MasteryStatus } from "@/types/deck";

type Props = {
  status: MasteryStatus;
  mastery?: number;
};

const badgeColors: Record<MasteryStatus, { backgroundColor: string; color: string }> = {
  unknown: { backgroundColor: colors.redSoft, color: colors.red },
  fuzzy: { backgroundColor: colors.amberSoft, color: colors.amber },
  familiar: { backgroundColor: colors.secondarySoft, color: colors.secondary },
  mastered: { backgroundColor: colors.greenSoft, color: colors.green }
};

export function MasteryBadge({ status, mastery }: Props) {
  const badgeStyle = badgeColors[status];

  return (
    <View style={[styles.badge, { backgroundColor: badgeStyle.backgroundColor }]}>
      <Text style={[styles.text, { color: badgeStyle.color }]}>
        {masteryLabels[status]}
        {typeof mastery === "number" ? ` ${mastery}` : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  text: {
    fontSize: 12,
    fontWeight: "700"
  }
});
