import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { colors } from "@/constants/theme";

type Props = PropsWithChildren<{
  scroll?: boolean;
}>;

export function Screen({ children, scroll = true }: Props) {
  if (!scroll) {
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1
  },
  content: {
    gap: 14,
    marginHorizontal: "auto" as never,
    maxWidth: 980,
    padding: 16,
    paddingBottom: 32,
    width: "100%"
  }
});
