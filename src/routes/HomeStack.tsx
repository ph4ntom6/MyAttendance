import { createStackNavigator } from '@react-navigation/stack'
import { FAQItem } from 'ui/screens/main/home/faq/FAQView'
import EAttendanceType from 'models/enums/EAttendanceType'
import { AttendenceItem } from 'models/api_responses/AttendanceApiResponseModel'
import { MissingPunchOutResponseModel } from 'models/api_responses/MissingPunchOutErrorResponseModel'
import { PhotoFile } from 'react-native-vision-camera'

export type HomeStackParamList = {
    Home: undefined
    FAQ: undefined
    FAQDetail: { item: FAQItem }
    AttendanceDetail: { item: AttendenceItem }
    NewLeave: undefined
    ContactUs: undefined
    Camera: { attendanceType: EAttendanceType }
    MissingPunchOut: {
        response?: MissingPunchOutResponseModel
        latitude?: number
        longitude?: number
        photoFile?: PhotoFile | undefined
    }
}

export const HomeStack = createStackNavigator<HomeStackParamList>()
