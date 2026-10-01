// TH2 | 23691031 | NGUYEN MINH KHANG | #314753
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootNavigator from '@navigation/RootNavigator';
import { STALE_TIME_MS } from '@constants/student';

// Cấu hình QueryClient toàn cục theo đúng staleTime cá nhân hóa (Câu 2b)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      retry: 2,
    },
  },
});

/**
 * Gốc ứng dụng KTXGo (Cây Provider bắt buộc theo đề thi)
 * SafeAreaProvider -> QueryClientProvider -> NavigationContainer -> RootNavigator
 */
function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;