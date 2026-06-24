import { COLORS, SPACE } from 'config'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Image,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'
import Screen from 'ui/components/atoms/Screen'
import {
    Camera,
    CameraDevice,
    CameraPermissionRequestResult,
    PhotoFile,
} from 'react-native-vision-camera'
import { StackNavigationProp } from '@react-navigation/stack'
import { HomeStackParamList } from 'routes/HomeStack'
import { useNavigation } from '@react-navigation/native'
import SimpleToast from 'react-native-simple-toast'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Sound from 'react-native-sound'

//import { scanFaces, Face } from 'vision-camera-face-detector'
//import { runOnJS } from 'react-native-reanimated'
type Props = {
    cameraCaptureCallBack?: (photo: PhotoFile | undefined) => void
    shouldShowProgressBar?: boolean
    setIsLoading: (isLoading: boolean) => void
}

type HomeNavigationProp = StackNavigationProp<HomeStackParamList, 'Camera'>

export const CameraView: FC<Props> = ({
    cameraCaptureCallBack,
    shouldShowProgressBar = false,
    setIsLoading,
}) => {
    const navigation = useNavigation<HomeNavigationProp>()
    const [hasPermission, setHasPermission] = useState<
        CameraPermissionRequestResult | undefined
    >(undefined)
    const [device, setDevice] = useState<CameraDevice | undefined>()
    const cameraRef = useRef<Camera>(null)
    let devices = useRef<CameraDevice[] | undefined>()
    const [isCameraActive, setIsCameraActive] = useState(true)
    const safeAreaInset = useSafeAreaInsets()

    const shutter = useRef<Sound | undefined>()
    let loadShutterSound = useCallback(
        () =>
            (shutter.current = new Sound(
                'camera_shutter.mp3',
                Sound.MAIN_BUNDLE,
                (_) => {}
            )),
        []
    )

    useEffect(() => {
        Platform.OS === 'android' && loadShutterSound()
    }, [loadShutterSound])

    useEffect(() => {
        if (!shouldShowProgressBar) {
            setIsCameraActive(true)
        }
    }, [shouldShowProgressBar])

    const askPermission = async () => {
        const status: CameraPermissionRequestResult =
            await Camera.requestCameraPermission()
        if (status === 'denied') {
            SimpleToast.show('Camera permission is required')
            navigation.goBack()
        }
        setHasPermission(status)
    }

    useEffect(() => {
        askPermission()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //Handles Taking photo
    const handleCapture = useCallback(async () => {
        setIsLoading(true)

        try {
            const data: PhotoFile | undefined =
                Platform.OS === 'android'
                    ? await cameraRef?.current?.takeSnapshot({
                          skipMetadata: true,
                      })
                    : await cameraRef?.current?.takePhoto({
                          enableAutoStabilization: true,
                          skipMetadata: true,
                          qualityPrioritization: 'speed',
                      })
            Platform.OS === 'android' && shutter?.current?.play()
            setIsCameraActive(false)
            cameraCaptureCallBack?.(data)
        } catch (ex: any) {
            setIsLoading(false)
            setIsCameraActive(true)
        }
    }, [cameraCaptureCallBack, setIsLoading])

    const getDevice = useCallback(async () => {
        devices.current = await Camera.getAvailableCameraDevices()

        setDevice(
            devices?.current.find(
                (item: CameraDevice) => item?.position === 'front'
            )
        )
    }, [])

    useEffect(() => {
        getDevice()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return device != null && hasPermission === 'authorized' ? (
        <Screen style={styles.container} requiresSafeArea={false}>
            <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isCameraActive}
                photo={true}
            />

            <View
                style={[
                    styles.imageContainer,
                    {
                        bottom:
                            safeAreaInset.bottom > 0
                                ? safeAreaInset.bottom
                                : SPACE.xl,
                    },
                ]}
            >
                {shouldShowProgressBar ? (
                    <ActivityIndicator
                        testID="initial-loader"
                        size="large"
                        color={COLORS.white}
                        style={[styles.initialPb]}
                    />
                ) : (
                    <Pressable onPress={handleCapture}>
                        <Image
                            source={require('assets/images/icon_camera.png')}
                        />
                    </Pressable>
                )}
            </View>
        </Screen>
    ) : null
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACE.lg,
        paddingVertical: SPACE.lg,
    },
    imageContainer: {
        backgroundColor: COLORS.theme?.primaryColor,
        borderRadius: 40,
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: SPACE.xl,
        position: 'absolute',
        alignSelf: 'center',
    },
    initialPb: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
})
