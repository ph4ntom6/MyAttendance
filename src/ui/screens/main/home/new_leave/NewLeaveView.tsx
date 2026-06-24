import {
    View,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ScrollView,
    Image,
    Pressable,
} from 'react-native'
import React, { FC, RefObject, useCallback, useRef, useState } from 'react'
import { COLORS, FONT_SIZE, SPACE, STRINGS } from 'config'
import Screen from 'ui/components/atoms/Screen'
import AppForm from 'ui/components/molecules/app_form/AppForm'
import * as Yup from 'yup'
import AppFormField from 'ui/components/molecules/app_form/AppFormField'
import { FormikHandlers, FormikProps, FormikValues } from 'formik'
import { NewLeaveRequestModel } from 'models/api_requests/NewLeaveRequestModel'
import { AppFormDropDown } from 'ui/components/molecules/app_form/AppFormDropDown'
import { DropDownItem } from 'models/DropDownItem'
import { AppLabel, TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
import CheckboxWithText from 'ui/components/atoms/CheckboxWithText'
import EIntBoolean from 'models/enums/EIntBoolean'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { formatDate } from 'utils/Util'
import { useAppSelector } from 'hooks/redux'
import { RootState } from 'stores/store'

type props = {
    leaveTypeData: DropDownItem[] | undefined
    newLeave: (values: NewLeaveRequestModel) => void
    innerRef: RefObject<FormikProps<FormikValues> & FormikHandlers>
}

const initialValues = {
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: '',
    user_id: '',
    is_half_day: false,
}

const validationSchema = Yup.object().shape({
    leave_type: Yup.object().required(STRINGS.newLeave.leave_type_validation),
    start_date: Yup.string().required(STRINGS.newLeave.start_date_validation),
    end_date: Yup.string().required(STRINGS.newLeave.end_date_validation),
})
const NewLeaveView: FC<props> = ({ innerRef, newLeave, leaveTypeData }) => {
    const { user } = useAppSelector((state: RootState) => state.auth)
    const [isHalfDay, setIsHalfDay] = useState<boolean>(false)
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const currentDateRef = useRef<string>('Start')
    const dateFormat = (date: Date) => {
        if (date !== undefined) {
            return formatDate(String(date), 'DD MMM YYYY')
        }
    }
    const hideDatePicker = () => {
        setShowDatePicker(false)
    }
    const handleConfirm = (date: Date) => {
        hideDatePicker()
        if (currentDateRef.current === 'Start') {
            setStartDate(date)
            if (endDate === undefined) {
                setEndDate(date)
            }
        } else {
            setEndDate(date)
        }
    }
    const safeAreaInset = useSafeAreaInsets()
    const onSubmit = useCallback(
        (_values: FormikValues) => {
            newLeave({
                leave_type: _values.leave_type.text,
                start_date: startDate!.toString(),
                end_date: isHalfDay
                    ? startDate!.toString()
                    : endDate!.toString(),
                reason: _values.reason,
                user_id: user?.id!,
                is_half_day: isHalfDay ? 1 : 0,
            })
        },
        [endDate, isHalfDay, newLeave, startDate, user?.id]
    )
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardAvoidingView}
        >
            <Screen
                style={styles.container}
                requiresSafeArea={true}
                bottomSafeAreaColor={COLORS.theme?.interface['50']}
            >
                <ScrollView
                    style={styles.scrollView}
                    keyboardShouldPersistTaps={'handled'}
                    contentContainerStyle={styles.scrollViewContent}
                >
                    <View>
                        <AppForm
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            innerRef={innerRef}
                            onSubmit={onSubmit}
                        >
                            <AppLabel
                                text={STRINGS.newLeave.leave_type}
                                textType={TEXT_TYPE.SEMI_BOLD}
                                style={styles.appLabel}
                            />
                            <AppFormDropDown
                                name="leave_type"
                                validationLabelTestID={
                                    'leaveTypeValidationLabel'
                                }
                                appDropDownProps={{
                                    shouldShowCustomIcon: true,
                                    title: STRINGS.newLeave.select_leave_type,
                                    placeHolderText: {
                                        text: STRINGS.newLeave
                                            .select_leave_type,
                                        value: STRINGS.newLeave
                                            .select_leave_type,
                                    },
                                    items: leaveTypeData,
                                    selectedItemCallback: () => {},
                                    style: [
                                        styles.textFieldStyle,
                                        styles.dropDown,
                                    ],
                                }}
                            />
                            <View style={styles.halfDayContainer}>
                                <CheckboxWithText
                                    text={STRINGS.newLeave.half_day}
                                    onChange={(e) => setIsHalfDay(e)}
                                    isLocked={EIntBoolean.FALSE}
                                    textStyle={styles.halfDayText}
                                />
                            </View>
                            <Pressable
                                onPress={() => {
                                    currentDateRef.current = 'Start'
                                    setShowDatePicker(true)
                                }}
                            >
                                <AppFormField
                                    fieldTestID="start_date"
                                    validationLabelTestID={
                                        'emailValidationLabel'
                                    }
                                    name="start_date"
                                    labelProps={{
                                        text: STRINGS.newLeave.start_date,
                                        style: styles.labelStyle,
                                    }}
                                    isLocked={EIntBoolean.TRUE}
                                    fieldInputProps={{
                                        pointerEvents: 'none',
                                        value: dateFormat(startDate!),
                                        textContentType: 'name',
                                        keyboardType: 'default',
                                        returnKeyType: 'next',
                                        placeholder:
                                            STRINGS.newLeave.select_start_date,
                                        autoCapitalize: 'none',
                                        placeholderTextColor:
                                            COLORS.theme?.interface['300'],
                                        style: [styles.fieldInputStyle],
                                        viewStyle: [styles.textFieldStyle],
                                        rightIcon: () => (
                                            <Image
                                                source={require('assets/images/ic_calendar.png')}
                                            />
                                        ),
                                    }}
                                />
                            </Pressable>
                            <Pressable
                                disabled={isHalfDay}
                                onPress={() => {
                                    currentDateRef.current = 'End'
                                    setShowDatePicker(true)
                                }}
                            >
                                <AppFormField
                                    fieldTestID="end_date"
                                    validationLabelTestID={
                                        'emailValidationLabel'
                                    }
                                    name="end_date"
                                    labelProps={{
                                        text: STRINGS.newLeave.end_date,
                                        style: styles.labelStyle,
                                    }}
                                    isLocked={EIntBoolean.TRUE}
                                    fieldInputProps={{
                                        pointerEvents: 'none',
                                        value: isHalfDay
                                            ? dateFormat(startDate!)
                                            : dateFormat(endDate!),
                                        textContentType: 'none',
                                        keyboardType: 'default',
                                        returnKeyType: 'next',
                                        placeholder:
                                            STRINGS.newLeave.select_end_date,
                                        autoCapitalize: 'none',
                                        placeholderTextColor:
                                            COLORS.theme?.interface['300'],
                                        style: [styles.fieldInputStyle],
                                        viewStyle: [styles.textFieldStyle],
                                        rightIcon: () => (
                                            <Image
                                                source={require('assets/images/ic_calendar.png')}
                                            />
                                        ),
                                    }}
                                />
                            </Pressable>

                            <AppFormField
                                fieldTestID="reason"
                                validationLabelTestID={
                                    'passwordValidationLabel'
                                }
                                name="reason"
                                labelProps={{
                                    text: STRINGS.newLeave.reason,
                                    style: styles.labelStyle,
                                }}
                                fieldInputProps={{
                                    textContentType: 'none',
                                    keyboardType: 'default',
                                    returnKeyType: 'done',
                                    placeholder: STRINGS.newLeave.message,
                                    placeholderTextColor:
                                        COLORS.theme?.interface['300'],
                                    style: [styles.fieldInputStyle],
                                    viewStyle: [styles.textFieldStyle],
                                }}
                            />
                        </AppForm>
                    </View>
                </ScrollView>
                {showDatePicker && (
                    <DateTimePickerModal
                        isVisible={true}
                        mode="date"
                        date={
                            currentDateRef.current === 'End'
                                ? endDate
                                : startDate
                        }
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        minimumDate={new Date()}
                        maximumDate={
                            new Date(
                                new Date().setFullYear(
                                    new Date().getFullYear() + 1
                                )
                            )
                        }
                        modalStyleIOS={{
                            marginBottom:
                                safeAreaInset.bottom > 0
                                    ? safeAreaInset.bottom
                                    : SPACE.lg,
                        }}
                    />
                )}
            </Screen>
        </KeyboardAvoidingView>
    )
}

export default NewLeaveView

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingVertical: SPACE.lg,
        paddingHorizontal: SPACE.lg,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    textFieldStyle: {
        borderBottomWidth: 1,
    },
    privacyTextStyle: {
        marginVertical: SPACE.md,
        textAlign: 'center',
    },
    link: {
        color: COLORS.blue,
    },
    labelStyle: {
        marginTop: SPACE.lg,
    },
    fieldInputStyle: {
        color: COLORS.theme?.interface['900'],
    },
    appLabel: {
        fontSize: FONT_SIZE._3xs,
    },
    halfDayContainer: { marginVertical: SPACE.xs, marginStart: 2 },
    halfDayText: { fontSize: FONT_SIZE._2xs },
    dropDown: {
        backgroundColor: COLORS.theme?.primaryBackground,
        borderColor: COLORS.theme?.borderColor,
        borderBottomWidth: 1,
    },
})
