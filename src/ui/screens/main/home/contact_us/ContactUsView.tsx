import { COLORS, FONT_SIZE, SPACE, STRINGS } from 'config'
import { FormikHandlers, FormikProps, FormikValues } from 'formik'
import { useAppSelector } from 'hooks/redux'
import { ContactUsRequestModel } from 'models/api_requests/ContactUsRequestModel'
import React, { FC, RefObject } from 'react'
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from 'react-native'
import { RootState } from 'stores/store'
import { AppLabel } from 'ui/components/atoms/app_label/AppLabel'
import Screen from 'ui/components/atoms/Screen'
import AppForm from 'ui/components/molecules/app_form/AppForm'
import AppFormField from 'ui/components/molecules/app_form/AppFormField'
import * as Yup from 'yup'

type Props = {
    contactUs: (values: ContactUsRequestModel) => void
    innerRef?: RefObject<FormikProps<FormikValues> & FormikHandlers>
}
const validationSchema = Yup.object().shape({
    message: Yup.string().required(STRINGS.contactUs.errorMessage),
})

let initialValues: FormikValues = {
    message: '',
}

const ContactUsView: FC<Props> = ({ innerRef, contactUs }) => {
    const { user } = useAppSelector((state: RootState) => state.auth)

    const onSubmit = (_value: FormikValues) => {
        contactUs({
            contact_username: user?.full_name,
            contact_email: user?.email,
            contact_message: _value.message,
            contact_company: user?.team.name,
            contact_phone: '',
            device_type: Platform.OS,
        })
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.flex}
        >
            <Screen
                style={styles.container}
                bottomSafeAreaColor={COLORS.theme?.interface['50']}
            >
                <ScrollView
                    style={styles.flex}
                    keyboardShouldPersistTaps={'handled'}
                    contentContainerStyle={styles.scrollViewContent}
                >
                    <AppForm
                        innerRef={innerRef}
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={validationSchema}
                    >
                        <AppLabel
                            text={STRINGS.contactUs.desc}
                            numberOfLines={0}
                            style={{
                                fontSize: FONT_SIZE.sm,
                                marginTop: SPACE.lg,
                            }}
                        />
                        <AppFormField
                            fieldTestID="message"
                            validationLabelTestID={'messageValidationLabel'}
                            name="message"
                            fieldInputProps={{
                                textContentType: 'name',
                                returnKeyType: 'done',
                                placeholder:
                                    STRINGS.contactUs.message_placeholder,
                                autoCapitalize: 'none',
                                placeholderTextColor:
                                    COLORS.theme?.interface['300'],
                                style: [styles.fieldInputStyle],
                                viewStyle: { marginTop: SPACE.xl },
                            }}
                        />
                    </AppForm>
                </ScrollView>
            </Screen>
        </KeyboardAvoidingView>
    )
}
export default ContactUsView
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: SPACE.lg,
        paddingHorizontal: SPACE.lg,
    },
    flex: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    fieldInputStyle: {
        color: COLORS.theme?.interface['900'],
    },
})
