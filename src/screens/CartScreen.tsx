import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useCartStore } from '@stores/cartStore';
import { ROOM_LABEL, VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';
import Watermark from '@components/Watermark';

export const CartScreen: React.FC = () => {
  const items = useCartStore((state) => state.items);
  const totalAmount = useCartStore((state) => state.totalAmount());

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>GIỎ HÀNG</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholderText}>
          {items.length === 0 ? 'Giỏ hàng đang trống' : `Có ${items.length} món trong giỏ`}
        </Text>
        <Text style={styles.roomText}>Giao đến {ROOM_LABEL}</Text>
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
  content: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: COLORS.text, fontSize: 16, fontWeight: '600', marginBottom: 8 },
  roomText: { color: COLORS.secondary, fontSize: 14, fontWeight: '700' },
});

export default CartScreen;
