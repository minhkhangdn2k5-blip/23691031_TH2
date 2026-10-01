import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCartStore, CartItem } from '@stores/cartStore';
import Watermark from '@components/Watermark';
import {
  STUDENT,
  ROOM_LABEL,
  BASE_SHIP_FEE,
  PRICE_MULTIPLIER,
  VARIANT,
} from '@constants/student';
import { COLORS, SIZES } from '@constants/theme';

/**
 * Màn hình Giỏ Hàng (Câu 3a - CartScreen)
 * - Quản lý giỏ hàng Zustand + Persist AsyncStorage key: ktxgo-cart-23691031
 * - Tăng, giảm số lượng, xóa từng món, xóa toàn bộ giỏ
 * - Tính tổng tiền món, phí ship KTX và tổng thanh toán
 * - Nút "Đặt hàng ngay (P.131)" hiển thị Alert xác nhận
 */
export const CartScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const items = useCartStore((state) => state.items);
  const changeQty = useCartStore((state) => state.changeQty);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalAmount = useCartStore((state) => state.totalAmount());
  const totalQuantity = useCartStore((state) => state.totalQuantity());

  const shipFee = BASE_SHIP_FEE; // 9.000 đ phí giao cơ bản KTX
  const grandTotal = totalAmount > 0 ? totalAmount + shipFee : 0;

  const handleClearCart = () => {
    Alert.alert(
      'Xóa toàn bộ giỏ hàng',
      'Bạn có chắc chắn muốn xóa tất cả các món trong giỏ không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa hết', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      '🎉 Đặt hàng thành công!',
      `Đơn hàng giao đến phòng ${ROOM_LABEL} đã được tiếp nhận thành công!\n\n• Số lượng: ${totalQuantity} món\n• Tổng thanh toán: ${grandTotal.toLocaleString('vi-VN')} đ\n• Thí sinh: ${STUDENT.mssv} - ${STUDENT.hoTen}`,
      [
        {
          text: 'Xác nhận',
          onPress: () => {
            clearCart();
            navigation.navigate('ShopTab');
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const itemUnitPrice = Math.round(item.price * PRICE_MULTIPLIER);
    const itemSubtotal = itemUnitPrice * item.quantity;

    return (
      <View style={styles.itemCard}>
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
          resizeMode="contain"
        />

        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.itemPrice}>
            {itemUnitPrice.toLocaleString('vi-VN')} đ
          </Text>

          <View style={styles.actionRow}>
            {/* Bộ điều khiển số lượng */}
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => changeQty(item.id, -1)}
                activeOpacity={0.7}
              >
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.qtyValue}>{item.quantity}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => changeQty(item.id, 1)}
                activeOpacity={0.7}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Thành tiền & Nút xóa */}
            <View style={styles.itemRightBox}>
              <Text style={styles.itemSubtotal}>
                {itemSubtotal.toLocaleString('vi-VN')} đ
              </Text>
              <TouchableOpacity
                onPress={() => removeItem(item.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.deleteText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header Giỏ hàng */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>GIỎ HÀNG KTX</Text>
          <Text style={styles.headerSubtitle}>
            📍 Nhận tại phòng {ROOM_LABEL} · {STUDENT.mssv}
          </Text>
        </View>

        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Xóa tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        // Trạng thái giỏ rỗng
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
          <Text style={styles.emptySubtitle}>
            Bạn chưa thêm món ăn nào vào giỏ hàng. Hãy khám phá thực đơn KTXGo nhé!
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => navigation.navigate('ShopTab')}
            activeOpacity={0.8}
          >
            <Text style={styles.exploreBtnText}>Xem thực đơn ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Danh sách món trong giỏ + Khối thanh toán
        <View style={styles.container}>
          <FlatList
            data={items}
            keyExtractor={(item) => `cart-${item.id}`}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Khối tóm tắt thanh toán */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tiền món ({totalQuantity} phần):</Text>
              <Text style={styles.summaryValue}>
                {totalAmount.toLocaleString('vi-VN')} đ
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí giao KTX ({ROOM_LABEL}):</Text>
              <Text style={styles.summaryShip}>
                {shipFee.toLocaleString('vi-VN')} đ
              </Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
              <Text style={styles.totalValue}>
                {grandTotal.toLocaleString('vi-VN')} đ
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutBtnText}>
                Đặt hàng ngay ({ROOM_LABEL})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: 2,
  },
  clearBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearBtnText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 70,
    height: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '600',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: 10,
  },
  itemRightBox: {
    alignItems: 'flex-end',
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  deleteText: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '600',
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  summaryShip: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default CartScreen;
