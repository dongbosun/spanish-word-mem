import { Alert, Platform, Pressable, StyleSheet, Text } from "react-native";

import { colors } from "@/constants/theme";

type Props = {
  label: string;
  message: string;
  onConfirm: () => void;
  destructive?: boolean;
};

export function ConfirmDialog({ label, message, onConfirm, destructive }: Props) {
  const handlePress = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (window.confirm(message)) {
        onConfirm();
      }
      return;
    }

    Alert.alert(label, message, [
      { text: "取消", style: "cancel" },
      { text: "确认", style: destructive ? "destructive" : "default", onPress: onConfirm }
    ]);
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      style={[styles.button, destructive ? styles.destructive : styles.defaultButton]}
    >
      <Text style={[styles.text, destructive ? styles.destructiveText : styles.defaultText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  defaultButton: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
    borderWidth: 1
  },
  destructive: {
    backgroundColor: colors.redSoft,
    borderColor: colors.red,
    borderWidth: 1
  },
  text: {
    fontSize: 15,
    fontWeight: "800"
  },
  defaultText: {
    color: colors.secondary
  },
  destructiveText: {
    color: colors.red
  }
});
