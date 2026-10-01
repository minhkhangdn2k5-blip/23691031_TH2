import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById, Product } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';
import Watermark from '@components/Watermark';
import {
  STUDENT,
  ROOM_LABEL,
  PRICE_MULTIPLIER,
  VARIANT,
} from '@constants/student';
import { COLORS } from '@constants/theme';

/**
 * Màn hình Chi tiết món (Câu 2b - DetailScreen)
 * - Lấy chi tiết món theo ID qua FakeStoreAPI
 * - Hiển thị ảnh lớn, tiêu đề, danh mục, đánh giá, mô tả, giá VND
 * - Nút "Thêm vào giỏ hàng" tích hợp Zustand CartStore + Alert có MSSV
 */
export const DetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const productId = route.params?.id;

  const addItem = useCartStore((state) => state.addItem);

  // TanStack Query lấy chi tiết 1 món
  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
  });

  const priceVND = product
    ? Math.round(product.price * PRICE_MULTIPLIER)
    : 0;
  const formattedPrice = `${priceVND.toLocaleString('vi-VN')} đ`;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });

    Alert.alert(
      'Thành công',
      `Đã thêm "${product.title}" vào giỏ hàng!\n(Thí sinh: ${STUDENT.mssv} - ${STUDENT.hoTen})`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      {VARIANT.watermarkAtTop && <Watermark />}

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải thông tin món ăn...</Text>
          <Text style={styles.loadingSub}>MSSV: {STUDENT.mssv}</Text>
        </View>
      ) : isError || !product ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Không thể tải chi tiết món</Text>
          <Text style={styles.errorMessage}>
            {(error as any)?.message || 'Vui lòng kiểm tra kết nối mạng'} · {STUDENT.mssv}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Ảnh món ăn lớn */}
            <View style={styles.imageCard}>
              <Image
                source={{ uri: product.image }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            {/* Thông tin món */}
            <View style={styles.detailsCard}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {product.category?.toUpperCase() || 'MÓN ĂN KTX'}
                </Text>
              </View>

              <Text style={styles.title}>{product.title}</Text>

              {/* Đánh giá */}
              <View style={styles.ratingRow}>
                <Text style={styles.ratingStar}>⭐</Text>
                <Text style={styles.ratingScore}>
                  {product.rating?.rate || 4.5} / 5.0
                </Text>
                <Text style={styles.ratingCount}>
                  ({product.rating?.count || 120} đánh giá)
                </Text>
              </View>

              {/* Giá tiền */}
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Giá sinh viên:</Text>
                <Text style={styles.priceValue}>{formattedPrice}</Text>
              </View>

              {/* Thông tin phòng nhận KTX */}
              <View style={styles.deliveryBox}>
                <Text style={styles.deliveryIcon}>📍</Text>
                <View style={styles.deliveryInfo}>
                  <Text style={styles.deliveryTitle}>Giao nhanh tận nơi</Text>
                  <Text style={styles.deliveryRoom}>
                    Phòng {ROOM_LABEL} · Ký túc xá Đại học Công Nghiệp TP.HCM
                  </Text>
                </View>
              </View>

              {/* Mô tả món */}
              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionTitle}>Mô tả chi tiết</Text>
                <Text style={styles.descriptionText}>{product.description}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Thanh cố định bên dưới để thêm vào giỏ */}
          <View style={styles.bottomBar}>
            <View style={styles.bottomPriceBox}>
              <Text style={styles.bottomPriceLabel}>Tổng giá món</Text>
              <Text style={styles.bottomPriceValue}>{formattedPrice}</Text>
            </View>

            <TouchableOpacity
              style={styles.addToCartBtn}
              onPress={handleAddToCart}
              activeOpacity={0.8}
            >
              <Text style={styles.addToCartBtnText}>+ Thêm vào giỏ</Text>
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
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  imageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 240,
  },
  detailsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(29, 78, 216, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  categoryText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 28,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingStar: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginRight: 6,
  },
  ratingCount: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginRight: 8,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
  },
  deliveryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  deliveryIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  deliveryRoom: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '600',
    marginTop: 2,
  },
  descriptionBox: {
    marginTop: 16,
  },
  descriptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  bottomPriceBox: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  bottomPriceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  addToCartBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  addToCartBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 14,
  },
  loadingSub: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  errorIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.error,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default DetailScreen;
