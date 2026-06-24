import React, { FC, useLayoutEffect, useRef, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { HomeBottomBarParamList } from 'routes/HomeBottomBar'
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle'
import { PunchInAndOutView } from './PunchInAndOutView'
import { HomeStackParamList } from 'routes/HomeStack'
import EAttendanceType from 'models/enums/EAttendanceType'
import { usePreventDoubleTap } from 'hooks'
import { useGeneralApis } from 'repo/general/GeneralApis'
import { Quote } from 'models/api_responses/QuoteApiResponseModel'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { RootState } from 'stores/store'
import AppPopUpWithActionsButton from 'ui/components/organisms/app_popup/AppPopUpWithActionsButton'
import { STRINGS } from 'config'
import { useAuthApis } from 'repo/auth/AuthApis'
import { setUser } from 'stores/authSlice'
import AuthStorage from 'repo/auth/AuthStorage'

type Props = {}

export type HomeBottomBarNavigation = StackNavigationProp<
    HomeBottomBarParamList,
    'PunchInAndOut'
>

export type HomeNavigation = StackNavigationProp<HomeStackParamList, 'Camera'>

const PunchInAndOutController: FC<Props> = () => {
    const { request: quoteRequest, loading } = useGeneralApis().getQuote
    const navigation = useNavigation<HomeBottomBarNavigation>()
    const homeNavigation = useNavigation<HomeNavigation>()
    let eAttendanceType = useRef<EAttendanceType>()
    const [quoteData, setQuoteData] = useState<Quote | string | undefined>('')
    const { user } = useAppSelector((state: RootState) => state.auth)
    const [shouldShowErrorDialog, setShouldShowErrorDialog] =
        useState<boolean>(false)
    const { request: updateUserRequest } = useAuthApis().updateUser
    const dispatch = useAppDispatch()

    const getQuoteData = usePreventDoubleTap(async () => {
        const { hasError, dataBody } = await quoteRequest(undefined)
        if (hasError && dataBody === undefined) {
            setQuoteData(undefined)
            return
        } else {
            setQuoteData(dataBody?.data)
        }
    })

    const updateUser = usePreventDoubleTap(async () => {
        const { hasError, dataBody } = await updateUserRequest({})
        if (hasError || dataBody === undefined) {
            return
        } else {
            await AuthStorage.storeProfileInCurrentUser(dataBody.data.user)
            let getUser = await AuthStorage.getUser()
            if (getUser) {
                dispatch(setUser(getUser))
            }
        }
    })

    useEffect(() => {
        updateUser()
        getQuoteData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            headerTitle: () => (
                <HeaderTitle
                    text={user?.full_name ?? ''}
                    shouldTruncate={false}
                />
            ),
        })
    }, [navigation, user])

    const openCameraScreen = (attendanceType: EAttendanceType) => {
        eAttendanceType.current = attendanceType
        homeNavigation.navigate('Camera', {
            attendanceType: attendanceType,
        })
    }

    return (
        <>
            <PunchInAndOutView
                openCameraScreen={openCameraScreen}
                quoteData={quoteData}
                qouteLoading={loading}
            />

            <AppPopUpWithActionsButton
                isVisible={shouldShowErrorDialog}
                title={STRINGS.puchInAndOut.location_alert}
                message={STRINGS.puchInAndOut.location_desc}
                actions={[
                    {
                        title: 'Cancel',
                        onPress: () => {
                            setShouldShowErrorDialog(false)
                            navigation.goBack()
                        },
                    },
                    {
                        title: 'Confirm',
                        onPress: () => {
                            setShouldShowErrorDialog(false)
                            navigation.goBack()
                        },
                    },
                ]}
            />
        </>
    )
}

export default PunchInAndOutController
