import { apiInstance } from '@/shared/api/base'

export async function addToCart(payload: string) {
  return await apiInstance.post(`/users/cart`, { productId: payload })
}

export async function removeFromCart(payload: string) {
  return await apiInstance.delete(`/users/cart/${payload}`)
}

export async function fetchCart() {
  return await apiInstance.get<any[]>('/users/cart')
}

export async function clearCart() {
  return await apiInstance.delete('/users/cart')
}

export async function changeQuantity(payload: {
  productId: string
  quantity: number
}) {
  return await apiInstance.patch('/users/cart', payload)
}
