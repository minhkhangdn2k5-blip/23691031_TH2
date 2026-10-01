import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuthStore } from '@stores/authStore';
import { VARIANT, STUDENT } from '@constants/student';
import { COLORS } from '@constants/theme';
import Watermark from '@components/Watermark';

/**
 * Màn hình Đăng Nhập KTXGo (Câu 1a - Giao diện 1)
 * - Ô nhập phone theo biến thể số cuối MSSV (số lẻ: SĐT sinh viên)
 * - Để trống ban đầu (hiện placeholder 0912345678), bấm vào gõ ngay không cần xóa
 * - Giới hạn tuyệt đối 10 số (chỉ nhận số, bắt đầu bằng 0)
 */
export const LoginScreen: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const isPhone = VARIANT.authField === 'phone';

  // Mặc định để chuỗi rỗng để người dùng bấm vào gõ ngay mà không phải xóa
  const [inputVal, setInputVal] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (text: string) => {
    if (isPhone) {
      // Chỉ cho phép nhập ký tự số và giới hạn tối đa đúng 10 chữ số
      const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
      setInputVal(numericText);
    } else {
      setInputVal(text);
    }

    if (errorMessage) {
      setErrorMessage(null); // Tự động xóa lỗi khi người dùng gõ
    }
  };

  const handleLogin = () => {
    const trimmed = inputVal.trim();

    // 1. Kiểm tra để trống
    if (!trimmed) {
      const msg = isPhone
        ? 'Vui lòng nhập số điện thoại sinh viên!'
        : 'Vui lòng nhập email sinh viên!';
      setErrorMessage(msg);
      Alert.alert('Lỗi đăng nhập', msg);
      return;
    }

    // 2. Ràng buộc chặt chẽ cho Số điện thoại
    if (isPhone) {
      if (trimmed.length !== 10) {
        const msg = 'Số điện thoại phải có đúng 10 chữ số!';
        setErrorMessage(msg);
        Alert.alert('Lỗi đăng nhập', msg);
        return;
      }

      if (!trimmed.startsWith('0')) {
        const msg = 'Số điện thoại phải bắt đầu bằng số 0!';
        setErrorMessage(msg);
        Alert.alert('Lỗi đăng nhập', msg);
        return;
      }

      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(trimmed)) {
        const msg = 'Số điện thoại không hợp lệ!';
        setErrorMessage(msg);
        Alert.alert('Lỗi đăng nhập', msg);
        return;
      }
    } else {
      // Validate email nếu là số chẵn
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        const msg = 'Email không đúng định dạng sinh viên!';
        setErrorMessage(msg);
        Alert.alert('Lỗi đăng nhập', msg);
        return;
      }
    }

    setErrorMessage(null);
    login(trimmed);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {VARIANT.watermarkAtTop && <Watermark />}

        <View style={styles.content}>
          <View style={styles.headerBox}>
            <Text style={styles.title}>KTXGO</Text>
            <Text style={styles.subtitle}>Giao đồ tận phòng ký túc xá</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.fieldLabel}>
              {isPhone ? 'Số điện thoại sinh viên' : 'Email sinh viên'}
            </Text>

            <TextInput
              style={[
                styles.input,
                errorMessage ? styles.inputError : null,
              ]}
              value={inputVal}
              onChangeText={handleInputChange}
              placeholder={isPhone ? '0912345678' : `${STUDENT.mssv}@iuh.edu.vn`}
              placeholderTextColor={COLORS.textLight}
              keyboardType={isPhone ? 'phone-pad' : 'email-address'}
              maxLength={isPhone ? 10 : 50}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Dòng báo lỗi màu đỏ trực quan ngay dưới ô nhập */}
            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.8}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Vào cửa hàng</Text>
            </TouchableOpacity>

            <Text style={styles.hintText}>Auth Stack · chưa có token</Text>
          </View>
        </View>

        {!VARIANT.watermarkAtTop && <Watermark />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    marginTop: 6,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    marginBottom: 8,
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: 'rgba(220, 38, 38, 0.04)',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 2,
  },
  loginButton: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  hintText: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default LoginScreen;
