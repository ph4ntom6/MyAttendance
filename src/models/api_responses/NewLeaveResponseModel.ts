import { ApiSuccessResponseModel } from './ApiSuccessResponseModel'
import { ImageURL } from './GetLeaveTypesApiResponseModel'

export type NewLeaveApiResponseModel = ApiSuccessResponseModel<LeaveTypeData>

export interface LeaveTypeData {
    title: string
    type: string
    reason: string
    icon: ImageURL
    date_from_formatted: Date
    date_to_formatted: Date
    status: string
    created_at_formatted: Date
    is_half_day: number
}
