import apiClient from './apiClient';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

/**
 * Lấy danh sách 12 món từ FakeStoreAPI (Câu 2b)
 * Endpoint: GET https://fakestoreapi.com/products?limit=12
 */
export async function fetchProducts(): Promise<Product[]> {
  const response = await apiClient.get<Product[]>('/products?limit=12');
  return response.data;
}

/**
 * Lấy chi tiết món theo ID (Câu 2b)
 * Endpoint: GET https://fakestoreapi.com/products/{id}
 */
export async function fetchProductById(id: string | number): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
}

export default {
  fetchProducts,
  fetchProductById,
};
