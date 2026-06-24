import { useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import React, { FC, useLayoutEffect, useState } from 'react'
import { HomeBottomBarParamList } from 'routes/HomeBottomBar'
import HeaderLeftTextWithIcon from 'ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon'
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle'
import { MissingPunchOutView } from './MissingPunchOutView'
import LeftArrow from 'assets/images/left.svg'
import { useGeneralApis } from 'repo/general/GeneralApis'
import { usePreventDoubleTap } from 'hooks'
import { useAppSelector } from 'hooks/redux'
import { RootState } from 'stores/store'
import DateTime from 'models/DateTime'
import { HomeStackParamList } from 'routes/HomeStack'
import AppPopUpWithActionsButton from 'ui/components/organisms/app_popup/AppPopUpWithActionsButton'
import { formatDate } from 'utils/Util'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import EventBus from 'react-native-event-bus'
import { EVENT, STRINGS } from 'config'
import SimpleToast from 'react-native-simple-toast'
dayjs.extend(utc)

type Props = {}

export type HomeBottomBarNavigation = StackNavigationProp<
    HomeBottomBarParamList,
    'PunchInAndOut'
>
type MissingPunchOutNavigationProp = StackScreenProps<
    HomeStackParamList,
    'MissingPunchOut'
>

const MissingPunchOutController: FC<Props> = () => {
    const navigation = useNavigation<HomeBottomBarNavigation>()
    const { params } = useRoute<MissingPunchOutNavigationProp['route']>()
    const { request: punchInAndOutRequest, loading } =
        useGeneralApis().punchInAndOut
    const [shouldShowErrorDialog, setShouldShowErrorDialog] = useState<{
        message?: string
        shouldShow?: boolean
    }>({ shouldShow: false })
    const { user } = useAppSelector((state: RootState) => state.auth)
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            headerLeft: () => (
                <HeaderLeftTextWithIcon
                    icon={() => <LeftArrow width={18} height={18} />}
                    onPress={() => {
                        navigation.pop()
                    }}
                />
            ),
            headerTitle: () => (
                <HeaderTitle
                    text={'Missing Punch Out'}
                    shouldTruncate={false}
                />
            ),
        })
    }, [navigation])

    const handleMissingPunchOut = usePreventDoubleTap(
        async (selectedDate: DateTime | string) => {
            if (loading) {
                return
            }

            const { hasError, dataBody, statusCode, errorBody } =
                await punchInAndOutRequest({
                    photoFile: params?.photoFile,
                    location_latitude: params?.latitude,
                    location_longitude: params?.longitude,
                    type: 'punch_out',
                    punch_in_id: '0',
                    punch_time: formatDate(
                        String(
                            dayjs(selectedDate.toString()).subtract(
                                dayjs().utcOffset(),
                                'minutes'
                            )
                        ),
                        'YYYY-MM-DD HH:mm:ss'
                    ),
                    punchin_via: 'mobile',
                    user_id: user?.id,
                    missing_punch_out: 'true',
                })
            if (hasError || dataBody === undefined) {
                if (statusCode === 569) {
                    setShouldShowErrorDialog({
                        message: (errorBody as any)?.error?.messages,
                        shouldShow: true,
                    })
                } else {
                    SimpleToast.show(
                        errorBody ?? STRINGS.common.some_thing_bad_happened
                    )
                }
            } else {
                EventBus.getInstance().fireEvent(EVENT.FETCH_ATTENDANCE)
                navigation.goBack()
            }
        }
    )

    return (
        <>
            <MissingPunchOutView
                onPress={handleMissingPunchOut}
                previousDate={params?.response?.punch_time ?? ''}
                shouldShowProgressBar={loading}
            />
            <AppPopUpWithActionsButton
                isVisible={shouldShowErrorDialog.shouldShow!}
                message={shouldShowErrorDialog.message}
                actions={[
                    {
                        title: 'OK',
                        onPress: () => {
                            setShouldShowErrorDialog({ shouldShow: false })
                            navigation.goBack()
                        },
                    },
                ]}
            />
        </>
    )
}

export default MissingPunchOutController
