import { PhotoFile } from 'react-native-vision-camera'

export type PunchInAndOutRequestModel = {
    file_name?: string
    location_latitude?: number
    location_longitude?: number
    punch_time?: string
    user_id?: number
    type?: string
    punchin_via?: string
    punch_in_id?: string
    photoFile?: PhotoFile
    missing_punch_out?: string
}
