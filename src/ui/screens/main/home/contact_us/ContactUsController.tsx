import React, { useLayoutEffect, useRef } from 'react'
import HeaderLeftTextWithIcon from 'ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon'
import ContactUsView from './ContactUsView'
import LeftArrow from 'assets/images/left.svg'
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle'
import HeaderRightTextWithIcon from 'ui/components/headers/header_right_text_with_icon/HeaderRightTextWithIcon'
import { TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
import { COLORS, STRINGS } from 'config'
import { HomeStackParamList } from 'routes/HomeStack'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { ContactUsRequestModel } from 'models/api_requests/ContactUsRequestModel'
import { FormikHandlers, FormikProps, FormikValues } from 'formik'
import { usePreventDoubleTap } from 'hooks'
import { useGeneralApis } from 'repo/general/GeneralApis'
import SimpleToast from 'react-native-simple-toast'

type HomeNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>

const ContactUsController = () => {
    const navigation = useNavigation<HomeNavigationProp>()
    const requestModel = useRef<ContactUsRequestModel>()
    const innerRef = useRef<FormikProps<FormikValues> & FormikHandlers>(null)
    const { request: contactUsRequest, loading } = useGeneralApis().contactUs

    const handleContactUs = usePreventDoubleTap(async () => {
        if (requestModel.current === undefined) {
            return
        }
        const { hasError, errorBody, dataBody } = await contactUsRequest(
            requestModel.current
        )
        if (hasError || dataBody === undefined) {
            SimpleToast.show(
                errorBody ?? STRINGS.common.some_thing_bad_happened
            )
        } else {
            SimpleToast.show(dataBody.messages[0] ?? '')
            navigation.goBack()
        }
    })
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
                    text={STRINGS.contactUs.title}
                    shouldTruncate={false}
                />
            ),
            headerRight: () => (
                <HeaderRightTextWithIcon
                    showIcon={false}
                    text={STRINGS.contactUs.btn_text}
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
    }, [loading, navigation])
    return (
        <ContactUsView
            innerRef={innerRef}
            contactUs={(values) => {
                requestModel.current = values
                handleContactUs()
            }}
        />
    )
}
export default ContactUsController
