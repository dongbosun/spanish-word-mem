import { DimensionValue, StyleSheet, View } from "react-native";

import { colors } from "@/constants/theme";

type Props = {
  value: number;
};

export function ProgressBar({ value }: Props) {
  const width = `${Math.max(0, Math.min(100, value))}%` as DimensionValue;

  return (
    <View style={styles.track} accessibilityRole="progressbar">
      <View style={[styles.fill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#e7edf3",
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.primary
  }
});
