export type NewLeaveRequestModel = {
    user_id: number
    leave_type: string
    start_date: string
    end_date: string
    is_half_day: number
    reason: string
    start_date_actual?: string
    end_date_actual?: string
}
