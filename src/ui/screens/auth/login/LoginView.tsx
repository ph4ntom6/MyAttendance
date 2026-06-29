import { COLORS, FONT_SIZE, SPACE, STRINGS } from 'config';
import Strings from 'config/Strings';
import { FormikValues } from 'formik';
import { usePreferredTheme } from 'hooks';
import React, { FC } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Screen from 'ui/components/atoms/Screen';
import { BUTTON_TYPES } from 'ui/components/molecules/app_button/AppButton';
import AppForm from 'ui/components/molecules/app_form/AppForm';
import AppFormField from 'ui/components/molecules/app_form/AppFormField';
import { AppFormSubmit } from 'ui/components/molecules/app_form/AppFormSubmit';
import * as Yup from 'yup';
import { TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel';
import { AppLabel } from 'ui/components/atoms/app_label/AppLabel';
import { AuthStackParamList } from 'routes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type Props = {
  signIn: (values: LoginFormValues) => void;
  shouldShowProgressBar: boolean;
  openSignUpScreen: () => void;
};

type AuthNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

type LoginFormValues = {
  email: string;
  password: string;
  remember_me: boolean;
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email(Strings.login.enter_valid_email_validation)
    .required(Strings.login.email_required_validation),
  password: Yup.string()
    .required(Strings.login.pass_required_validation)
    .min(7, Strings.login.min_pass_validation),
  rememberMe: Yup.boolean(),
  // .matches(loginRegx, Strings.login.pass_validation)
});

let initialValues: FormikValues = {
  email: 'employee@demo.com',
  password: 'Test@1234',
  //rememberMe: false,
};

export const LoginView: FC<Props> = ({
  signIn,
  shouldShowProgressBar,
  openSignUpScreen,
}) => {
  const { themedColors } = usePreferredTheme();
  const navigation = useNavigation<AuthNavigationProp>();

  const onSubmit = (_value: FormikValues) => {
    signIn({
      email: _value.email,
      password: _value.password,
      remember_me: _value.rememberMe,
    });
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <Screen
          style={styles.container}
          requiresSafeArea={true}
          requiresExplicitPadding={false}
          bottomSafeAreaColor={COLORS.theme?.interface['50']}
        >
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.imageAndLabelContainer}>
              <Image
                source={require('assets/images/app_logo.png')}
                style={styles.appLogo}
              />
              <AppLabel
                text={STRINGS.login.app_name}
                textType={TEXT_TYPE.BOLD}
                style={styles.appTitle}
              />
              <AppLabel
                text={STRINGS.login.subtitle}
                numberOfLines={0}
                style={styles.subtitle}
              />
            </View>

            <View>
              <AppForm
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
              >
                <AppFormField
                  fieldTestID="email"
                  validationLabelTestID={'emailValidationLabel'}
                  name="email"
                  labelProps={{
                    text: STRINGS.login.email_address,
                  }}
                  fieldInputProps={{
                    textContentType: 'emailAddress',
                    keyboardType: 'email-address',
                    returnKeyType: 'next',
                    placeholder: STRINGS.login.enter_your_email,
                    autoCapitalize: 'none',
                    placeholderTextColor: COLORS.theme?.interface['300'],
                    style: [styles.fieldInputStyle],
                    viewStyle: [styles.textFieldStyle],
                  }}
                />
                <AppFormField
                  fieldTestID="password"
                  validationLabelTestID={'passwordValidationLabel'}
                  name="password"
                  labelProps={{
                    text: STRINGS.login.password,
                    style: { marginTop: SPACE._2xl },
                  }}
                  secureTextEntry={true}
                  fieldInputProps={{
                    textContentType: 'password',
                    keyboardType: 'default',
                    returnKeyType: 'done',
                    placeholder: STRINGS.login.enter_pass,
                    autoCapitalize: 'none',
                    placeholderTextColor: COLORS.theme?.interface['300'],
                    style: [styles.fieldInputStyle],
                    viewStyle: [styles.textFieldStyle],
                  }}
                />

                <AppFormSubmit
                  text={STRINGS.login.sign_in}
                  buttonType={BUTTON_TYPES.NORMAL}
                  textType={TEXT_TYPE.SEMI_BOLD}
                  shouldShowProgressBar={shouldShowProgressBar}
                  textStyle={[
                    styles.signInButtonText,
                    {
                      color: themedColors.primaryBackground,
                    },
                  ]}
                  buttonStyle={styles.signInContainer}
                />

                <AppLabel
                  text={STRINGS.login.forgot_password}
                  style={styles.forgotPassword}
                  onPress={() => navigation.navigate('ForgotPassword')}
                />

                <TouchableWithoutFeedback
                  style={styles.notMemberContainer}
                  onPress={openSignUpScreen}
                >
                  <AppLabel
                    text={Strings.login.not_member_signup_now}
                    style={[styles.register]}
                  />
                </TouchableWithoutFeedback>

                <AppFormSubmit
                  onPress={openSignUpScreen}
                  text={STRINGS.create_team.title}
                  buttonType={BUTTON_TYPES.NORMAL}
                  textType={TEXT_TYPE.SEMI_BOLD}
                  textStyle={[
                    styles.signInButtonText,
                    {
                      color: themedColors.primaryBackground,
                    },
                  ]}
                  buttonStyle={styles.createTeamContainer}
                />
              </AppForm>
            </View>
          </ScrollView>
        </Screen>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: SPACE.lg,
    paddingHorizontal: SPACE.lg,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  textFieldStyle: {
    borderWidth: 1,
  },
  signInButtonText: {
    fontSize: FONT_SIZE.lg,
  },
  imageAndLabelContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: SPACE.md,
    marginBottom: SPACE.xl,
  },
  appLogo: {
    width: 110,
    height: 110,
  },
  appTitle: { fontSize: FONT_SIZE.lg, paddingTop: SPACE._2md },
  subtitle: {
    paddingTop: SPACE.lg,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
  emailAddress: {
    paddingTop: SPACE._2md,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: SPACE.lg,
  },
  rememberMeContainer: {
    marginVertical: SPACE._2xl,
    marginStart: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextField: { marginTop: SPACE.lg },
  signInContainer: {
    backgroundColor: COLORS.theme?.secondaryColor,
    marginTop: SPACE._2xl,
  },
  createTeamContainer: {
    backgroundColor: COLORS.theme?.primaryColor,
    marginTop: SPACE.md,
  },
  forgotPassword: {
    color: COLORS.theme?.secondaryColor,
    fontSize: FONT_SIZE._2xs,
    marginVertical: SPACE._2xl,
    alignSelf: 'center',
  },
  register: {
    marginTop: SPACE._4xl,
  },
  notMemberContainer: {
    alignItems: 'center',
  },
  fieldInputStyle: {
    color: COLORS.theme?.interface['900'],
  },
});
