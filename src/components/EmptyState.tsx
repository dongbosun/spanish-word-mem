import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

type Props = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 18,
    backgroundColor: colors.surface
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  }
});
