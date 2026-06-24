import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppLog, TAG } from './utils/Util';
import useNotification from './hooks/useNotification';
import { PushNotificationContext } from './hooks/usePushNotificationContextToNavigate';
import { SplashView } from './ui/screens/auth/splash/SplashView';
import { Provider } from 'react-redux';
import { store } from './stores/store';
import messaging from '@react-native-firebase/messaging';

type Props = {};

const App: React.FC<Props> = () => {
  AppLog.log(() => 'Rendering App...');

  const { data: notificationUpdate } = useNotification();

  // Register background handler
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    AppLog.log(
      () =>
        'Message handled in the background!' + JSON.stringify(remoteMessage),
    );
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    AppLog.log(
      () =>
        'Notification caused app to open from background state:' +
        remoteMessage.notification,
      TAG.APP,
    );
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        AppLog.log(
          () =>
            'Notification caused app to open from quit state:' +
            remoteMessage.notification,
          TAG.APP,
        );
        // e.g. "Settings"
      }
    });

  return (
    <Provider store={store}>
      {/* <AppThemeProvider colorScheme={AppColorScheme.DARK}> */}
      <SafeAreaProvider>
        <PushNotificationContext.Provider value={notificationUpdate}>
          <SplashView />
        </PushNotificationContext.Provider>
        {/* <SplashView /> */}
      </SafeAreaProvider>
      {/* </AppThemeProvider> */}
    </Provider>
  );
};
export default App;
