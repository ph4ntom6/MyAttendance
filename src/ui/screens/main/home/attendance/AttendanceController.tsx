import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, EVENT, STRINGS } from 'config';
import { usePreventDoubleTap } from 'hooks';
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useGeneralApis } from 'repo/general/GeneralApis';
import { HomeBottomBarParamList } from 'routes/HomeBottomBar';
import { HomeStackParamList } from 'routes/HomeStack';
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle';
import { AttendanceView } from './AttendanceView';
import { useAppSelector } from 'hooks/redux';
import { RootState } from 'stores/store';
import {
  Attendance,
  AttendenceItem,
} from 'models/api_responses/AttendanceApiResponseModel';
import SimpleToast from 'react-native-simple-toast';
import { AttendanceLeaveApiRequestModel } from 'models/api_requests/AttendanceLeaveApiRequestModel';
import EventBus from 'react-native-event-bus';
import dayjs from 'dayjs';
import attendanceData from './AttendanceData';

let isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
let customParseFormat = require('dayjs/plugin/customParseFormat');

type Props = {};

export type HomeBottomBarNavigation = StackNavigationProp<
  HomeBottomBarParamList,
  'Requests'
>;
export type HomeNavigation = StackNavigationProp<
  HomeStackParamList,
  'AttendanceDetail'
>;
const AttendanceController: FC<Props> = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const requestModel = useRef<AttendanceLeaveApiRequestModel>({
    user_id: user?.id!,
    start_date: '',
    end_date: '',
  });
  const {
    request: getAttendanceDataRequest,
    error,
    loading,
  } = useGeneralApis().getAttendanceList;
  const navigation = useNavigation<HomeBottomBarNavigation>();
  const homeNavigation = useNavigation<HomeNavigation>();
  const [attendanceList, setAttendanceList] = useState<
    Attendance | undefined
  >();

  const getAttendanceData = usePreventDoubleTap(
    async (clearData: boolean = false) => {
      if (clearData) {
        setAttendanceList(undefined);
      }

      const { hasError, dataBody, errorBody } = await getAttendanceDataRequest(
        requestModel.current,
      );
      if (hasError && dataBody === undefined) {
        SimpleToast.show(errorBody ?? STRINGS.common.some_thing_bad_happened);
      } else {
        dayjs.extend(customParseFormat);
        dayjs.extend(isSameOrAfter);
        const createdAt = dayjs(user?.created_at, 'MMM D, YYYY');
        const dataFromCreationDate = dataBody.data.records.filter(_item => {
          if (!_item?.date_formatted) {
            return true;
          }
          const splittedDate = _item.date_formatted.split(', ');
          splittedDate.splice(0, 1);
          const recordDate = dayjs(splittedDate.join(', '), 'MMM D, YYYY');
          if (!recordDate.isValid() || !createdAt.isValid()) {
            return true;
          }
          return recordDate.isSameOrAfter(createdAt);
        });
        dataBody.data.records = dataFromCreationDate;
        console.log('DATA===>', dataBody.data);
        setAttendanceList(dataBody.data);
      }
    },
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: COLORS.theme?.interface['50'],
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitle: () => <HeaderTitle text={STRINGS.home.attendance.title} />,
    });
  }, [navigation]);

  const fetchAttendance = useCallback(() => {
    getAttendanceData();
  }, [getAttendanceData]);

  useEffect(() => {
    EventBus.getInstance().addListener(EVENT.FETCH_ATTENDANCE, fetchAttendance);

    return () => EventBus.getInstance().removeListener(fetchAttendance);
  }, [fetchAttendance]);

  useEffect(() => {
    getAttendanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAttendanceDetail = (item: AttendenceItem) => {
    homeNavigation.navigate('AttendanceDetail', {
      item: item,
    });
  };

  const onRefresh = useCallback(() => {
    getAttendanceData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatedDates = useCallback(
    (startDate, endDate) => {
      requestModel.current.start_date = startDate;
      requestModel.current.end_date = endDate;

      onRefresh();
    },
    [onRefresh],
  );

  return (
    <AttendanceView
      openAttendanceDetail={openAttendanceDetail}
      attendanceData={attendanceData}
      shouldShowProgressBar={loading}
      setDateFields={updatedDates}
      retryCallBack={fetchAttendance}
      error={error}
    />
  );
};

export default AttendanceController;
