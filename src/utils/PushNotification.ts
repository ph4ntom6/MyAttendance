import OneSignal, {
    NotificationReceivedEvent,
    OpenedEvent,
} from 'react-native-onesignal'
import Env from 'envs/env'
import { AppLog } from './Util'

export const PushNotification = {
    init: (
        onSetNotificationOpenedHandler: (openedEvent: OpenedEvent) => void
    ) => {
        OneSignal.setLogLevel(6, 0)
        OneSignal.setAppId(Env.ONESIGNAL_ID)

        //Prompt for push on iOS
        OneSignal.promptForPushNotificationsWithUserResponse((response) => {
            AppLog.log(() => 'Prompt response: ' + response)
        })

        OneSignal.setNotificationOpenedHandler(onSetNotificationOpenedHandler)
    },
    setForegroundHandler: (
        handler: (event: NotificationReceivedEvent) => void
    ) => {
        OneSignal.setNotificationWillShowInForegroundHandler(handler)
    },
    registerUser: (userId: number | undefined) => {
        userId && OneSignal.sendTag('user_id', userId.toString())
    },

    unRegisterUser: () => {
        OneSignal.deleteTag('user_id')
    },
}
