import type { IProducer } from '@/entities/producer/model/types'
import type { ICategory } from '@/entities/category/model/types'

export interface IProduct {
  _id: string
  name: string
  description: string
  producer: IProducer
  category: ICategory
  price: number
  stock: number
  images: string[]
  isFavorite: boolean
  isInCart: boolean
}

export interface IPagination {
  page: number
  limit: number
  search: string
  category?: string
  producer?: string
}
