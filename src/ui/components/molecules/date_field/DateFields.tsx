import { COLORS, EVENT, FONT_SIZE, SPACE } from 'config'
import React, {
    FC,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import { AppLabel } from 'ui/components/atoms/app_label/AppLabel'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { formatDate } from 'utils/Util'
import { AttendanceLeaveApiRequestModel } from 'models/api_requests/AttendanceLeaveApiRequestModel'
import EventBus from 'react-native-event-bus'
import useEffectWithSkipFirstTime from 'hooks/useEffectWithSkipFirstTime'

type Props = {
    setDateFields: (startDate: string, endDate: string) => void
    isOpenFromRequestView?: boolean
}

const DateFields: FC<Props> = ({
    setDateFields,
    isOpenFromRequestView = false,
}) => {
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
    const currentDate = useMemo(() => new Date(), [])
    let d = new Date()
    d.setMonth(d.getMonth() - 1)
    const [previousMonthDate, setPreviousMonthDate] = useState<Date>(d)
    const [currentMonthDate, setCurrentMonthDate] = useState<Date>(currentDate)
    const currentDateRef = useRef<string>('Right')
    const hideDatePicker = () => {
        setShowDatePicker(false)
    }

    const returnCallback = useCallback(
        (date?: string) => {
            isOpenFromRequestView
                ? setDateFields(
                      formatDate(String(previousMonthDate), 'DD-MM-YYYY'),
                      formatDate(
                          String(date ? new Date(date) : currentMonthDate),
                          'DD-MM-YYYY'
                      )
                  )
                : setDateFields(
                      formatDate(String(previousMonthDate), 'MMM DD, YY'),
                      formatDate(String(currentMonthDate), 'MMM DD, YY')
                  )
        },
        [
            isOpenFromRequestView,
            setDateFields,
            previousMonthDate,
            currentMonthDate,
        ]
    )

    useEffectWithSkipFirstTime(() => {}, [previousMonthDate, currentMonthDate])

    useEffect(() => {
        returnCallback()
    }, [currentDate, previousMonthDate, returnCallback])

    const handleConfirm = useCallback((date: Date) => {
        hideDatePicker()
        if (currentDateRef.current === 'Left') {
            setPreviousMonthDate(date)
        } else {
            setCurrentMonthDate(date)
        }
    }, [])
    const fetchLeaveRequests = useCallback(
        (payload: AttendanceLeaveApiRequestModel) => {
            setCurrentMonthDate(new Date(payload.end_date))
            returnCallback(payload.end_date)
        },
        [returnCallback]
    )
    useEffect(() => {
        EventBus.getInstance().addListener(
            EVENT.FETCH_REQUEST_AGAIN,
            fetchLeaveRequests
        )

        return () => EventBus.getInstance().removeListener(fetchLeaveRequests)
    }, [fetchLeaveRequests])

    const safeAreaInset = useSafeAreaInsets()
    return (
        <>
            <View style={styles.flexContainer}>
                <Pressable
                    onPress={() => {
                        currentDateRef.current = 'Left'
                        setShowDatePicker(true)
                    }}
                    style={styles.dateContainer}
                >
                    {/* <Image
                        source={require('assets/images/ic_calendar.png')}
                        style={styles.dateIcon}
                    /> */}
                    <AppLabel
                        style={styles.dateText}
                        text={formatDate(
                            String(previousMonthDate),
                            'MMM DD, YY'
                        )}
                    />
                </Pressable>
                <Pressable
                    onPress={() => {
                        currentDateRef.current = 'Right'
                        setShowDatePicker(true)
                    }}
                    style={[
                        styles.dateContainer,
                        { marginHorizontal: SPACE.md },
                    ]}
                >
                    {/* <Image
                        source={require('assets/images/ic_calendar.png')}
                        style={styles.dateIcon}
                    /> */}
                    <AppLabel
                        style={styles.dateText}
                        text={formatDate(
                            String(currentMonthDate),
                            'MMM DD, YY'
                        )}
                    />
                </Pressable>
                <Pressable
                    onPress={() => {
                        returnCallback()
                    }}
                >
                    {/* <Image
                        source={require('assets/images/icon_refresh.png')}
                        style={{
                            width: 18,
                            height: 18,
                        }}
                    /> */}
                </Pressable>
            </View>

            {showDatePicker && (
                <DateTimePickerModal
                    isVisible={true}
                    mode="date"
                    date={
                        currentDateRef.current === 'Left'
                            ? previousMonthDate
                            : currentMonthDate
                    }
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    maximumDate={
                        currentDateRef.current === 'Right' &&
                        isOpenFromRequestView
                            ? new Date(
                                  new Date().setFullYear(
                                      new Date().getFullYear() + 1
                                  )
                              )
                            : new Date()
                    }
                    modalStyleIOS={{
                        marginBottom:
                            safeAreaInset.bottom > 0
                                ? safeAreaInset.bottom
                                : SPACE.lg,
                    }}
                />
            )}
        </>
    )
}
export default DateFields
const styles = StyleSheet.create({
    flexContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: SPACE.lg,
        alignItems: 'center',
        backgroundColor: COLORS.theme?.interface[50],
        paddingBottom: SPACE.sm,
        paddingTop: SPACE.xs,
    },
    dateIcon: {
        width: 18,
        height: 18,
        alignSelf: 'center',
    },
    dateContainer: {
        backgroundColor: COLORS.theme?.interface[200],
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: SPACE.sm,
        paddingVertical: SPACE._2xs,
        flex: 1,
        borderRadius: 4,
    },
    dateText: {
        fontSize: FONT_SIZE._2xs,
        alignSelf: 'center',
        marginLeft: SPACE.sm,
    },
})
