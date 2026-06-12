import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

type Props = {
  label: string;
  value: string | number;
};

export function StatTile({ label, value }: Props) {
  return (
    <View style={styles.tile}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: "31%",
    flexGrow: 1,
    minWidth: 104,
    padding: 12
  },
  value: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3
  }
});
