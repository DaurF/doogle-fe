import type { ICategory } from '@/entities/category/model/types'
import type { IProduct } from '@/entities/product/model/types'
import type { IProducer } from '@/entities/producer/model/types'

export type RequestType =
  | 'create-product'
  | 'update-product'
  | 'create-category'
  | 'update-category'
  | 'create-producer'
  | 'update-producer'

export interface IRequest {
  _id: string
  type: RequestType
  body: ICategory | IProduct | IProducer
  createdAt?: string
  updatedAt?: string
  submittedBy: string
}
