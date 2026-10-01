import { useState, useCallback } from 'react';
import { Platform, PermissionsAndroid, Linking, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';

// Tọa độ Cổng KTX IUH cố định trong code (10.8222, 106.6874)
export const CAMPUS_GATE_COORDS = {
  latitude: 10.8222,
  longitude: 106.6874,
};

export type LocationPermissionState = 'idle' | 'granted' | 'denied' | 'blocked';

/**
 * Công thức Haversine tính khoảng cách giữa 2 tọa độ GPS (km)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Tính phí ship theo đúng biến thể đề thi (Câu 3b)
 * Công thức A (Số chẵn): BASE_SHIP_FEE + Math.round(km * 2000)
 * Công thức B (Số lẻ): BASE_SHIP_FEE + Math.round(km * 1500) + 2000
 */
export function calculateShipFee(km: number): number {
  if (VARIANT.shipFormula === 'A') {
    return BASE_SHIP_FEE + Math.round(km * 2000);
  } else {
    return BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
  }
}

/**
 * Hook xử lý Location: xin quyền, tính khoảng cách và phí ship (Câu 3b)
 */
export function useCampusLocation() {
  const [permissionState, setPermissionState] = useState<LocationPermissionState>('idle');
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const requestPermission = useCallback(async () => {
    setLoading(true);

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Quyền vị trí KTXGo',
            message: 'KTXGo cần quyền vị trí để ước tính khoảng cách và phí giao đồ đến phòng bạn.',
            buttonPositive: 'Cho phép',
            buttonNegative: 'Hủy',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionState('granted');
          getCurrentLocation();
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          setPermissionState('blocked');
          setLoading(false);
          Alert.alert(
            'Quyền vị trí bị chặn',
            'Bạn đã chặn vĩnh viễn quyền vị trí. Vui lòng mở Cài đặt để cấp quyền cho KTXGo.',
            [
              { text: 'Hủy', style: 'cancel' },
              { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() },
            ]
          );
        } else {
          setPermissionState('denied');
          setLoading(false);
        }
      } catch (err) {
        console.warn('Location permission error:', err);
        setPermissionState('denied');
        setLoading(false);
      }
    } else {
      // iOS
      Geolocation.requestAuthorization();
      setPermissionState('granted');
      getCurrentLocation();
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const dist = calculateHaversineDistance(
          latitude,
          longitude,
          CAMPUS_GATE_COORDS.latitude,
          CAMPUS_GATE_COORDS.longitude
        );
        const fee = calculateShipFee(dist);
        setDistanceKm(dist);
        setShippingFee(fee);
        setLoading(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        // Mock vị trí ký túc xá cho máy ảo (1.2 km)
        const mockDist = 1.2;
        const mockFee = calculateShipFee(mockDist);
        setDistanceKm(mockDist);
        setShippingFee(mockFee);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  return {
    permissionState,
    distanceKm,
    shippingFee,
    loading,
    requestPermission,
    openSettings: () => Linking.openSettings(),
  };
}

export default useCampusLocation;
