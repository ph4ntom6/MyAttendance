import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { COLORS, FONTS, FONT_SIZE, SPACE, STRINGS } from 'config'
import React, { FC, RefObject } from 'react'
import { API } from 'config'
import {
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import { AuthStackParamList } from 'routes'
import Screen from 'ui/components/atoms/Screen'
import * as Yup from 'yup'
import AppForm from 'ui/components/molecules/app_form/AppForm'
import AppFormField from 'ui/components/molecules/app_form/AppFormField'
import { CreateTeamApiRequestModel } from 'models/api_requests/CreateTeamRequestModel'
import { FormikHandlers, FormikProps, FormikValues } from 'formik'

type Props = {
    createTeam?: (values: CreateTeamApiRequestModel) => void
    shouldShowProgressBar: boolean
    innerRef?: RefObject<FormikProps<FormikValues> & FormikHandlers>
}

export type CreateTeamScreenProp = StackScreenProps<
    AuthStackParamList,
    'CreateTeam'
>

const initialValues: CreateTeamApiRequestModel = {
    team_name: '',
    full_name: '',
    email: '',
    password: '',
    device_type: '',
}

const validationSchema = Yup.object().shape({
    team_name: Yup.string().required(STRINGS.create_team.team_name_validation),
    full_name: Yup.string()
        .required(STRINGS.create_team.full_name_validation)
        .matches(/^[aA-zZ\s]+$/, STRINGS.common.name_valid),
    email: Yup.string()
        .required(STRINGS.create_team.email_validation)
        .email(STRINGS.create_team.enter_valid_email_validation),
    password: Yup.string()
        .required(STRINGS.create_team.pass_required_validation)
        .min(8, STRINGS.create_team.min_pass_validation),
})

export const CreateTeamView: FC<Props> = ({
    innerRef,
    createTeam = () => {},
}) => {
    const onSubmit = (_value: FormikValues) => {
        createTeam({
            team_name: _value.team_name,
            full_name: _value.full_name,
            email: _value.email,
            password: _value.password,
            device_type: 'android',
        } as CreateTeamApiRequestModel)
    }

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
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollViewContent}
                >
                    <View>
                        <AppForm
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            innerRef={innerRef}
                            onSubmit={onSubmit}
                        >
                            <AppFormField
                                fieldTestID="team_name"
                                validationLabelTestID={'emailValidationLabel'}
                                name="team_name"
                                labelProps={{
                                    text: STRINGS.create_team.team_name,
                                    style: styles.labelStyle,
                                }}
                                fieldInputProps={{
                                    textContentType: 'name',
                                    keyboardType: 'default',
                                    returnKeyType: 'next',
                                    placeholder:
                                        STRINGS.create_team.enter_team_name,
                                    placeholderTextColor:
                                        COLORS.theme?.interface['300'],
                                    style: [styles.fieldInputStyle],
                                    viewStyle: [styles.textFieldStyle],
                                }}
                            />
                            <AppFormField
                                fieldTestID="full_name"
                                validationLabelTestID={'emailValidationLabel'}
                                name="full_name"
                                labelProps={{
                                    text: STRINGS.create_team.full_name,
                                    style: styles.labelStyle,
                                }}
                                fieldInputProps={{
                                    textContentType: 'name',
                                    keyboardType: 'default',
                                    returnKeyType: 'next',
                                    placeholder:
                                        STRINGS.create_team.enter_full_name,
                                    placeholderTextColor:
                                        COLORS.theme?.interface['300'],
                                    style: [styles.fieldInputStyle],
                                    viewStyle: [styles.textFieldStyle],
                                }}
                            />
                            <AppFormField
                                fieldTestID="email"
                                validationLabelTestID={'emailValidationLabel'}
                                name="email"
                                labelProps={{
                                    text: STRINGS.create_team.email,
                                    style: styles.labelStyle,
                                }}
                                fieldInputProps={{
                                    textContentType: 'emailAddress',
                                    keyboardType: 'email-address',
                                    returnKeyType: 'next',
                                    placeholder:
                                        STRINGS.create_team.enter_your_email,
                                    autoCapitalize: 'none',
                                    placeholderTextColor:
                                        COLORS.theme?.interface['300'],
                                    style: [styles.fieldInputStyle],
                                    viewStyle: [styles.textFieldStyle],
                                }}
                            />

                            <AppFormField
                                fieldTestID="password"
                                validationLabelTestID={
                                    'passwordValidationLabel'
                                }
                                name="password"
                                labelProps={{
                                    text: STRINGS.login.password,
                                    style: styles.labelStyle,
                                }}
                                secureTextEntry={true}
                                fieldInputProps={{
                                    textContentType: 'password',
                                    keyboardType: 'default',
                                    returnKeyType: 'done',
                                    placeholder:
                                        STRINGS.create_team.create_password,
                                    autoCapitalize: 'none',
                                    placeholderTextColor:
                                        COLORS.theme?.interface['300'],
                                    style: [styles.fieldInputStyle],
                                    viewStyle: [styles.textFieldStyle],
                                }}
                            />
                        </AppForm>
                    </View>
                </ScrollView>
                <Text style={styles.privacyTextStyle}>
                    {STRINGS.create_team.privacy_text}
                    <Text
                        style={styles.link}
                        onPress={() => Linking.openURL(API.PRIVACY_POLICY)}
                    >
                        {STRINGS.create_team.privacy_policy}
                    </Text>
                    <Text style={styles.privacyTextStyle}>
                        {STRINGS.create_team.and}
                    </Text>
                    <Text
                        style={styles.link}
                        onPress={() => {
                            Linking.openURL(API.TERMS_CONDITIONS)
                        }}
                    >
                        {STRINGS.create_team.terms_of_service}
                    </Text>
                </Text>
            </Screen>
        </KeyboardAvoidingView>
    )
}

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
        borderWidth: 1,
    },
    privacyTextStyle: {
        marginVertical: SPACE.md,
        textAlign: 'center',
        color: COLORS.black,
        fontSize: FONT_SIZE._3xs,
        fontFamily: FONTS.regular,
    },
    link: {
        color: COLORS.blue,
    },
    labelStyle: {
        marginTop: SPACE.md,
    },
    fieldInputStyle: {
        color: COLORS.theme?.interface['900'],
    },
})
