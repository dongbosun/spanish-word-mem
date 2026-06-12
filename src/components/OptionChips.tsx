import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

type Option<T extends string | number> = {
  label: string;
  value: T;
};

type Props<T extends string | number> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function OptionChips<T extends string | number>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.wrap}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            accessibilityRole="button"
            key={String(option.value)}
            onPress={() => onChange(option.value)}
            style={[styles.chip, active ? styles.activeChip : undefined]}
          >
            <Text style={[styles.text, active ? styles.activeText : undefined]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  activeChip: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary
  },
  text: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  activeText: {
    color: colors.primary,
    fontWeight: "900"
  }
});
