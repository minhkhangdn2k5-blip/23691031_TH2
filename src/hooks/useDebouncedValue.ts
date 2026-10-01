import { useState, useEffect } from 'react';

/**
 * Hook Debounce trì hoãn giá trị nhập (Câu 2a)
 * Áp dụng cho ô tìm kiếm món ăn với DEBOUNCE_MS tính theo MSSV
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebouncedValue;
