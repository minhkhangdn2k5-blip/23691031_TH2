import React from 'react';
import { useAuthStore } from '@stores/authStore';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

/**
 * RootNavigator: Điều phối luồng AuthStack <-> MainTabs (Câu 1a)
 * Khi có token -> MainTabs, khi chưa có token -> AuthStack (Login)
 */
export const RootNavigator: React.FC = () => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <AuthStack />;
  }

  return <MainTabs />;
};

export default RootNavigator;
