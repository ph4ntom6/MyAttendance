import { StackNavigationProp } from '@react-navigation/stack';
import React, { FC, useRef, useLayoutEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { AuthStackParamList } from 'routes';
import { useNavigation } from '@react-navigation/native';
import { usePreventDoubleTap } from 'hooks';
import { CreateTeamView } from './CreateTeamView';
import { CreateTeamApiRequestModel } from 'models/api_requests/CreateTeamRequestModel';
import { useAuthApis } from 'repo/auth/AuthApis';
import LeftArrow from 'assets/images/left.svg';
import { COLORS, STRINGS } from 'config';
import HeaderLeftTextWithIcon from 'ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon';
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle';
import HeaderRightTextWithIcon from 'ui/components/headers/header_right_text_with_icon/HeaderRightTextWithIcon';
import { TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel';
import { FormikHandlers, FormikProps, FormikValues } from 'formik';
import { SignInResponse } from 'models/api_responses/SignInApiResponseModel';

type CreateTeamNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'CreateTeam'
>;

type Props = {};

const CreateTeamController: FC<Props> = () => {
  const requestModel = useRef<CreateTeamApiRequestModel>();
  const navigation = useNavigation<CreateTeamNavigationProp>();
  const innerRef = useRef<FormikProps<FormikValues> & FormikHandlers>(null);
  // Create Team Request
  const { request: createTeamRequest, loading } = useAuthApis().createTeam;

  const handleCreateTeam = usePreventDoubleTap(async () => {
    if (requestModel.current === undefined) {
      return;
    }
    requestModel.current.device_type = Platform.OS;
    console.log('DATA===>', requestModel.current);
    const { hasError, errorBody, dataBody } = await createTeamRequest(
      requestModel.current,
    );
    if (hasError || dataBody === undefined) {
      Alert.alert('Please try again', errorBody);
      return;
    } else {
      navigation.navigate('AccountVerification', {
        email: requestModel.current?.email,
        user: dataBody?.data as SignInResponse,
      });
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          icon={() => <LeftArrow width={18} height={18} />}
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerTitle: () => (
        <HeaderTitle text={STRINGS.create_team.title} shouldTruncate={false} />
      ),
      headerRight: () => (
        <HeaderRightTextWithIcon
          showIcon={false}
          text={STRINGS.create_team.sumbit}
          textType={TEXT_TYPE.BOLD}
          textStyle={{
            color: COLORS.theme?.primaryColor,
          }}
          onPress={() => {
            innerRef?.current?.handleSubmit();
          }}
          shouldShowLoader={loading}
        />
      ),
    });
  }, [navigation, loading]);

  return (
    <CreateTeamView
      innerRef={innerRef}
      createTeam={values => {
        requestModel.current = values;
        handleCreateTeam();
      }}
      shouldShowProgressBar={false}
    />
  );
};

export default CreateTeamController;
