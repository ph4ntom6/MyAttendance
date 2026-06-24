import { DateAt } from 'models/DateAt'
import { ApiSuccessResponseModel } from './ApiSuccessResponseModel'

export type QuoteApiResponseModel = ApiSuccessResponseModel<Quote>
export interface Quote {
    id: number
    quote: string
    author: string
    created_at: DateAt
    updated_at: DateAt
    deleted_at: DateAt
}
