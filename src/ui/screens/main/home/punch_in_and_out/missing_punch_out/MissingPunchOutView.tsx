import { COLORS, FONT_SIZE, SPACE, STRINGS } from 'config'
import React, { FC, useState } from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import { AppLabel, TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
import Screen from 'ui/components/atoms/Screen'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { formatDate } from 'utils/Util'
import { AppButton } from 'ui/components/molecules/app_button/AppButton'
import dayjs from 'dayjs'
import SimpleToast from 'react-native-simple-toast'
let isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)
type Props = {
    onPress: (selectedDate: Date | string) => void
    previousDate: string
    shouldShowProgressBar?: boolean
}

export const MissingPunchOutView: FC<Props> = ({
    onPress,
    previousDate,
    shouldShowProgressBar,
}) => {
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
    const [currentMonthDate, setCurrentMonthDate] = useState<Date | string>('')

    const safeAreaInset = useSafeAreaInsets()

    const hideDatePicker = () => {
        setShowDatePicker(false)
    }

    let _PreviousDate = new Date(
        formatDate(
            String(dayjs(previousDate).add(dayjs().utcOffset(), 'minutes')),
            'YYYY-MM-DDTHH:mm:ssZ'
        )
    )

    const handleConfirm = (date: Date) => {
        let isSameDay = dayjs(date).isSame(
            formatDate(String(dayjs(_PreviousDate)), 'YYYY-MM-DDTHH:mm:ssZ'),
            'day'
        )

        let isBeforePunchIn = dayjs(date).isSameOrBefore(
            formatDate(String(dayjs(_PreviousDate)), 'YYYY-MM-DDTHH:mm:ssZ'),
            'minute'
        )

        if (!isSameDay) {
            hideDatePicker()

            //to show message on ios
            setTimeout(() => {
                SimpleToast.show(STRINGS.puchInAndOut.same_day_desc)
            }, 50)

            return
        }

        if (isBeforePunchIn) {
            hideDatePicker()

            //to show message on ios
            setTimeout(() => {
                SimpleToast.show(
                    STRINGS.puchInAndOut.punch_out_greater_than_punch_desc
                )
            }, 50)

            return
        }
        hideDatePicker()
        setCurrentMonthDate(date)
    }

    return (
        <>
            <Screen style={styles.container} requiresExplicitPadding={false}>
                <View style={styles.subContainer}>
                    <AppLabel text={'It seems like you did not punch out on'} />

                    <AppLabel
                        text={formatDate(
                            previousDate,
                            `dddd, MMM DD, YYYY`
                        ).toString()}
                        style={{ color: COLORS.theme?.secondaryColor }}
                    />

                    <AppLabel
                        text={`At what time you left on ${formatDate(
                            previousDate,
                            `dddd`
                        ).toString()}?`}
                        textType={TEXT_TYPE.SEMI_BOLD}
                        style={styles.punchOutTimeLabel}
                    />

                    <Pressable
                        onPress={() => {
                            setShowDatePicker(true)
                        }}
                        style={[styles.dateContainer]}
                    >
                        <AppLabel
                            style={[
                                styles.dateText,
                                {
                                    color:
                                        currentMonthDate === ''
                                            ? COLORS.theme?.interface[300]
                                            : COLORS.black,
                                },
                            ]}
                            text={
                                currentMonthDate === ''
                                    ? 'Select your punch out time'
                                    : formatDate(
                                          String(currentMonthDate),
                                          'MMM DD, YY hh:mm a'
                                      )
                            }
                        />
                        <Image
                            source={require('assets/images/punch_in_out.png')}
                            style={styles.calender}
                        />
                    </Pressable>
                </View>
                <AppButton
                    text={'Submit'}
                    textType={TEXT_TYPE.SEMI_BOLD}
                    textStyle={{ fontSize: FONT_SIZE.lg }}
                    onPress={() => {
                        if (currentMonthDate) {
                            onPress?.(currentMonthDate)
                        } else {
                            SimpleToast.show('Please select punch out time')
                        }
                    }}
                    shouldShowProgressBar={shouldShowProgressBar}
                />
            </Screen>

            {showDatePicker && (
                <DateTimePickerModal
                    isVisible={true}
                    mode="datetime"
                    date={_PreviousDate}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACE.lg,
        paddingVertical: SPACE.lg,
    },
    subContainer: {
        flex: 1,
    },

    punchOutTimeLabel: {
        marginTop: SPACE.lg,
        fontSize: FONT_SIZE._2xs,
        textTransform: 'uppercase',
    },

    calender: {
        tintColor: COLORS.theme?.primaryColor,
        alignSelf: 'flex-end',
        width: 20,
        height: 20,
        marginRight: SPACE._2md,
    },
    dateContainer: {
        backgroundColor: COLORS.theme?.interface[50],
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 4,
        paddingVertical: SPACE.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.theme?.interface['200'],
    },
    dateText: {
        fontSize: FONT_SIZE.lg,
        alignSelf: 'center',
    },
})
