import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { usePreventDoubleTap } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { SignInApiRequestModel } from 'models/api_requests/SignInApiRequestModel';
import React, { FC, useCallback, useRef, useState } from 'react';
import { useAuthApis } from 'repo/auth/AuthApis';
import { AuthStackParamList } from 'routes';
import { setUser } from 'stores/authSlice';
import CustomAlertWithTitleAndMessage from 'ui/components/organisms/app_popup/CustomAlertWithTitleAndMessage';
import { LoginView } from 'ui/screens/auth/login/LoginView';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import EIntBoolean from 'models/enums/EIntBoolean';
import EScreen from 'models/enums/EScreen';

type LoginNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

type Props = {};

const LoginController: FC<Props> = () => {
  const requestModel = useRef<SignInApiRequestModel>();

  const [shouldShowErrorDialog, setShouldShowErrorDialog] = useState(false);

  const navigation = useNavigation<LoginNavigationProp>();

  // const { request: signInRequest, loading, error } = useAuthApis().signIn
  const dispatch = useAppDispatch();

  const handleSignIn = usePreventDoubleTap(async () => {
    // if (requestModel.current === undefined) {
    //     return
    // }
    // const token = await messaging().getToken()
    // requestModel!.current!.device_token = token
    // const { hasError, dataBody, errorBody } = await signInRequest(
    //     requestModel.current
    // )
    // if (hasError || dataBody === undefined) {
    //     setShouldShowErrorDialog(true)
    //     crashlytics().recordError(
    //         new Error('An error was caught', errorBody)
    //     )
    //     return
    // } else {
    //     if (dataBody.data?.user?.status === EIntBoolean.FALSE) {
    //         navigation.navigate('AccountVerification', {
    //             email: dataBody?.data?.user?.email,
    //             user: dataBody?.data,
    //             isFrom: EScreen.LOGIN,
    //         })
    //     } else {
    //         dispatch(setUser(dataBody.data))
    //     }
    //     await Promise.all([
    //         crashlytics().setUserId(`${dataBody.data.user.id}`),
    //         crashlytics().setAttributes({
    //             role: 'admin',
    //             followers: '13',
    //             email: dataBody.data.user.email,
    //             username: dataBody.data.user.full_name,
    //         }),
    //     ])
    // }
    dispatch(
      setUser({
        data: {
          id: -1,
          access_token: 'v387y8923nbn543fdh24-b565453',
          grant_type: 'password',
          client_id: '2',
          client_secret: '5Ng2KkE0LQkSFE8kCvgROZAKStNAsDjh2elNpcC8',
          scope: '',
          device_type: Platform.OS,
        },
        message: 'User Login Successfully',
      }),
    );
  });

  const openSignUpScreen = useCallback(() => {
    navigation.navigate('CreateTeam');
  }, [navigation]);

  return (
    <>
      <LoginView
        signIn={values => {
          // requestModel.current = {
          //     ...values,
          //     grant_type: 'password',
          //     client_id: '2',
          //     client_secret:
          //         '5Ng2KkE0LQkSFE8kCvgROZAKStNAsDjh2elNpcC8',
          //     scope: '',
          //     device_type: Platform.OS,
          // }
          handleSignIn();
        }}
        shouldShowProgressBar={false}
        openSignUpScreen={openSignUpScreen}
      />
      <CustomAlertWithTitleAndMessage
        title={'Unable to Sign In'}
        // message={error ?? 'N/A'}
        shouldShow={shouldShowErrorDialog}
        hideDialogue={() => setShouldShowErrorDialog(false)}
      />
    </>
  );
};

export default LoginController;
