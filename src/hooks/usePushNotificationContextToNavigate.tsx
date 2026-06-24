import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { HomeStackParamList } from 'routes/HomeStack'
import { StackNavigationProp } from '@react-navigation/stack'

type HomeNavigationProp = StackNavigationProp<HomeStackParamList>

export type PushNotificationContext = {
    screenName: keyof HomeStackParamList
    params?: HomeStackParamList[keyof HomeStackParamList]
}

export const PushNotificationContext =
    React.createContext<PushNotificationContext>({
        screenName: 'Home',
    })

export const usePushNotificationsContextToNavigate = () => {
    const { screenName, params } = React.useContext(PushNotificationContext)
    const navigation = useNavigation<HomeNavigationProp>()
    useEffect(() => {
        navigation.navigate(screenName, params)
    }, [navigation, screenName, params])
}
