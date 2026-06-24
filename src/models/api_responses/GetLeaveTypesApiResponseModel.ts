import { ApiSuccessResponseModel } from './ApiSuccessResponseModel'

export type LeaveTypeApiResponseModel = ApiSuccessResponseModel<LeaveType[]>

export interface LeaveType {
    id: number
    name: string
    image_url: ImageURL
}

export interface ImageURL {
    '2x': string
}
