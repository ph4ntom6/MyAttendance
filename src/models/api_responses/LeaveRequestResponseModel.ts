import EStatusType from 'models/enums/EStatusType'
import { ApiSuccessResponseModel } from './ApiSuccessResponseModel'

export type LeaveApiResponseModel = ApiSuccessResponseModel<LeaveRequest>

export type LeaveRequest = {
    total: number
    approved: number
    rejected: number
    pending: number
    records: LeaveItem[]
}
export type LeaveItem = {
    title: string
    count: number
    type: string
    reason: string
    icon: Image
    date_from: string
    date_to: string
    date_from_formatted: string
    date_to_formatted: string
    status: EStatusType
    created_at_formatted: string
    created_at: string
    is_half_day: number
}
export type Image = {
    '2x': string
}
