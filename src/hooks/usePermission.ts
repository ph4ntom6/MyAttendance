import { useCallback } from 'react'
import { Platform } from 'react-native'
import GetLocation, { Location, LocationError } from 'react-native-get-location'
import {
    requestNotifications,
    RESULTS,
    requestMultiple,
    PERMISSIONS,
} from 'react-native-permissions'
import SimpleToast from 'react-native-simple-toast'
import { AppLog, TAG } from 'utils/Util'

export default (
    onLocationPermissionGranted?: (location?: Location) => void,
    onLocationPermissionDenied?: () => void,
    onGPSNotAvailable?: () => void,
    onNotificationPermissionGranted?: () => void
) => {
    const getUserLocation = useCallback(async () => {
        try {
            const latLng = await GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 15000,
            })

            AppLog.log(
                () => 'Location params : ' + JSON.stringify(latLng),
                TAG.AUTHENTICATION
            )

            onLocationPermissionGranted?.(latLng)
        } catch (error: any) {
            const { code, message } = error as LocationError

            if (code === 'UNAVAILABLE') {
                onGPSNotAvailable?.()
                return
            }

            if (code !== 'CANCELLED')
                SimpleToast.show('Location Error : ' + message)
            return
        }
    }, [onGPSNotAvailable, onLocationPermissionGranted])

    const askPermission = useCallback(
        async (askNotificationPermission: boolean = false) => {
            if (askNotificationPermission) {
                if (Platform.OS === 'ios') {
                    const { status } = await requestNotifications([
                        'alert',
                        'sound',
                    ])

                    if (status === RESULTS.GRANTED) {
                        onNotificationPermissionGranted?.()
                    }
                }
            }

            requestMultiple(
                Platform.OS === 'android'
                    ? [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
                    : [
                          PERMISSIONS.IOS.LOCATION_ALWAYS,
                          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                      ]
            )
                .then(async (statuses) => {
                    if (
                        Platform.OS === 'android'
                            ? statuses[
                                  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
                              ] === RESULTS.GRANTED
                            : statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] ===
                                  RESULTS.GRANTED ||
                              statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                                  RESULTS.GRANTED
                    ) {
                        AppLog.log(
                            () => 'Location permission granted ',
                            TAG.AUTHENTICATION
                        )

                        getUserLocation()
                    } else if (
                        Platform.OS === 'android'
                            ? statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
                            : statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                                  RESULTS.DENIED ||
                              statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] ===
                                  RESULTS.DENIED
                    ) {
                        AppLog.log(
                            () => 'Location permission result denied',
                            TAG.AUTHENTICATION
                        )

                        onLocationPermissionDenied?.()
                    } else if (
                        Platform.OS === 'android'
                            ? statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
                            : statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                                  RESULTS.BLOCKED ||
                              statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] ===
                                  RESULTS.BLOCKED
                    ) {
                        AppLog.log(
                            () => 'Location permission result blocked',
                            TAG.AUTHENTICATION
                        )

                        onLocationPermissionDenied?.()
                    } else if (
                        Platform.OS === 'android'
                            ? statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
                            : statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                                  RESULTS.UNAVAILABLE ||
                              statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] ===
                                  RESULTS.UNAVAILABLE
                    ) {
                        AppLog.log(
                            () => 'Location permission result denied',
                            TAG.AUTHENTICATION
                        )

                        onGPSNotAvailable?.()
                    }
                })
                .catch((error) => {
                    AppLog.log(
                        () =>
                            'Location permission error : ' +
                            JSON.stringify(error),
                        TAG.AUTHENTICATION
                    )
                    SimpleToast.show('Location permission error : ' + error)

                    //onLocationPermissionDenied?.()
                })
        },
        [
            onNotificationPermissionGranted,
            getUserLocation,
            onLocationPermissionDenied,
            onGPSNotAvailable,
        ]
    )

    return { askPermission, getUserLocation }
}
