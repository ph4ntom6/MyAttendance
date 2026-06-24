import { COLORS, FONT_SIZE, SPACE, STRINGS } from 'config'
import { FormikValues } from 'formik'
import { ForgotPasswordRequestModel } from 'models/api_requests/ForgotPasswordRequestModel'
import React, { FC } from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from 'react-native'
import { AppLabel, TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
import Screen from 'ui/components/atoms/Screen'
import { BUTTON_TYPES } from 'ui/components/molecules/app_button/AppButton'
import AppForm from 'ui/components/molecules/app_form/AppForm'
import AppFormField from 'ui/components/molecules/app_form/AppFormField'
import AppFormSubmit from 'ui/components/molecules/app_form/AppFormSubmit'
import * as Yup from 'yup'

type Props = {
    forgotPassword: (values: ForgotPasswordRequestModel) => void
    shouldShowProgressBar: boolean
}
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email(STRINGS.login.enter_valid_email_validation)
        .required(STRINGS.login.email_required_validation),
})

let initialValues: FormikValues = {
    email: '',
}

const ForgotPasswordView: FC<Props> = ({
    forgotPassword,
    shouldShowProgressBar,
}) => {
    const onSubmit = (_value: FormikValues) => {
        forgotPassword({
            email: _value.email,
        } as ForgotPasswordRequestModel)
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
                    validationSchema={validationSchema}
                >
                    <ScrollView
                        style={styles.scrollView}
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={styles.scrollViewContent}
                    >
                        <AppLabel
                            text={STRINGS.forgotPassword.description}
                            numberOfLines={0}
                            style={{
                                fontSize: FONT_SIZE.xs,
                                marginTop: SPACE.lg,
                            }}
                        />
                        <AppFormField
                            fieldTestID="email"
                            validationLabelTestID={'emailValidationLabel'}
                            name="email"
                            labelProps={{
                                text: STRINGS.login.email_address,
                                style: { marginTop: SPACE._2xl },
                            }}
                            fieldInputProps={{
                                textContentType: 'emailAddress',
                                keyboardType: 'email-address',
                                returnKeyType: 'done',
                                placeholder:
                                    STRINGS.forgotPassword.email_placeholder,
                                autoCapitalize: 'none',
                                placeholderTextColor:
                                    COLORS.theme?.interface['300'],
                                style: [styles.fieldInputStyle],
                            }}
                        />
                    </ScrollView>
                    <AppFormSubmit
                        text={STRINGS.forgotPassword.btn_text}
                        buttonType={BUTTON_TYPES.NORMAL}
                        textType={TEXT_TYPE.SEMI_BOLD}
                        shouldShowProgressBar={shouldShowProgressBar}
                        textStyle={styles.signInButtonText}
                        buttonStyle={styles.btnContainer}
                    />
                </AppForm>
            </Screen>
        </KeyboardAvoidingView>
    )
}
export default ForgotPasswordView
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: SPACE.lg,
        paddingHorizontal: SPACE.lg,
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
