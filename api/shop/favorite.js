import { apiClient } from '@/api/axios';

// 收藏/取消收藏商品
export const toggleFavorite = async (productId) => {
  const res = await apiClient.post(`/shop/favorite/${productId}/toggle`);
  return res.data;
};