export type MissingPunchOutResponseModel = {
    id: number
    team_id: number
    user_id: number
    attendance_type: string
    punch_in_id: string
    punch_time: string
    file_name: string
    location_flag: number
    location_latitude: string
    location_longitude: string
    created_at: string
    updated_at: string
    deleted_at: string
    punchin_via: string
}
