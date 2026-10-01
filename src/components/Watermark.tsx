import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';

/**
 * Component Watermark định danh bắt buộc trên mọi màn hình chính (Câu 1b)
 * Định dạng: TH2 · {mssv} · {hoTen} · #{examStamp()}
 */
export const Watermark: React.FC = () => {
  const stamp = examStamp();

  return (
    <View style={[styles.container, VARIANT.watermarkAtTop ? styles.topPosition : styles.bottomPosition]}>
      <Text style={styles.watermarkText} numberOfLines={1}>
        TH2 · {STUDENT.mssv} · {STUDENT.hoTen} · #{stamp}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(29, 78, 216, 0.08)',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    marginHorizontal: 16,
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topPosition: {
    marginBottom: 8,
  },
  bottomPosition: {
    marginTop: 8,
  },
  watermarkText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
});

export default Watermark;
