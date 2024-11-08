import type { IProduct } from '@/entities/product/model/types'

export type OrderPayload = {
  city: string
  address: string
  delivery_time: string
  products: { product: string; quantity: number }[]
  totalPrice: number
}

export interface IOrder {
  customer_id: string
  city: string
  address: string
  delivery_time: string
  totalPrice: number
  confirmed: Record<string, boolean>
  products: {
    product: IProduct
    quantity: number
  }[]
}
