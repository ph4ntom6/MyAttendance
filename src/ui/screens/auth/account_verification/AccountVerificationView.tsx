import { COLORS, FONT_SIZE, SPACE, STRINGS } from 'config'
import { FormikHandlers, FormikProps, FormikValues } from 'formik'
import { AccountVerificationRequestModel } from 'models/api_requests/AccountVerificationRequestModel'
import React, { Dispatch, FC, RefObject, SetStateAction } from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
} from 'react-native'
import { AppLabel } from 'ui/components/atoms/app_label/AppLabel'
import Screen from 'ui/components/atoms/Screen'
import AppForm from 'ui/components/molecules/app_form/AppForm'
import AppFormField from 'ui/components/molecules/app_form/AppFormField'
import * as Yup from 'yup'

type Props = {
    innerRef?: RefObject<FormikProps<FormikValues> & FormikHandlers>
    accountVerify: (values: AccountVerificationRequestModel) => void
    email: string
    onPress: () => void
    setVerificationCode: Dispatch<SetStateAction<string | undefined>>
}
const validationSchema = Yup.object().shape({
    code: Yup.string().required(
        STRINGS.accountVerification.code_required_validation
    ),
})

let initialValues: FormikValues = {
    code: '',
}

const AccountVerificationView: FC<Props> = ({
    accountVerify,
    email,
    onPress,
    innerRef,
    setVerificationCode,
}) => {
    const onSubmit = (_value: FormikValues) => {
        accountVerify({
            code: _value.code,
        })
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardAvoidingView}
        >
            <Screen
                style={styles.container}
                bottomSafeAreaColor={COLORS.theme?.interface['50']}
            >
                <AppForm
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    innerRef={innerRef}
                    validationSchema={validationSchema}
                >
                    <ScrollView
                        style={styles.scrollView}
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={styles.scrollViewContent}
                    >
                        <AppLabel
                            text={
                                STRINGS.accountVerification.confirmation_code +
                                ' ' +
                                email
                            }
                            numberOfLines={0}
                            style={{
                                fontSize: FONT_SIZE.xs,
                                marginTop: SPACE.lg,
                            }}
                        />
                        <AppFormField
                            fieldTestID="code"
                            validationLabelTestID={'codeValidationLabel'}
                            name="code"
                            labelProps={{
                                text: STRINGS.accountVerification
                                    .verification_code,
                                style: { marginTop: SPACE._2xl },
                            }}
                            customTextChanged={setVerificationCode}
                            fieldInputProps={{
                                maxLength: 6,
                                textContentType: 'none',
                                keyboardType: 'number-pad',
                                returnKeyType: 'done',
                                placeholder:
                                    STRINGS.accountVerification
                                        .verification_code_placeholder,
                                autoCapitalize: 'none',
                                placeholderTextColor:
                                    COLORS.theme?.interface['300'],
                                style: [styles.fieldInputStyle],
                            }}
                        />
                        <Text style={styles.notRecieved}>
                            {STRINGS.accountVerification.not_receive_code}
                            <Text style={styles.link} onPress={onPress}>
                                {STRINGS.accountVerification.resend_code}
                            </Text>
                        </Text>
                    </ScrollView>
                </AppForm>
            </Screen>
        </KeyboardAvoidingView>
    )
}
export default AccountVerificationView
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: SPACE.lg,
        paddingHorizontal: SPACE.lg,
    },
    link: {
        color: COLORS.blue,
        textDecorationLine: 'underline',
    },
    notRecieved: {
        color: COLORS.black,
        fontSize: FONT_SIZE._2xs,
        marginTop: SPACE.lg,
    },
    signInButtonText: {
        fontSize: FONT_SIZE.lg,
        color: COLORS.theme?.primaryBackground,
    },
    btnContainer: {
        backgroundColor: COLORS.theme?.primaryColor,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    scrollView: {
        flex: 1,
    },
    fieldInputStyle: {
        color: COLORS.theme?.interface['900'],
    },
})
