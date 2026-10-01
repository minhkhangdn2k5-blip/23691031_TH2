import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@stores/authStore';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import Watermark from '@components/Watermark';

export const MeScreen: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const stamp = examStamp();

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>TÔI · LOCATION</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileCard}>
          <Text style={styles.nameText}>{STUDENT.hoTen}</Text>
          <Text style={styles.mssvText}>{STUDENT.mssv} · #{stamp}</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
          <Text style={styles.logoutBtnText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 },
  content: { flex: 1, padding: 20, justifyContent: 'space-between' },
  profileCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  nameText: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  mssvText: { fontSize: 14, color: COLORS.textLight, fontWeight: '600' },
  logoutBtn: {
    backgroundColor: COLORS.error,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoutBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default MeScreen;
