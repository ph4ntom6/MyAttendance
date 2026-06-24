import { useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import { COLORS, STRINGS } from 'config'
import usePreventDoubleTap from 'hooks/usePreventDoubleTap'
import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { AuthStackParamList } from 'routes'
import { TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
import HeaderLeftTextWithIcon from 'ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon'
import HeaderRightTextWithIcon from 'ui/components/headers/header_right_text_with_icon/HeaderRightTextWithIcon'
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle'
import WelcomeView from './WelcomeView'

type WelcomeNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>
type WelcomeNavigationRouteProp = StackScreenProps<
    AuthStackParamList,
    'Welcome'
>

const WelcomeController = () => {
    const navigation = useNavigation<WelcomeNavigationProp>()
    const { params } = useRoute<WelcomeNavigationRouteProp['route']>()
    const [pausedVideo, setPausedVideo] = useState(false)

    const onPressContinue = usePreventDoubleTap(() => {
        setPausedVideo(true)
        navigation.navigate('ReportAndTools', { user: params?.user })
    })

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderLeftTextWithIcon icon={() => <></>} onPress={() => {}} />
            ),
            headerTitle: () => (
                <HeaderTitle
                    text={STRINGS.welcome.title}
                    shouldTruncate={false}
                />
            ),
            headerRight: () => (
                <HeaderRightTextWithIcon
                    text={STRINGS.welcome.skip}
                    onPress={onPressContinue}
                    showIcon={false}
                    textStyle={styles.skipText}
                    textType={TEXT_TYPE.SEMI_BOLD}
                />
            ),
        })
    }, [navigation, onPressContinue])

    return (
        <WelcomeView
            onPressContinue={onPressContinue}
            pausedVideo={pausedVideo}
        />
    )
}

export default WelcomeController

const styles = StyleSheet.create({
    skipText: {
        color: COLORS.red,
    },
})
