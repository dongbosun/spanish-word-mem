import { StyleSheet, TextInput, View } from "react-native";

import { colors } from "@/constants/theme";

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder = "搜索西语、英语、例句或标签" }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        accessibilityLabel="搜索"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  input: {
    color: colors.text,
    fontSize: 16,
    outlineStyle: "none" as never
  }
});
