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
 * Ô nhập phone hoặc email theo biến thể số cuối MSSV
 */
export const LoginScreen: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const isPhone = VARIANT.authField === 'phone';

  const [inputVal, setInputVal] = useState(
    isPhone ? '0912345678' : `${STUDENT.mssv}@iuh.edu.vn`
  );

  const handleLogin = () => {
    if (!inputVal.trim()) {
      Alert.alert('Thông báo', isPhone ? 'Vui lòng nhập số điện thoại!' : 'Vui lòng nhập email!');
      return;
    }
    login(inputVal.trim());
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
              style={styles.input}
              value={inputVal}
              onChangeText={setInputVal}
              placeholder={isPhone ? '0912345678' : `${STUDENT.mssv}@iuh.edu.vn`}
              placeholderTextColor={COLORS.textLight}
              keyboardType={isPhone ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity style={styles.loginButton} activeOpacity={0.8} onPress={handleLogin}>
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
    marginBottom: 20,
  },
  loginButton: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
