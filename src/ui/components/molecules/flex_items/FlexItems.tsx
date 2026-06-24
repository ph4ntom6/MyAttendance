import { COLORS, FONTS, FONT_SIZE, SPACE } from 'config'
import { Attendance } from 'models/api_responses/AttendanceApiResponseModel'
import { LeaveRequest } from 'models/api_responses/LeaveRequestResponseModel'
import React, { FC } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { AppLabel } from 'ui/components/atoms/app_label/AppLabel'

type Props = {
    lowerTextArray: string[]
    requestData?: LeaveRequest | undefined
    attendanceData?: Attendance | undefined
    isOpenFromRequestView?: boolean
    columnContainerStyle?: StyleProp<ViewStyle>
    rowContainerStyle?: StyleProp<ViewStyle>
}
const FlexItems: FC<Props> = ({
    lowerTextArray,
    attendanceData,
    requestData,
    isOpenFromRequestView = false,
    columnContainerStyle,
    rowContainerStyle,
}) => {
    return (
        <View style={[styles.columnContainer, columnContainerStyle]}>
            <View style={[styles.rowContainer, rowContainerStyle]}>
                <View style={{ alignItems: 'center' }}>
                    <AppLabel
                        style={styles.upperTexts}
                        text={
                            isOpenFromRequestView
                                ? `${requestData?.total ?? '--'}`
                                : attendanceData?.avgInTime ?? '--:--'
                        }
                    />
                    <AppLabel
                        style={styles.lowerTexts}
                        text={lowerTextArray[0]}
                    />
                </View>
                <View style={{ alignItems: 'center' }}>
                    <AppLabel
                        style={styles.upperTexts}
                        text={
                            isOpenFromRequestView
                                ? `${requestData?.approved ?? '--'}`
                                : attendanceData?.avgOutTime ?? '--:--'
                        }
                    />
                    <AppLabel
                        style={styles.lowerTexts}
                        text={lowerTextArray[1]}
                    />
                </View>
                <View style={{ alignItems: 'center' }}>
                    <AppLabel
                        style={styles.upperTexts}
                        text={
                            isOpenFromRequestView
                                ? `${requestData?.rejected ?? '--'}`
                                : attendanceData?.avgWorkHours ?? '-'
                        }
                    />
                    <AppLabel
                        style={styles.lowerTexts}
                        text={lowerTextArray[2]}
                    />
                </View>
            </View>
        </View>
    )
}
export default FlexItems
const styles = StyleSheet.create({
    columnContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: SPACE.md,
        paddingVertical: SPACE.sm,
        backgroundColor: COLORS.theme?.interface[100],
        borderColor: COLORS.theme?.interface[200],
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    rowContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: SPACE.lg,
    },
    upperTexts: {
        color: COLORS.theme?.primaryColor,
        fontSize: FONT_SIZE.xl,
        fontFamily: FONTS.thin,
    },
    lowerTexts: {
        color: COLORS.theme?.interface[300],
        fontSize: FONT_SIZE._3xs,
    },
})
