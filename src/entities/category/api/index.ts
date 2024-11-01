import type { ICategory } from '@/entities/category/model/types'
import { apiInstance } from '@/shared/api/base'
import type { IProducer } from '@/entities/producer/model/types'

export async function fetchCategories() {
  return apiInstance.get<ICategory[]>('/categories')
}

export async function fetchProducers() {
  return apiInstance.get<IProducer[]>('/producers')
}
