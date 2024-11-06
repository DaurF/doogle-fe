import { apiInstance } from '@/shared/api/base'
import type { IProducer } from '@/entities/producer/model/types'

export async function fetchProducers() {
  return apiInstance.get<IProducer[]>('/producers')
}

export async function deleteProducer(payload: string) {
  return apiInstance.delete(`/producers/${payload}`)
}

export async function updateProducer(payload: { id: string; data: IProducer }) {
  return apiInstance.patch(`/producers/${payload.id}`, payload.data)
}
