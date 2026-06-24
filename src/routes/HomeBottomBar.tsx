import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

export type HomeBottomBarParamList = {
    Attendance: undefined
    PunchInAndOut: undefined
    Requests: undefined
}

export const HomeBottomBar = createBottomTabNavigator<HomeBottomBarParamList>()
