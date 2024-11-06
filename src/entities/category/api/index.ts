import type { ICategory } from '@/entities/category/model/types'
import { apiInstance } from '@/shared/api/base'

export async function fetchCategories() {
  return apiInstance.get<ICategory[]>('/categories')
}

export async function deleteCategory(payload: string) {
  return apiInstance.delete(`/categories/${payload}`)
}

export async function updateCategory(payload: {
  id: string
  data: Omit<ICategory, '_id'>
}) {
  return apiInstance.patch(`/categories/${payload.id}`, payload.data)
}
