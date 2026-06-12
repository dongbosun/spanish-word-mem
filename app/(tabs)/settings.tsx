import { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { AppButton } from "@/components/AppButton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { colors } from "@/constants/theme";
import { useProgress } from "@/state/ProgressContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { exportProgress, importProgress, resetAllProgress } = useProgress();
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState("");

  const handleExport = () => {
    const json = exportProgress();
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `spanish-vocab-progress-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setMessage("已导出进度 JSON。");
      return;
    }
    setImportText(json);
    setMessage("当前环境不支持直接下载，已把 JSON 放入文本框。");
  };

  const handleImport = () => {
    const result = importProgress(importText);
    if (result.ok) {
      setMessage("导入成功。");
      setImportText("");
    } else {
      setMessage(result.error);
    }
  };

  return (
    <Screen>
      <SectionTitle title="设置" subtitle="管理本地进度、数据来源和隐私说明。" />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>进度备份</Text>
        <Text style={styles.text}>导出的 JSON 只包含本设备/浏览器里的学习进度。</Text>
        <View style={styles.actionRow}>
          <AppButton label="导出进度" onPress={handleExport} />
          <AppButton label="导入进度" onPress={handleImport} variant="secondary" />
        </View>
        <TextInput
          accessibilityLabel="导入进度 JSON"
          multiline
          onChangeText={setImportText}
          placeholder="把进度 JSON 粘贴到这里再点导入进度"
          placeholderTextColor={colors.muted}
          style={styles.importBox}
          textAlignVertical="top"
          value={importText}
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>重置</Text>
        <Text style={styles.text}>重置会清空所有收藏、掌握度和测试记录。</Text>
        <ConfirmDialog
          destructive
          label="重置全部进度"
          message="确定要清空全部学习进度吗？这个操作不能撤销。"
          onConfirm={() => {
            resetAllProgress();
            setMessage("已重置全部进度。");
          }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>数据与隐私</Text>
        <Text style={styles.text}>所有学习进度仅保存在本设备/浏览器，本应用不上传数据。</Text>
        <Text style={styles.text}>当前词库为 MVP 示例数据，完整词库上线前需要补充来源和授权信息。</Text>
        <AppButton label="数据来源 / 授权说明" onPress={() => router.push("/sources")} variant="secondary" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>版本</Text>
        <Text style={styles.text}>spanish-vocab-list 0.1.0</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 16
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  text: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  importBox: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    minHeight: 150,
    padding: 12,
    outlineStyle: "none" as never
  },
  message: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "800"
  }
});
