import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { fetchProducts, Product } from '@services/productApi';
import { ProductCard } from '@components/ProductCard';
import Watermark from '@components/Watermark';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import {
  STUDENT,
  ROOM_LABEL,
  DEBOUNCE_MS,
  VARIANT,
} from '@constants/student';
import { COLORS } from '@constants/theme';

/**
 * Màn hình Trang Chủ KTXGo (Câu 2a & 2b)
 * - Header nhận diện KTXGO + Giao tận P.131
 * - Ô tìm kiếm Debounce 400ms
 * - FlashList 2 cột với keyExtractor có tiền tố MSSV
 * - TanStack Query quản lý 3 trạng thái mạng: Loading, Error (có nút Thử lại), Success
 */
export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, DEBOUNCE_MS);

  // TanStack Query lấy danh sách 12 món từ FakeStoreAPI
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Lọc sản phẩm theo từ khóa đã debounce
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!debouncedSearch.trim()) return products;
    return products.filter((item) =>
      item.title.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
    );
  }, [products, debouncedSearch]);

  const handleProductPress = (product: Product) => {
    navigation.navigate('Detail', { id: product.id });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header KTXGO */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>KTXGO</Text>
          <Text style={styles.roomLabel}>📍 Giao tận {ROOM_LABEL} · IUH</Text>
        </View>
        <View style={styles.studentBadge}>
          <Text style={styles.studentBadgeText}>{STUDENT.mssv}</Text>
        </View>
      </View>

      {/* Ô tìm kiếm món ăn với Debounce */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={`Tìm món ăn, đồ uống KTX (${DEBOUNCE_MS}ms)...`}
            placeholderTextColor={COLORS.textLight}
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 3 Trạng thái mạng với React Query */}
      <View style={styles.contentContainer}>
        {isLoading ? (
          // 1. Trạng thái Đang tải (Loading State)
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingTitle}>Đang tải thực đơn KTXGo...</Text>
            <Text style={styles.loadingSubtitle}>MSSV: {STUDENT.mssv} · FakeStoreAPI</Text>
          </View>
        ) : isError ? (
          // 2. Trạng thái Lỗi (Error State)
          <View style={styles.centerContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Không thể tải danh sách món</Text>
            <Text style={styles.errorMessage}>
              {(error as any)?.message || 'Lỗi kết nối máy chủ'} · {STUDENT.mssv}
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
          // 3. Trạng thái Thành công (Success State) - FlashList 2 Cột
          <FlashList
            data={filteredProducts}
            numColumns={2}
            keyExtractor={(item) => `23691031-${item.id}`}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => handleProductPress(item)}
              />
            )}
            contentContainerStyle={styles.listContent}
            onRefresh={refetch}
            refreshing={isRefetching}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🍽️</Text>
                <Text style={styles.emptyTitle}>Không tìm thấy món ăn</Text>
                <Text style={styles.emptySubtitle}>
                  Thử tìm kiếm với từ khóa khác xem sao nhé!
                </Text>
              </View>
            }
          />
        )}
      </View>

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
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  roomLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: 2,
  },
  studentBadge: {
    backgroundColor: 'rgba(29, 78, 216, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  studentBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: 14,
    color: COLORS.textLight,
    paddingHorizontal: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 14,
  },
  loadingSubtitle: {
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
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default HomeScreen;
