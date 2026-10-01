# KTXGo TH2 - NGUYEN MINH KHANG - 23691031 - https://github.com/minhkhangdn2k5-blip/23691031_TH2.git - #314753 - Số cuối: 1

## 📌 BÀI KIỂM TRA THỰC HÀNH 2: KTXGo (Dịch vụ giao đồ tận phòng KTX)
- **Họ và tên thí sinh**: NGUYEN MINH KHANG
- **Mã số sinh viên (MSSV)**: 23691031
- **Mã Stamp**: #314753
- **Link GitHub nộp bài (clone HTTPS)**: `https://github.com/minhkhangdn2k5-blip/23691031_TH2.git`
- **Số cuối MSSV**: `1` (Số lẻ, < 5)

---

## 🎯 BẢNG BIẾN THỂ (VARIANT HÀNG 1 - SỐ CUỐI = 1)
- **Vị trí Watermark**: Dưới (Bottom)
- **Ô Đăng nhập (Login)**: Số điện thoại (`phone`)
- **Thứ tự Tab**: `Shop → Giỏ → Tôi` (`shopFirst`)
- **Kiểu rung Haptic**: `selection`
- **Công thức Phí Ship**: Công thức B (`BASE_SHIP_FEE + Math.round(km * 1500) + 2000`)
- **Màn hình Chi tiết (Detail)**: Dạng Card / Stack screen (`card`)
- **Phòng giao KTX**: `P.131` (`ROOM_LABEL = P.131`)
- **Phí cơ bản**: `9.000 đ` (`BASE_SHIP_FEE = 9000`)
- **Độ trễ Debounce**: `400 ms` (`DEBOUNCE_MS = 400`)
- **Stale Time React Query**: `21.000 ms` (21 giây)
- **Hệ số nhân giá**: `30.500` (`PRICE_MULTIPLIER = 30500`)
- **Persist Key Giỏ hàng**: `ktxgo-cart-23691031`

---

## 🛠️ CẤU TRÚC THƯ MỤC CHUẨN
```text
KTXGo_23691031/
├── README.md
├── App.tsx
├── package.json
├── babel.config.js
├── tsconfig.json
└── src/
    ├── constants/student.ts
    ├── constants/theme.ts
    ├── hooks/useDebouncedValue.ts
    ├── hooks/useCampusLocation.ts
    ├── services/apiClient.ts
    ├── services/productApi.ts
    ├── stores/authStore.ts
    ├── stores/cartStore.ts
    ├── navigation/RootNavigator.tsx
    ├── navigation/AuthStack.tsx
    ├── navigation/MainTabs.tsx
    ├── navigation/ShopStack.tsx
    ├── components/ProductCard.tsx
    ├── components/Watermark.tsx
    └── screens/
        ├── LoginScreen.tsx
        ├── HomeScreen.tsx
        ├── DetailScreen.tsx
        ├── CartScreen.tsx
        └── MeScreen.tsx
```

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN
```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy Metro Bundler
npm start

# 3. Chạy trên Android
npm run android
```
