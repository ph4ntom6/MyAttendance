import { NavigationContainer } from '@react-navigation/native';
import { FONT_SIZE, SPACE, STRINGS } from 'config';
import { usePreferredTheme } from 'hooks';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { SignInResponse } from 'models/api_responses/SignInApiResponseModel';
import React, { useCallback, useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Image,
  Linking,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import AuthStorage from 'repo/auth/AuthStorage';
import { AuthRoutes } from 'routes';
import { HomeRoutes } from 'routes/HomeRoutes';
import { setUser } from 'stores/authSlice';
import { RootState } from 'stores/store';
import { AppLabel, TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel';
import Screen from 'ui/components/atoms/Screen';
import { AppLog, TAG } from 'utils/Util';
// import { PushNotification } from 'react-native-push-notification'
import useNotification, { toNotificationData } from 'hooks/useNotification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { useAuthApis } from 'repo/auth/AuthApis';

interface Props {}

export const SplashView = React.memo<Props>(() => {
  AppLog.log(() => 'Rendering SplashView...');
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);
  const { request: checkVersionRequest } = useAuthApis().checkAppVersion;

  const restoreUser = async () => {
    const _user: SignInResponse | undefined = await AuthStorage.getUser();

    if (_user?.user) {
      dispatch(setUser(_user));
    }
  };

  function showForcedUpdateDialog() {
    Alert.alert(
      'Update available',
      'It looks like you are using an older version of our app. Please update to continue.',
      [
        {
          text: 'Update',
          onPress: () => {
            BackHandler.exitApp();
            Linking.openURL(
              Platform.OS === 'ios'
                ? 'https://apps.apple.com/us/app/ittendance%20Attendance%20tracker/568391958'
                : 'https://play.google.com/store/apps/details?id=com.cygnismedia.ittendance',
            );
          },
        },
      ],
    );
  }

  const { handleNotification } = useNotification();

  async function initializeApp() {
    if (!isReady) {
      setTimeout(() => {
        restoreUser().then(() => {
          AppLog.log(() => 'Logging in...', TAG.AUTHENTICATION);
          setIsReady(true);
        });
      }, 1000);
    }
  }

  const notificationOpenedHandler = useCallback(
    (data: any) => {
      const { additionalData } = data.notification;
      handleNotification(toNotificationData(additionalData));
    },
    [handleNotification],
  );

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (!enabled) {
      console.log('Push notification permission denied');
      return null;
    }
    // 2. Register device for remote messages FIRST
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    }

    // 3. Now safe to get the token
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  }

  useEffect(() => {
    requestUserPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (Platform.OS === 'ios') {
        PushNotificationIOS.addNotificationRequest({
          id: remoteMessage?.messageId?.toString() ?? '',
          title: remoteMessage?.notification?.title,
          subtitle: remoteMessage?.notification?.body,
        });
      } else {
        // PushNotification.localNotification({
        //     id: remoteMessage?.messageId?.toString() ?? '',
        //     title: remoteMessage?.notification?.title,
        //     subtitle: remoteMessage?.notification?.body,
        //     playSound: true,
        // })
      }
    });

    return unsubscribe;
  }, [notificationOpenedHandler]);

  useEffect(() => {
    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme = usePreferredTheme();

  if (!isReady) {
    return (
      <Screen style={styles.container} shouldAddBottomInset={false}>
        <View style={[styles.container]}>
          <View style={styles.logoContainer}>
            <AppLabel
              text={STRINGS.appTitle}
              style={styles.label}
              textType={TEXT_TYPE.SEMI_BOLD}
            />
          </View>
          <ActivityIndicator
            style={[styles.loaderContainer]}
            size="large"
            color={theme.themedColors.interface['600']}
          />
        </View>
      </Screen>
    );
  }

  return (
    <NavigationContainer>
      {AppLog.log(
        () => 'User exists: ' + (user !== undefined),
        TAG.AUTHENTICATION,
      )}
      {AppLog.log(() => 'user: ' + JSON.stringify(user), TAG.AUTHENTICATION)}
      {user !== undefined ? (
        <HomeRoutes initialRouteName="Home" />
      ) : (
        <AuthRoutes initialRouteName={'Login'} />
      )}
    </NavigationContainer>
    // </AuthContext.Provider>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  label: {
    fontSize: FONT_SIZE._2xl,
    marginTop: SPACE.xs,
    textTransform: 'lowercase',
  },
  loaderContainer: {
    padding: SPACE.md,
    position: 'absolute',
    bottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  imgLogo: { marginTop: 100, width: 160, height: 160 },
});
