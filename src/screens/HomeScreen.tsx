import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROOM_LABEL, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import Watermark from '@components/Watermark';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.header}>
        <Text style={styles.brandTitle}>KTXGO</Text>
        <Text style={styles.roomLabel}>Giao tận {ROOM_LABEL}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholderText}>Danh sách món KTXGo</Text>
      </View>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  brandTitle: { fontSize: 24, fontWeight: '900', color: COLORS.primary },
  roomLabel: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  content: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: COLORS.textLight, fontSize: 15 },
});

export default HomeScreen;
