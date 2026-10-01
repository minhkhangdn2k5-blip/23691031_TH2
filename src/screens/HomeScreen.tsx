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
 * Màn hình Trang Chủ KTXGo (Giao diện 2 - Câu 2)
 * (0) STUDENT + examStamp(), không gõ cứng tên người khác
 * (A) Header KTXGO + Giao tận {ROOM_LABEL}
 * (B) Ô tìm controlled; filter theo bản debounce DEBOUNCE_MS
 * (C) FlashList 2 cột; không bọc ScrollView dọc; key ghép mssv
 * - Xử lý 3 trạng thái mạng: Loading, Error (có nút Thử lại có spinner), Success
 */
export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  // (B) Ô tìm controlled
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, DEBOUNCE_MS);

  // TanStack Query lấy danh sách 12 món từ FakeStoreAPI
  const {
    data: products,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
    isRefetching,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // (B) Filter theo bản debounce DEBOUNCE_MS
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

      {/* (A) Header KTXGO + Giao tận {ROOM_LABEL} */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>KTXGO</Text>
          <Text style={styles.roomLabel}>Giao tận {ROOM_LABEL}</Text>
        </View>
        <View style={styles.studentBadge}>
          <Text style={styles.studentBadgeText}>{STUDENT.mssv}</Text>
        </View>
      </View>

      {/* (B) Ô tìm kiếm controlled with DEBOUNCE_MS */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={`Tìm món ăn, trà sữa (${DEBOUNCE_MS}ms)...`}
            placeholderTextColor={COLORS.textLight}
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 3 Trạng thái mạng với React Query */}
      <View style={styles.contentContainer}>
        {isLoading ? (
          // 1. Loading State
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingTitle}>Đang tải thực đơn KTXGo...</Text>
            <Text style={styles.loadingSubtitle}>MSSV: {STUDENT.mssv} · FakeStoreAPI</Text>
          </View>
        ) : isError ? (
          // 2. Error State
          <View style={styles.centerContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Không thể tải danh sách món</Text>
            <Text style={styles.errorMessage}>
              {(error as any)?.message || 'Lỗi kết nối máy chủ'} · {STUDENT.mssv}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetch()}
              disabled={isFetching}
              activeOpacity={0.8}
            >
              {isFetching ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.retryButtonText}>Thử lại</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          // (C) FlashList 2 cột; không bọc ScrollView dọc; key ghép mssv
          <FlashList
            data={filteredProducts}
            numColumns={2}
            keyExtractor={(item) => `${STUDENT.mssv}-${item.id}`}
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
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
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
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
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
