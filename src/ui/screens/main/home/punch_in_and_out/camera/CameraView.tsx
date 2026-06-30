import { COLORS, SPACE } from 'config';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Screen from 'ui/components/atoms/Screen';
import {
  Camera,
  PhotoFile,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from 'routes/HomeStack';
import { useNavigation } from '@react-navigation/native';
import SimpleToast from 'react-native-simple-toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Sound from 'react-native-sound';

type Props = {
  cameraCaptureCallBack?: (photo: PhotoFile | undefined) => void;
  shouldShowProgressBar?: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

type HomeNavigationProp = StackNavigationProp<HomeStackParamList, 'Camera'>;

export const CameraView: FC<Props> = ({
  cameraCaptureCallBack,
  shouldShowProgressBar = false,
  setIsLoading,
}) => {
  const navigation = useNavigation<HomeNavigationProp>();

  // ✅ v5 hooks — replaces manual permission + getAvailableCameraDevices
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');

  const cameraRef = useRef<Camera>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const safeAreaInset = useSafeAreaInsets();

  const shutter = useRef<Sound | undefined>();
  const loadShutterSound = useCallback(
    () =>
      (shutter.current = new Sound(
        'camera_shutter.mp3',
        Sound.MAIN_BUNDLE,
        _ => {},
      )),
    [],
  );

  useEffect(() => {
    Platform.OS === 'android' && loadShutterSound();
  }, [loadShutterSound]);

  useEffect(() => {
    if (!shouldShowProgressBar) {
      setIsCameraActive(true);
    }
  }, [shouldShowProgressBar]);

  // ✅ v5 permission request
  useEffect(() => {
    const askPermission = async () => {
      const granted = await requestPermission();
      if (!granted) {
        SimpleToast.show('Camera permission is required');
        navigation.goBack();
      }
    };
    askPermission();
  }, [requestPermission, navigation]);

  const handleCapture = useCallback(async () => {
    setIsLoading(true);
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
            });
      Platform.OS === 'android' && shutter?.current?.play();
      setIsCameraActive(false);
      cameraCaptureCallBack?.(data);
    } catch (ex: any) {
      setIsLoading(false);
      setIsCameraActive(true);
    }
  }, [cameraCaptureCallBack, setIsLoading]);

  // ✅ v5 condition — hasPermission is boolean now
  if (!hasPermission || device == null) {
    return null;
  }

  return (
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
            bottom: safeAreaInset.bottom > 0 ? safeAreaInset.bottom : SPACE.xl,
          },
        ]}
      >
        {shouldShowProgressBar ? (
          <ActivityIndicator
            testID="initial-loader"
            size="large"
            color={COLORS.white}
            style={styles.initialPb}
          />
        ) : (
          <Pressable onPress={handleCapture}>
            <Image source={require('assets/images/icon_camera.png')} />
          </Pressable>
        )}
      </View>
    </Screen>
  );
};

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
});
