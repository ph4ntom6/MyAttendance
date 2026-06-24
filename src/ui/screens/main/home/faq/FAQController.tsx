import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FC, useLayoutEffect } from 'react'
import { HomeStackParamList } from 'routes/HomeStack'
import HeaderLeftTextWithIcon from 'ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon'
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle'
import FAQView, { FAQItem } from './FAQView'
import LeftArrow from 'assets/images/left.svg'
import Strings from 'config/Strings'
import { COLORS, FONT_SIZE } from 'config'
import HeaderRightTextWithIcon from 'ui/components/headers/header_right_text_with_icon/HeaderRightTextWithIcon'
import { TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'

type props = {}
type HomeNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>

const FAQController: FC<props> = ({}) => {
    const navigation = useNavigation<HomeNavigationProp>()

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
            headerRight: () => (
                <HeaderRightTextWithIcon
                    text={Strings.faq.contactUs}
                    textStyle={{ color: COLORS.red, fontSize: FONT_SIZE.sm }}
                    textType={TEXT_TYPE.SEMI_BOLD}
                    showIcon={false}
                    onPress={() => navigation.navigate('ContactUs')}
                />
            ),
            headerTitle: () => <HeaderTitle text={Strings.faq.title} />,
        })
    }, [navigation])

    const onPress = (item: FAQItem) => {
        navigation.navigate('FAQDetail', {
            item: item,
        })
    }

    return <FAQView onPress={onPress} />
}

export default FAQController
