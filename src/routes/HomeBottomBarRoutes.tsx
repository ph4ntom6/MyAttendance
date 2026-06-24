import React, { FC, useState } from 'react'
import { HomeBottomBar, HomeBottomBarParamList } from './HomeBottomBar'
import { COLORS, FONT_SIZE, SPACE, STRINGS } from 'config'
import { AppLabel } from 'ui/components/atoms/app_label/AppLabel'
import AttendanceController from 'ui/screens/main/home/attendance/AttendanceController'
import PunchInAndOutController from 'ui/screens/main/home/punch_in_and_out/PunchInAndOutController'
import RequestsController from 'ui/screens/main/home/requests/RequestsController'
import { Image, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { shadowStyleProps } from 'utils/Util'
import HeaderRightTextWithIcon from 'ui/components/headers/header_right_text_with_icon/HeaderRightTextWithIcon'
import HeaderLeftTextWithIcon from 'ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon'
import { HomeStackParamList } from './HomeStack'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import AppPopUpWithActionsButton from 'ui/components/organisms/app_popup/AppPopUpWithActionsButton'
import usePreventDoubleTap from 'hooks/usePreventDoubleTap'
import { logOut } from 'stores/authSlice'
import { useAppDispatch } from 'hooks/redux'
import HelpIcon from 'assets/images/help-icon.svg'
type Props = { initialParams: keyof HomeBottomBarParamList }
type HomeNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>

export const HomeBottomBarRoutes: FC<Props> = ({ initialParams }) => {
    const navigation = useNavigation<HomeNavigationProp>()
    const safeAreaInset = useSafeAreaInsets()
    const dispatch = useAppDispatch()

    const [showSignoutDialog, setShowSignoutDialog] = useState(false)

    const handleSignout = usePreventDoubleTap(async () => {
        dispatch(logOut())
    })
    return (
        <>
            <HomeBottomBar.Navigator
                initialRouteName={initialParams}
                screenOptions={{
                    tabBarItemStyle: {
                        justifyContent: 'center',
                        flexDirection: 'column',
                    },
                    tabBarStyle: {
                        backgroundColor: COLORS.theme?.interface['100'],
                        paddingTop:
                            safeAreaInset.bottom === 0
                                ? SPACE.md - SPACE.sm
                                : SPACE.md,
                        paddingBottom:
                            safeAreaInset.bottom === 0
                                ? 8
                                : safeAreaInset.bottom + 8,
                        paddingHorizontal: 20,
                        height: 65 + safeAreaInset.bottom,
                        ...{
                            ...shadowStyleProps,
                            shadowOpacity: 0.1,
                            shadowOffset: { width: 0, height: -0.1 },
                        },
                    },
                    headerStyle: {
                        backgroundColor: COLORS.theme?.interface['100'],
                        ...{
                            ...shadowStyleProps,
                            shadowOpacity: 0.09,
                            shadowOffset: { width: 0, height: 1 },
                        },
                    },
                    headerRight: () => (
                        <HeaderRightTextWithIcon
                            icon={() => (
                                <Image
                                    source={require('assets/images/sign_out.png')}
                                    style={styles.image}
                                />
                            )}
                            onPress={() => setShowSignoutDialog(true)}
                        />
                    ),
                    headerLeft: () => (
                        <HeaderLeftTextWithIcon
                            icon={() => <HelpIcon height={30} width={30} />}
                            onPress={() => navigation.navigate('FAQ')}
                        />
                    ),
                }}
            >
                <HomeBottomBar.Screen
                    name="Attendance"
                    component={AttendanceController}
                    options={{
                        tabBarLabel: ({ focused }) => (
                            <AppLabel
                                text="Attendance"
                                style={[
                                    {
                                        fontSize: FONT_SIZE._3xs,
                                    },
                                    focused
                                        ? {
                                              color: COLORS.theme?.primaryColor,
                                          }
                                        : {
                                              color: COLORS.theme?.interface[
                                                  '400'
                                              ],
                                          },
                                ]}
                            />
                        ),
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={require('assets/images/attendance.png')}
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused
                                        ? COLORS.theme?.primaryColor
                                        : COLORS.theme?.interface['400'],
                                }}
                            />
                        ),
                    }}
                />
                <HomeBottomBar.Screen
                    name="PunchInAndOut"
                    component={PunchInAndOutController}
                    options={{
                        tabBarLabel: ({ focused }) => (
                            <AppLabel
                                text="Punch In/Out"
                                style={[
                                    {
                                        fontSize: FONT_SIZE._3xs,
                                    },
                                    focused
                                        ? {
                                              color: COLORS.theme?.primaryColor,
                                          }
                                        : {
                                              color: COLORS.theme?.interface[
                                                  '400'
                                              ],
                                          },
                                ]}
                            />
                        ),
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={require('assets/images/punch_in_out.png')}
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused
                                        ? COLORS.theme?.primaryColor
                                        : COLORS.theme?.interface['400'],
                                }}
                            />
                        ),
                    }}
                />
                <HomeBottomBar.Screen
                    name="Requests"
                    component={RequestsController}
                    options={{
                        tabBarLabel: ({ focused }) => (
                            <AppLabel
                                text="Requests"
                                style={[
                                    {
                                        fontSize: FONT_SIZE._3xs,
                                    },
                                    focused
                                        ? {
                                              color: COLORS.theme?.primaryColor,
                                          }
                                        : {
                                              color: COLORS.theme?.interface[
                                                  '400'
                                              ],
                                          },
                                ]}
                            />
                        ),
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={require('assets/images/request.png')}
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused
                                        ? COLORS.theme?.primaryColor
                                        : COLORS.theme?.interface['400'],
                                }}
                            />
                        ),
                    }}
                />
            </HomeBottomBar.Navigator>
            <AppPopUpWithActionsButton
                isVisible={showSignoutDialog}
                title={STRINGS.puchInAndOut.signout}
                message={STRINGS.puchInAndOut.signout_text}
                actions={[
                    {
                        title: 'Cancel',
                        onPress: () => setShowSignoutDialog(false),
                    },
                    { title: 'Yes, Confirm', onPress: handleSignout },
                ]}
            />
        </>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
})
