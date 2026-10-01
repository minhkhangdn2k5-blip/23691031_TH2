import React from 'react';
import { Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShopStack from './ShopStack';
import CartScreen from '@screens/CartScreen';
import MeScreen from '@screens/MeScreen';
import { useCartStore } from '@stores/cartStore';
import { VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';

const Tab = createBottomTabNavigator();

/**
 * Main Tabs: Điều hướng đáy theo đúng thứ tự VARIANT (Câu 1b)
 * Số cuối = 1 (< 5) -> Thứ tự: Shop -> Giỏ -> Tôi
 * tabBarBadge: Tổng số lượng món trong giỏ (tự ẩn khi 0)
 */
export const MainTabs: React.FC = () => {
  const totalQuantity = useCartStore((state) => state.totalQuantity());

  const shopScreen = (
    <Tab.Screen
      key="Shop"
      name="ShopTab"
      component={ShopStack}
      options={{
        headerShown: false,
        title: 'Cửa hàng',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏪</Text>,
      }}
    />
  );

  const cartScreen = (
    <Tab.Screen
      key="Cart"
      name="CartTab"
      component={CartScreen}
      options={{
        headerShown: false,
        title: 'Giỏ',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🛒</Text>,
        tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
        tabBarBadgeStyle: {
          backgroundColor: COLORS.secondary,
          fontSize: 10,
          fontWeight: '800',
          minWidth: 18,
          height: 18,
          lineHeight: 18,
        },
      }}
    />
  );

  const meScreen = (
    <Tab.Screen
      key="Me"
      name="MeTab"
      component={MeScreen}
      options={{
        headerShown: false,
        title: 'Tôi',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
      }}
    />
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: Platform.OS === 'ios' ? 68 : 64,
          paddingBottom: Platform.OS === 'ios' ? 14 : 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      {VARIANT.tabOrder === 'shopFirst' ? (
        <>
          {shopScreen}
          {cartScreen}
          {meScreen}
        </>
      ) : (
        <>
          {cartScreen}
          {shopScreen}
          {meScreen}
        </>
      )}
    </Tab.Navigator>
  );
};

export default MainTabs;
