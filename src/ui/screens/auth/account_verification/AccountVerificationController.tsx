import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import HeaderLeftTextWithIcon from 'ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon'
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle'
import LeftArrow from 'assets/images/left.svg'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import { AuthStackParamList } from 'routes'
import { useNavigation, useRoute } from '@react-navigation/native'
import { COLORS, STRINGS } from 'config'
import { useAuthApis } from 'repo/auth/AuthApis'
import { usePreventDoubleTap } from 'hooks'
import SimpleToast from 'react-native-simple-toast'
import AccountVerificationView from './AccountVerificationView'
import { AccountVerificationRequestModel } from 'models/api_requests/AccountVerificationRequestModel'
import HeaderRightTextWithIcon from 'ui/components/headers/header_right_text_with_icon/HeaderRightTextWithIcon'
import { TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
import { FormikHandlers, FormikProps, FormikValues } from 'formik'
import EScreen from 'models/enums/EScreen'
import { useAppDispatch } from 'hooks/redux'
import { setUser } from 'stores/authSlice'

type AuthNavigationProp = StackNavigationProp<
    AuthStackParamList,
    'ForgotPassword'
>
type AccountVerifyNavigationProp = StackScreenProps<
    AuthStackParamList,
    'AccountVerification'
>
const AccountVerificationController = () => {
    const requestModel = useRef<AccountVerificationRequestModel>()
    const navigation = useNavigation<AuthNavigationProp>()
    const { params } = useRoute<AccountVerifyNavigationProp['route']>()
    const { request: accountVerifyRequest, loading } =
        useAuthApis().accountVerify
    const { request: resendCodeRequest } = useAuthApis().resendCode
    const [verificationCode, setVerificationCode] = useState<string>()
    const innerRef = useRef<FormikProps<FormikValues> & FormikHandlers>(null)
    const dispatch = useAppDispatch()

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
                    text={STRINGS.accountVerification.title}
                    shouldTruncate={false}
                />
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
                        innerRef?.current?.handleSubmit()
                    }}
                    shouldShowLoader={loading}
                />
            ),
        })
    }, [navigation, loading])
    const handleAccountVerify = usePreventDoubleTap(async () => {
        if (requestModel === undefined) {
            return
        }
        requestModel.current!.email = params?.email
        const { hasError, dataBody, errorBody } = await accountVerifyRequest(
            requestModel.current!
        )
        if (hasError && dataBody === undefined) {
            SimpleToast.show(
                errorBody ?? STRINGS.common.some_thing_bad_happened
            )
        } else {
            if (params?.isFrom === EScreen.LOGIN) {
                dispatch(setUser(params?.user!))
            } else {
                navigation.navigate('Welcome', { user: params?.user })
            }
        }
    })

    const handleResendCode = usePreventDoubleTap(async () => {
        if (requestModel === undefined) {
            return
        }
        const { hasError, dataBody, errorBody } = await resendCodeRequest({
            email: params?.email,
        })
        if (hasError && dataBody === undefined) {
            SimpleToast.show(
                errorBody ?? STRINGS.common.some_thing_bad_happened
            )
        } else {
            SimpleToast.show(
                dataBody?.messages[0] ?? STRINGS.common.some_thing_bad_happened
            )
        }
    })
    useEffect(() => {
        if (verificationCode?.length === 6) {
            innerRef?.current?.handleSubmit()
        }
    }, [verificationCode])
    return (
        <AccountVerificationView
            innerRef={innerRef}
            accountVerify={(values: AccountVerificationRequestModel) => {
                requestModel.current = values
                handleAccountVerify()
            }}
            email={params?.email}
            onPress={handleResendCode}
            setVerificationCode={setVerificationCode}
        />
    )
}
export default AccountVerificationController
