import { useState, useCallback } from 'react';
import { Platform, PermissionsAndroid, Linking, Alert } from 'react-native';
import { BASE_SHIP_FEE, VARIANT, STUDENT } from '@constants/student';

// Tọa độ Cổng KTX IUH cố định trong đề thi (10.8222, 106.6874)
export const CAMPUS_GATE_COORDS = {
  latitude: 10.8222,
  longitude: 106.6874,
  name: 'Cổng Ký Túc Xá IUH',
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
  const R = 6371; // Bán kính Trái Đất tính bằng km
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
 * Tính phí ship theo biến thể số cuối MSSV (Câu 3b)
 * Công thức A (Số chẵn): BASE_SHIP_FEE + Math.round(km * 2000)
 * Công thức B (Số lẻ): BASE_SHIP_FEE + Math.round(km * 1500) + 2000
 */
export function calculateShipFee(km: number): number {
  if (VARIANT.shipFormula === 'A') {
    return BASE_SHIP_FEE + Math.round(km * 2000);
  } else {
    // Công thức B cho MSSV 23691031 (số cuối = 1): 9000 + round(km * 1500) + 2000
    return BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
  }
}

/**
 * Custom Hook xử lý Location: xin quyền, tính khoảng cách và phí ship (Câu 3b)
 */
export function useCampusLocation() {
  const [permissionState, setPermissionState] = useState<LocationPermissionState>('idle');
  const [currentCoords, setCurrentCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Cập nhật khoảng cách & phí ship từ tọa độ
  const applyCoordinates = useCallback((lat: number, lng: number) => {
    const dist = calculateHaversineDistance(
      lat,
      lng,
      CAMPUS_GATE_COORDS.latitude,
      CAMPUS_GATE_COORDS.longitude
    );
    const fee = calculateShipFee(dist);

    setCurrentCoords({ latitude: lat, longitude: lng });
    setDistanceKm(dist);
    setShippingFee(fee);
    setLoading(false);
  }, []);

  // Xin quyền vị trí trên thiết bị
  const requestPermission = useCallback(async () => {
    setLoading(true);

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: `Quyền vị trí KTXGo (${STUDENT.mssv})`,
            message: 'KTXGo cần quyền vị trí để ước tính khoảng cách và phí ship đến phòng KTX.',
            buttonPositive: 'Cho phép',
            buttonNegative: 'Hủy',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionState('granted');
          // Giả lập tọa độ sinh viên cách KTX ~1.35 km
          applyCoordinates(10.8325, 106.6789);
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          setPermissionState('blocked');
          setLoading(false);
          Alert.alert(
            'Quyền vị trí bị chặn',
            'Bạn đã chọn "Không hỏi lại". Vui lòng mở Cài đặt ứng dụng để cấp quyền vị trí cho KTXGo.',
            [
              { text: 'Đóng', style: 'cancel' },
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
      // iOS / Web / Sim
      setPermissionState('granted');
      applyCoordinates(10.8325, 106.6789);
    }
  }, [applyCoordinates]);

  // Giả lập vị trí theo các mốc thực tế quanh trường IUH / KTX để test
  const simulateLocation = useCallback((km: number) => {
    setPermissionState('granted');
    const fee = calculateShipFee(km);
    setDistanceKm(km);
    setShippingFee(fee);
    setCurrentCoords({
      latitude: parseFloat((CAMPUS_GATE_COORDS.latitude + km * 0.009).toFixed(4)),
      longitude: parseFloat((CAMPUS_GATE_COORDS.longitude + km * 0.009).toFixed(4)),
    });
  }, []);

  return {
    permissionState,
    currentCoords,
    distanceKm,
    shippingFee,
    loading,
    requestPermission,
    simulateLocation,
    openSettings: () => Linking.openSettings(),
  };
}

export default useCampusLocation;
