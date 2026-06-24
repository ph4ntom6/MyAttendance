import { useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import { STRINGS } from 'config'
import { useAppDispatch } from 'hooks/redux'
import usePreventDoubleTap from 'hooks/usePreventDoubleTap'
import React, { useLayoutEffect } from 'react'
import { AuthStackParamList } from 'routes'
import { setUser } from 'stores/authSlice'
import HeaderLeftTextWithIcon from 'ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon'
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle'
import ReportsAndToolsView from './ReportsAndToolsView'

type ReportsAndToolsNavigationProp = StackNavigationProp<
    AuthStackParamList,
    'ReportAndTools'
>

type ReportsAndToolsNavigationRouteProp = StackScreenProps<
    AuthStackParamList,
    'ReportAndTools'
>

const ReportsAndToolsController = () => {
    const navigation = useNavigation<ReportsAndToolsNavigationProp>()
    const { params } = useRoute<ReportsAndToolsNavigationRouteProp['route']>()
    const dispatch = useAppDispatch()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderLeftTextWithIcon icon={() => <></>} onPress={() => {}} />
            ),
            headerTitle: () => (
                <HeaderTitle
                    text={STRINGS.reportAndTools.title}
                    shouldTruncate={false}
                />
            ),
        })
    }, [navigation])

    const openHomeScreen = usePreventDoubleTap(() => {
        dispatch(setUser(params?.user!))
    })

    return <ReportsAndToolsView onPress={openHomeScreen} />
}

export default ReportsAndToolsController
