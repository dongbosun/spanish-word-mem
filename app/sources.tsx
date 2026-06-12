import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/Screen";
import { SectionTitle } from "@/components/SectionTitle";
import { colors } from "@/constants/theme";

export default function SourcesScreen() {
  return (
    <Screen>
      <SectionTitle title="数据来源 / 授权说明" subtitle="当前版本包含 3000 条样本/生成词卡。" />

      <View style={styles.card}>
        <Text style={styles.title}>当前样本/生成数据</Text>
        <Text style={styles.text}>
          本应用内置的 3000 条西班牙语-英语词卡用于验证浏览、筛选、收藏、打分、测试、统计和导入流程。
        </Text>
        <Text style={styles.text}>
          这些数据是样本/生成数据，不是经过验证的官方 3000 词词库，也不应被描述为权威公开词表或完整课程数据。
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>未来权威词库</Text>
        <Text style={styles.text}>
          后续替换为正式词库时，应在这里补充词库来源、许可证、采集或整理方式、更新时间和适用范围。
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>学习进度</Text>
        <Text style={styles.text}>
          未登录时进度只保存在当前设备或浏览器。登录 Google 后，进度会同步到 Firebase Firestore。
        </Text>
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
    gap: 8,
    padding: 16
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  text: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  }
});
