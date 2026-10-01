import axios from 'axios';
import { STUDENT } from '@constants/student';

/**
 * Axios client có interceptor tự động gắn X-Student-Id: {mssv} (Câu 2b)
 */
export const apiClient = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: gắn header X-Student-Id bắt buộc
apiClient.interceptors.request.use(
  (config) => {
    config.headers['X-Student-Id'] = STUDENT.mssv;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
