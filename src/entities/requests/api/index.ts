import { apiInstance } from '@/shared/api/base'
import type { IRequest } from '@/entities/requests/model/types'

export async function createRequest(payload: IRequest) {
  return await apiInstance.post('/requests', payload)
}

export async function fetchAllRequests() {
  return await apiInstance.get('/requests/all')
}

export async function fetchRequests() {
  return await apiInstance.get('/requests')
}

export async function deleteRequest(id: string) {
  return await apiInstance.delete(`/requests/${id}`)
}

export async function rejectRequest(id: string) {
  return await apiInstance.patch(`/requests/${id}/reject`, null)
}

export async function approveRequest(id: string, payload: any) {
  return await apiInstance.patch(`/requests/${id}/approve`, payload)
}
