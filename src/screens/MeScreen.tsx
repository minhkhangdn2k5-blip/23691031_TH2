import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import { useCampusLocation, CAMPUS_GATE_COORDS } from '@hooks/useCampusLocation';
import Watermark from '@components/Watermark';
import {
  STUDENT,
  examStamp,
  ROOM_LABEL,
  VARIANT,
  BASE_SHIP_FEE,
} from '@constants/student';
import { COLORS } from '@constants/theme';

/**
 * Màn hình Tôi / Thông tin & Vị trí Campus (Câu 3b - MeScreen)
 * - Hiển thị thông tin sinh viên, MSSV, Stamp, Room label, Token
 * - Hook useCampusLocation tính khoảng cách Haversine đến Cổng KTX IUH
 * - Tính phí ship theo Công thức B (Số lẻ)
 * - Xử lý 3 trạng thái quyền (granted, denied, blocked)
 * - Nút Đăng xuất quay về AuthStack
 */
export const MeScreen: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const stamp = examStamp();

  const {
    permissionState,
    currentCoords,
    distanceKm,
    shippingFee,
    loading,
    requestPermission,
    simulateLocation,
    openSettings,
  } = useCampusLocation();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi KTXGo?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TÔI · THÔNG TIN & VỊ TRÍ</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Thẻ thông tin cá nhân */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>🎓</Text>
          </View>
          <Text style={styles.nameText}>{STUDENT.hoTen}</Text>
          <Text style={styles.mssvText}>
            MSSV: {STUDENT.mssv} · Mã Stamp: #{stamp}
          </Text>

          <View style={styles.profileInfoRow}>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeLabel}>Phòng KTX</Text>
              <Text style={styles.profileBadgeVal}>{ROOM_LABEL}</Text>
            </View>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeLabel}>Biến thể số cuối</Text>
              <Text style={styles.profileBadgeVal}>Số {STUDENT.mssv.slice(-1)} (Lẻ)</Text>
            </View>
          </View>

          <View style={styles.tokenBox}>
            <Text style={styles.tokenLabel}>Token phiên làm việc:</Text>
            <Text style={styles.tokenValue} numberOfLines={1}>
              {token || 'Chưa đăng nhập'}
            </Text>
          </View>
        </View>

        {/* Thẻ Vị trí GPS & Ước tính Phí Ship Campus */}
        <View style={styles.locationCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderIcon}>📍</Text>
            <View>
              <Text style={styles.cardTitle}>Vị trí & Phí Ship Campus</Text>
              <Text style={styles.cardSubtitle}>
                Cổng KTX IUH: {CAMPUS_GATE_COORDS.latitude}, {CAMPUS_GATE_COORDS.longitude}
              </Text>
            </View>
          </View>

          {/* Trạng thái quyền Location */}
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Trạng thái quyền vị trí:</Text>
            <Text
              style={[
                styles.statusValue,
                permissionState === 'granted'
                  ? styles.statusSuccess
                  : permissionState === 'blocked'
                  ? styles.statusBlocked
                  : styles.statusWarning,
              ]}
            >
              {permissionState === 'granted'
                ? '✅ Đã cấp quyền GPS'
                : permissionState === 'blocked'
                ? '🚫 Bị chặn (Blocked) - Mở Cài đặt'
                : permissionState === 'denied'
                ? '⚠️ Bị từ chối'
                : 'Chưa cấp quyền'}
            </Text>
          </View>

          {/* Hiển thị kết quả tính toán */}
          {distanceKm !== null && shippingFee !== null && (
            <View style={styles.resultContainer}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Khoảng cách đến Cổng KTX:</Text>
                <Text style={styles.resultValue}>{distanceKm} km</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Công thức tính:</Text>
                <Text style={styles.resultFormula}>
                  Công thức B ({BASE_SHIP_FEE}đ + km×1.500đ + 2.000đ)
                </Text>
              </View>

              <View style={[styles.resultRow, styles.shipFeeRow]}>
                <Text style={styles.shipFeeLabel}>Phí ship ước tính:</Text>
                <Text style={styles.shipFeeValue}>
                  {shippingFee.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            </View>
          )}

          {/* Nút bấm xin quyền / lấy vị trí */}
          <TouchableOpacity
            style={styles.gpsButton}
            onPress={requestPermission}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.gpsButtonText}>
                {permissionState === 'granted' ? '🔄 Cập nhật vị trí GPS' : '📍 Lấy vị trí ước tính ship'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Nút mở cài đặt nếu quyền bị blocked */}
          {permissionState === 'blocked' && (
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={openSettings}
              activeOpacity={0.8}
            >
              <Text style={styles.settingsButtonText}>⚙️ Mở Cài đặt hệ thống</Text>
            </TouchableOpacity>
          )}

          {/* Bộ nút mô phỏng khoảng cách để test trên máy ảo */}
          <View style={styles.simulateSection}>
            <Text style={styles.simulateTitle}>Thử nghiệm nhanh khoảng cách:</Text>
            <View style={styles.simulateBtnGroup}>
              <TouchableOpacity
                style={styles.simulateBtn}
                onPress={() => simulateLocation(0.5)}
              >
                <Text style={styles.simulateBtnText}>0.5 km</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.simulateBtn}
                onPress={() => simulateLocation(1.5)}
              >
                <Text style={styles.simulateBtnText}>1.5 km</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.simulateBtn}
                onPress={() => simulateLocation(3.2)}
              >
                <Text style={styles.simulateBtnText}>3.2 km</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Nút Đăng xuất */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutBtnText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>
      </ScrollView>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(29, 78, 216, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarText: {
    fontSize: 28,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
  },
  mssvText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  profileInfoRow: {
    flexDirection: 'row',
    marginTop: 14,
    width: '100%',
    justifyContent: 'space-around',
  },
  profileBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileBadgeLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  profileBadgeVal: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  tokenBox: {
    marginTop: 14,
    width: '100%',
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tokenLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  tokenValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },
  locationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusSuccess: {
    color: COLORS.success,
  },
  statusWarning: {
    color: COLORS.secondary,
  },
  statusBlocked: {
    color: COLORS.error,
  },
  resultContainer: {
    backgroundColor: 'rgba(249, 115, 22, 0.06)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  resultLabel: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  resultValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  resultFormula: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  shipFeeRow: {
    borderTopWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
    paddingTop: 6,
    marginTop: 4,
  },
  shipFeeLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  shipFeeValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  gpsButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  settingsButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  simulateSection: {
    marginTop: 14,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: 10,
  },
  simulateTitle: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '600',
    marginBottom: 6,
  },
  simulateBtnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  simulateBtn: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  simulateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  logoutBtn: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.error,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  logoutBtnText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: '800',
  },
});

export default MeScreen;
