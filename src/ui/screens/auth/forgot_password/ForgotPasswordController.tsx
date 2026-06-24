import React, { useLayoutEffect, useRef, useState } from 'react'
import HeaderLeftTextWithIcon from 'ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon'
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle'
import ForgotPasswordView from './ForgotPasswordView'
import LeftArrow from 'assets/images/left.svg'
import { StackNavigationProp } from '@react-navigation/stack'
import { AuthStackParamList } from 'routes'
import { useNavigation } from '@react-navigation/native'
import { STRINGS } from 'config'
import { useAuthApis } from 'repo/auth/AuthApis'
import { usePreventDoubleTap } from 'hooks'
import SimpleToast from 'react-native-simple-toast'
import CustomAlertWithTitleAndMessage from 'ui/components/organisms/app_popup/CustomAlertWithTitleAndMessage'
import { ForgotPasswordRequestModel } from 'models/api_requests/ForgotPasswordRequestModel'

type AuthNavigationProp = StackNavigationProp<
    AuthStackParamList,
    'ForgotPassword'
>
const ForgotPasswordController = () => {
    const requestModel = useRef<ForgotPasswordRequestModel>()
    const navigation = useNavigation<AuthNavigationProp>()
    const [shouldShowDialog, setShouldShowDialog] = useState(false)
    const { request: forgotPasswordRequest, loading } =
        useAuthApis().forgotPassword
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderLeftTextWithIcon
                    icon={() => <LeftArrow width={18} height={18} />}
                    onPress={() => {
                        navigation.goBack()
                    }}
                />
            ),
            headerTitle: () => (
                <HeaderTitle
                    text={STRINGS.forgotPassword.title}
                    shouldTruncate={false}
                />
            ),
        })
    }, [navigation])
    const handleForgotPassword = usePreventDoubleTap(async () => {
        if (requestModel === undefined) {
            return
        }
        const { hasError, dataBody, errorBody } = await forgotPasswordRequest(
            requestModel.current!
        )
        if (hasError && dataBody === undefined) {
            SimpleToast.show(
                errorBody ?? STRINGS.common.some_thing_bad_happened
            )
        } else {
            setShouldShowDialog(true)
        }
    })
    return (
        <>
            <ForgotPasswordView
                forgotPassword={(values: ForgotPasswordRequestModel) => {
                    requestModel.current = values
                    handleForgotPassword()
                }}
                shouldShowProgressBar={loading}
            />
            {shouldShowDialog && (
                <CustomAlertWithTitleAndMessage
                    title={STRINGS.forgotPassword.dialog_heading}
                    message={
                        STRINGS.forgotPassword.dialogue_text +
                        ' ' +
                        requestModel.current?.email
                    }
                    shouldShow={shouldShowDialog}
                    hideDialogue={() => {
                        setShouldShowDialog(false)
                        navigation.goBack()
                    }}
                />
            )}
        </>
    )
}
export default ForgotPasswordController
