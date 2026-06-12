import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "@/constants/theme";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "plain";
  disabled?: boolean;
};

export function AppButton({ label, onPress, variant = "primary", disabled }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, styles[variant], disabled ? styles.disabled : undefined]}
    >
      <Text style={[styles.text, variant === "primary" ? styles.primaryText : styles.secondaryText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 16,
    paddingVertical: 11
  },
  primary: {
    backgroundColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
    borderWidth: 1
  },
  plain: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1
  },
  disabled: {
    opacity: 0.45
  },
  text: {
    fontSize: 15,
    fontWeight: "900"
  },
  primaryText: {
    color: "#ffffff"
  },
  secondaryText: {
    color: colors.text
  }
});
