import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import HeaderLeftTextWithIcon from 'ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon';
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle';
import { CameraView } from './CameraView';
import LeftArrow from 'assets/images/left.svg';
import { HomeStackParamList } from 'routes/HomeStack';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PunchInAndOutRequestModel } from 'models/api_requests/PunchInAndOutRequestModel';
import usePreventDoubleTap from 'hooks/usePreventDoubleTap';
import { useGeneralApis } from 'repo/general/GeneralApis';
import { useAppSelector } from 'hooks/redux';
import { RootState } from 'stores/store';
import { PhotoFile } from 'react-native-vision-camera';
import { Alert, Platform } from 'react-native';
import { EVENT, STRINGS } from 'config';
import AppPopUpWithActionsButton from 'ui/components/organisms/app_popup/AppPopUpWithActionsButton';
import { MissingPunchOutResponseModel } from 'models/api_responses/MissingPunchOutErrorResponseModel';
import usePermission from 'hooks/usePermission';
import {
  checkMultiple,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import { Location } from 'react-native-get-location';
import EAttendanceType from 'models/enums/EAttendanceType';
import EventBus from 'react-native-event-bus';
import { getDistance } from 'geolib';
import SimpleToast from 'react-native-simple-toast';
import analytics from '@react-native-firebase/analytics';
import moment from 'moment';

type Props = {};

type HomeNavigationProp = StackNavigationProp<HomeStackParamList, 'Camera'>;
type CameraNavigationProp = StackScreenProps<HomeStackParamList, 'Camera'>;

const CameraController: FC<Props> = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { params } = useRoute<CameraNavigationProp['route']>();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { request: punchInAndOutRequest } = useGeneralApis().punchInAndOut;

  const requestModel = useRef<PunchInAndOutRequestModel>({});

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [shouldShowErrorDialog, setShouldShowErrorDialog] = useState<{
    message?: string;
    shouldShow?: boolean;
  }>({ shouldShow: false });

  const [shouldLocationAlertDialog, setShouldLocationAlertDialog] =
    useState<boolean>(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          icon={() => <LeftArrow width={18} height={18} />}
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerTitle: () => (
        <HeaderTitle text={params.attendanceType} shouldTruncate={false} />
      ),
    });
  }, [navigation, params]);

  const onLocationDenied = useCallback(() => {
    setIsLoading(false);
    Alert.alert(
      'Alert',
      'Please enable your location permission in order to continue',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'OK', onPress: () => openSettings() },
      ],
    );
  }, []);

  const onGPSNotAvailable = useCallback(() => {
    setIsLoading(false);
    Alert.alert('Alert', 'Please enable your GPS', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => navigation.goBack(),
      },
      { text: 'OK', onPress: () => openSettings() },
    ]);
  }, [navigation]);

  const callPunchInPunchOutApi = usePreventDoubleTap(async () => {
    const { hasError, dataBody, statusCode, errorBody } =
      await punchInAndOutRequest({
        type:
          params?.attendanceType === EAttendanceType.PUNCH_IN
            ? 'punch_in'
            : 'punch_out',
        punch_in_id: '0',
        punch_time: moment().format('hh:mm'),
        punchin_via: 'mobile',
        missing_punch_out: 'false',
        user_id: user?.id,
        ...requestModel.current,
      });
    navigation.goBack();
    if (hasError || dataBody === undefined) {
      if (statusCode === 567) {
        setIsLoading(false);
        navigation.replace('MissingPunchOut', {
          response: (errorBody as any)?.data as MissingPunchOutResponseModel,
          latitude: requestModel?.current?.location_latitude,
          longitude: requestModel?.current?.location_longitude,
          photoFile: requestModel?.current?.photoFile,
        });
      } else if (statusCode === 568) {
        setIsLoading(false);
        setShouldShowErrorDialog({
          message: (errorBody as any).error?.messages,
          shouldShow: true,
        });
      } else if (statusCode === 569 || statusCode === 566) {
        setIsLoading(false);
        setShouldShowErrorDialog({
          message: (errorBody as any).error?.messages,
          shouldShow: true,
        });
      } else {
        setIsLoading(false);
        SimpleToast.show(errorBody ?? STRINGS.common.some_thing_bad_happened);
      }
    } else {
      setIsLoading(false);
      //   EventBus.getInstance().fireEvent(EVENT.FETCH_ATTENDANCE);
      navigation.goBack();
    }
  });

  const preparePunchInPunchOut = useCallback(() => {
    const filteredLocation = user?.team?.locations?.filter(
      _item => _item?.status === 1,
    );

    for (let i = 0; i < (filteredLocation?.length ?? 0); i++) {
      let distance = getDistance(
        {
          latitude: requestModel?.current?.location_latitude ?? 0.0,
          longitude: requestModel?.current?.location_longitude ?? 0.0,
        },
        {
          latitude: filteredLocation![i]?.latitude ?? '0.0',
          longitude: filteredLocation![i]?.longitude ?? '0.0',
        },
      );
      const radiusInMeters = (filteredLocation![i]?.radius ?? 0.0) * 1000;

      if (
        (filteredLocation![i]?.radius ?? 0.0) <= 0 ||
        distance <= radiusInMeters
      ) {
        callPunchInPunchOutApi();
        return;
      }
    }
    setShouldLocationAlertDialog(true);
    return;
  }, [callPunchInPunchOutApi, user?.team?.locations]);

  const onLocationGranted = useCallback(
    (location?: Location) => {
      requestModel.current.location_latitude = location?.latitude;
      requestModel.current.location_longitude = location?.longitude;

      // eslint-disable-next-line @typescript-eslint/no-shadow
      setIsLoading(isLoading => {
        if (isLoading) {
          preparePunchInPunchOut();
        }
        return isLoading;
      });
    },
    [preparePunchInPunchOut],
  );

  const { askPermission, getUserLocation } = usePermission(
    onLocationGranted,
    onLocationDenied,
    onGPSNotAvailable,
  );

  const askingForPermission = useCallback(async () => {
    setTimeout(() => {
      askPermission();
    }, 500);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkLocPermAndGetLoc = useCallback(async () => {
    let checkPerm = await checkMultiple(
      Platform.OS === 'android'
        ? [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
        : [
            PERMISSIONS.IOS.LOCATION_ALWAYS,
            PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          ],
    );

    if (
      Platform.OS === 'android'
        ? checkPerm[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] ===
          RESULTS.GRANTED
        : checkPerm[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.GRANTED ||
          checkPerm[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED
    ) {
      getUserLocation();
    } else {
      askPermission();
    }
  }, [askPermission, getUserLocation]);

  const onImageCapture = useCallback(
    async (photo: PhotoFile | undefined) => {
      await analytics().logSelectContent({
        content_type: `${params?.attendanceType}`,
        item_id: `${user?.id}`,
      });
      requestModel.current.photoFile = photo;
      if (requestModel.current.location_latitude === undefined) {
        checkLocPermAndGetLoc();
      } else {
        preparePunchInPunchOut();
      }
    },
    [
      checkLocPermAndGetLoc,
      params?.attendanceType,
      preparePunchInPunchOut,
      user?.id,
    ],
  );

  const getOrganizationName = () => {
    const organization = user?.team?.locations.find(
      _item => _item?.status === 1,
    );
    return organization?.title ?? '';
  };

  useEffect(() => {
    askingForPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setBtnLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return (
    <>
      <CameraView
        cameraCaptureCallBack={onImageCapture}
        shouldShowProgressBar={isLoading}
        setIsLoading={setBtnLoading}
      />

      <AppPopUpWithActionsButton
        isVisible={shouldShowErrorDialog.shouldShow!}
        message={shouldShowErrorDialog.message}
        actions={[
          {
            title: 'OK',
            onPress: () => {
              setShouldShowErrorDialog({ shouldShow: false });
              navigation.goBack();
            },
          },
        ]}
      />

      <AppPopUpWithActionsButton
        isVisible={shouldLocationAlertDialog}
        title={STRINGS.puchInAndOut.location_alert}
        message={STRINGS.puchInAndOut.location_desc.replace(
          'placeHolderName',
          getOrganizationName(),
        )}
        actions={[
          {
            title: 'Cancel',
            onPress: () => {
              setShouldLocationAlertDialog(false);
              navigation.goBack();
            },
          },
          {
            title: 'Confirm',
            onPress: () => {
              setShouldLocationAlertDialog(false);
              callPunchInPunchOutApi();
            },
          },
        ]}
      />
    </>
  );
};

export default CameraController;
