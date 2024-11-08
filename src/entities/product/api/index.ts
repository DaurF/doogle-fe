import { apiInstance } from '@/shared/api/base'
import type { IPagination, IProduct } from '@/entities/product/model/types'

export async function fetchProducts(payload: IPagination) {
  return await apiInstance.get<{ products: IProduct[]; total: number }>(
    '/products',
    { params: payload },
  )
}

export async function fetchDesiredProducts() {
  return await apiInstance.get<IProduct[]>('/users/favorites')
}

export async function addProductToFavorites(payload: string) {
  return await apiInstance.post(`/users/favorites`, { productId: payload })
}

export async function removeProductFromFavorites(payload: string) {
  return await apiInstance.delete(`/users/favorites/${payload}`)
}
