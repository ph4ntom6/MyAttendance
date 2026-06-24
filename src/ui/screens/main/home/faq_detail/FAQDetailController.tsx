import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FC, useLayoutEffect } from 'react'
import { HomeStackParamList } from 'routes/HomeStack'
import HeaderLeftTextWithIcon from 'ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon'
import LeftArrow from 'assets/images/left.svg'
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle'
import Strings from 'config/Strings'
import FAQDetailView from './FAQDetailView'

type props = {}
type HomeNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>
type faqDetailNavigationProp = RouteProp<HomeStackParamList, 'FAQDetail'>

const FQADetailController: FC<props> = ({}) => {
    const navigation = useNavigation<HomeNavigationProp>()
    const route = useRoute<faqDetailNavigationProp>()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerLeft: () => (
                <HeaderLeftTextWithIcon
                    icon={() => <LeftArrow width={18} height={18} />}
                    onPress={() => {
                        navigation.goBack()
                    }}
                />
            ),
            headerTitle: () => <HeaderTitle text={Strings.faq.faqDetail} />,
        })
    }, [navigation])

    return <FAQDetailView item={route.params.item} />
}

export default FQADetailController
