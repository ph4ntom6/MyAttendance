import ELeaveType from 'models/enums/ELeaveType'
import { ApiSuccessResponseModel } from './ApiSuccessResponseModel'

export type AttendanceApiResponseModel = ApiSuccessResponseModel<Attendance>

export type Attendance = {
    avgWorkHours?: string
    avgInTimeFormatted?: string
    avgOutTimeFormatted?: string
    avgInTime?: string
    avgOutTime?: string
    late_count?: number
    absent_count?: number
    attendance_records?: AttendenceItem[]
    records: AttendenceItem[]
}

export type AttendenceItem = {
    type: string
    punch_in_id: number
    punch_out_id: number
    date_formatted: string
    date: string
    location_flag: number
    location_flag_punch_out: number
    punch_in_img: Image
    punch_out_img: Image
    in_time_formatted: string
    out_time_formatted: string
    in_time: string
    out_time: string
    working_hours: string
    on_time: string
    leave: {
        name: ELeaveType
        image_url: Image
    }
}

export type Image = {
    '2x': string
}
