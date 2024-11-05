import { apiInstance } from '@/shared/api/base'
import type { IProduct } from '@/entities/product/model/types'

export async function fetchProducts() {
  return await apiInstance.get<IProduct[]>('/products')
}
