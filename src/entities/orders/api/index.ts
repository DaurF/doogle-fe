import { apiInstance } from '@/shared/api/base'
import type { IOrder, OrderPayload } from '@/entities/orders/model/types'

export async function addOrder(payload: OrderPayload) {
  return await apiInstance.post('/orders', payload)
}

export async function fetchOrders() {
  return await apiInstance.get<IOrder[]>('/orders')
}

export async function fetchSupplierOrders() {
  return await apiInstance.get<IOrder[]>('/orders/supplier')
}
