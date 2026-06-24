import React, { FC } from 'react'
import { HomeStack } from './HomeStack'
import HomeBaseController from 'ui/screens/main/home/HomeController'
import FAQController from 'ui/screens/main/home/faq/FAQController'
import { COLORS } from 'config'
import { shadowStyleProps } from 'utils/Util'
import FQADetailController from 'ui/screens/main/home/faq_detail/FAQDetailController'
import AttendanceDetailController from 'ui/screens/main/home/attendance/attendanceDetails/AttendanceDetailController'
import NewLeaveController from 'ui/screens/main/home/new_leave/NewLeaveController'
import ContactUsController from 'ui/screens/main/home/contact_us/ContactUsController'
import CameraController from 'ui/screens/main/home/punch_in_and_out/camera/CameraController'
import MissingPunchOutController from 'ui/screens/main/home/punch_in_and_out/missing_punch_out/MissingPunchOutController'

type Props = {
    initialRouteName: 'Home'
}

export const HomeRoutes: FC<Props> = ({ initialRouteName }) => {
    return (
        <HomeStack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: COLORS.theme?.interface[100],
                    ...shadowStyleProps,
                    shadowOpacity: 0.2,
                },
            }}
        >
            <HomeStack.Screen
                name="Home"
                component={HomeBaseController}
                options={{ headerShown: false }}
            />
            <HomeStack.Screen name="FAQ" component={FAQController} />
            <HomeStack.Screen
                name="FAQDetail"
                component={FQADetailController}
            />
            <HomeStack.Screen
                name="AttendanceDetail"
                component={AttendanceDetailController}
            />
            <HomeStack.Screen name="NewLeave" component={NewLeaveController} />
            <HomeStack.Screen
                name="ContactUs"
                component={ContactUsController}
            />
            <HomeStack.Screen name="Camera" component={CameraController} />
            <HomeStack.Screen
                name="MissingPunchOut"
                component={MissingPunchOutController}
            />
        </HomeStack.Navigator>
    )
}
