import { SPACE } from 'config';
import {
  Attendance,
  AttendenceItem,
} from 'models/api_responses/AttendanceApiResponseModel';
import ELeaveType from 'models/enums/ELeaveType';
import React, { FC, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Screen from 'ui/components/atoms/Screen';
import DateFields from 'ui/components/molecules/date_field/DateFields';
import FlexItems from 'ui/components/molecules/flex_items/FlexItems';
import { FlatListWithPb } from 'ui/components/organisms/flat_list/FlatListWithPb';
import ItemAttendance from 'ui/components/organisms/item_attendance/ItemAttendance';

type Props = {
  openAttendanceDetail: (item: AttendenceItem) => void;
  attendanceData: Attendance | undefined;
  shouldShowProgressBar: boolean;
  setDateFields: (startDate: string, endDate: string) => void;
  retryCallBack?: () => void;
  error?: string;
};
export const AttendanceView: FC<Props> = ({
  openAttendanceDetail,
  attendanceData,
  shouldShowProgressBar,
  setDateFields,
  retryCallBack,
  error,
}) => {
  const lowerTextArray = ['Avg. In Time', 'Avg. Out Time', 'Avg. Work Hours'];
  const renderItem = useCallback(
    ({ item, index }: { item: AttendenceItem; index: number }) => {
      return (
        <Pressable
          onPress={() =>
            item.type === ELeaveType.ATTENDANCE
              ? openAttendanceDetail(item)
              : {}
          }
        >
          <ItemAttendance
            item={item}
            index={index}
            lastIndex={attendanceData?.records?.length! - 1}
          />
        </Pressable>
      );
    },
    [openAttendanceDetail, attendanceData],
  );

  return (
    <Screen style={styles.container} requiresSafeArea={false}>
      <DateFields setDateFields={setDateFields} />
      <FlexItems
        lowerTextArray={lowerTextArray}
        attendanceData={attendanceData}
      />
      <FlatListWithPb
        style={styles.listContainer}
        data={attendanceData?.records!}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: SPACE.md,
        }}
        retryCallback={retryCallBack}
        error={error}
        shouldShowProgressBar={shouldShowProgressBar}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingHorizontal: SPACE.lg,
  },
  container: {
    flex: 1,
  },
});
