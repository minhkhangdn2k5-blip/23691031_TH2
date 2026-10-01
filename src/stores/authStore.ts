import { create } from 'zustand';
import { STUDENT, examStamp } from '@constants/student';

interface AuthState {
  token: string | null;
  identifier: string | null;
  login: (phoneOrEmail: string) => void;
  logout: () => void;
}

/**
 * Zustand Store quản lý trạng thái Đăng nhập Auth (Câu 1a)
 * Token dạng: ktxgo-{mssv}-{stamp}
 */
export const useAuthStore = create<AuthState>((set) => ({
  token: null, // Mặc định chưa đăng nhập
  identifier: null,

  login: (phoneOrEmail: string) => {
    const stamp = examStamp();
    const generatedToken = `ktxgo-${STUDENT.mssv}-${stamp}`;
    set({ token: generatedToken, identifier: phoneOrEmail });
  },

  logout: () => {
    set({ token: null, identifier: null });
  },
}));

export default useAuthStore;
