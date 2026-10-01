import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@screens/HomeScreen';
import DetailScreen from '@screens/DetailScreen';
import { VARIANT } from '@constants/student';
import { COLORS } from '@constants/theme';

export type ShopStackParamList = {
  Home: undefined;
  Detail: { id: string | number };
};

const Stack = createNativeStackNavigator<ShopStackParamList>();

/**
 * Stack Cửa Hàng: Home -> Chi tiết món (Câu 1a)
 * Presentation theo biến thể: modal hoặc card (số cuối = 1 -> card)
 */
export const ShopStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.primary,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          title: 'Chi tiết món',
          presentation: VARIANT.detailPresentation === 'modal' ? 'modal' : 'card',
        }}
      />
    </Stack.Navigator>
  );
};

export default ShopStack;
