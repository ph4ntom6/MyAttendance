import { useNavigation } from '@react-navigation/native'
import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { HomeStackParamList } from 'routes/HomeStack'
import HeaderLeftTextWithIcon from 'ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon'
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle'
import NewLeaveView from './NewLeaveView'
import Left from 'assets/images/left.svg'
import { COLORS, EVENT, STRINGS } from 'config'
import HeaderRightTextWithIcon from 'ui/components/headers/header_right_text_with_icon/HeaderRightTextWithIcon'
import { StackNavigationProp } from '@react-navigation/stack'
import { FormikHandlers, FormikProps, FormikValues } from 'formik'
import { useGeneralApis } from 'repo/general/GeneralApis'
import { usePreventDoubleTap } from 'hooks'
import { NewLeaveRequestModel } from 'models/api_requests/NewLeaveRequestModel'
import SimpleToast from 'react-native-simple-toast'
import { LeaveType } from 'models/api_responses/GetLeaveTypesApiResponseModel'
import { DropDownItem } from 'models/DropDownItem'
import { useAppSelector } from 'hooks/redux'
import { RootState } from 'stores/store'
import CustomAlertWithTitleAndMessage from 'ui/components/organisms/app_popup/CustomAlertWithTitleAndMessage'
import { TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
import EventBus from 'react-native-event-bus'
import { formatDate } from 'utils/Util'
import analytics from '@react-native-firebase/analytics'

type props = {}
export type LeaveControllerNavigation = StackNavigationProp<
    HomeStackParamList,
    'NewLeave'
>

const NewLeaveController: FC<props> = ({}) => {
    const requestModel = useRef<NewLeaveRequestModel>()
    const { request: newLeaveRequest, loading } = useGeneralApis().requestLeave
    const { request: getLeaveRequestsTypes } =
        useGeneralApis().getLeaveRequestsType

    const navigation = useNavigation<LeaveControllerNavigation>()
    const innerRef = useRef<FormikProps<FormikValues> & FormikHandlers>(null)
    const { user } = useAppSelector((state: RootState) => state.auth)
    const [shouldShowErrorDialog, setShouldShowErrorDialog] =
        useState<boolean>(false)
    const [leaveTypeData, setLeaveTypeData] = useState<
        DropDownItem[] | undefined
    >([])

    const getLeavesData = usePreventDoubleTap(async () => {
        const { hasError, dataBody } = await getLeaveRequestsTypes({
            team_id: user?.team_id ?? 0,
        })

        if (hasError && dataBody === undefined) {
            return
        } else {
            let leaveTypelist = dataBody?.data?.map((item: LeaveType) => {
                return {
                    text: item?.id?.toString(),
                    value: item?.name.toUpperCase(),
                } as DropDownItem
            })
            setLeaveTypeData(leaveTypelist)
        }
    })

    const handleNewLeaveRequest = usePreventDoubleTap(async () => {
        if (requestModel === undefined) {
            return
        }
        const { hasError, dataBody, errorBody } = await newLeaveRequest(
            requestModel.current!
        )
        if (hasError && dataBody === undefined) {
            SimpleToast.show(
                errorBody ?? STRINGS.common.some_thing_bad_happened
            )
        } else {
            await analytics().logSelectContent({
                content_type: 'leave_request',
                item_id: `${user?.id}`,
            })
            setShouldShowErrorDialog(true)
        }
    })

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderLeftTextWithIcon
                    icon={() => <Left width={18} height={18} />}
                    onPress={() => {
                        navigation.goBack()
                    }}
                />
            ),
            headerRight: () => (
                <HeaderRightTextWithIcon
                    showIcon={false}
                    text={STRINGS.newLeave.submit}
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
            headerTitle: () => <HeaderTitle text={STRINGS.newLeave.title} />,
            headerStyle: {
                backgroundColor: COLORS.theme?.interface['100'],
            },
        })
    }, [navigation, loading])

    const handleNavigation = () => {
        setShouldShowErrorDialog(false)
        navigation.goBack()
        const leaves = {
            user_id: user?.id,
            start_date: new Date(),
            end_date: requestModel.current?.end_date_actual,
        }
        EventBus.getInstance().fireEvent(EVENT.FETCH_REQUEST_AGAIN, leaves)
    }

    useEffect(() => {
        getLeavesData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <>
            <NewLeaveView
                leaveTypeData={leaveTypeData}
                newLeave={(values: NewLeaveRequestModel) => {
                    requestModel.current = values
                    requestModel.current.start_date_actual = values.start_date
                    requestModel.current.end_date_actual = values.end_date
                    requestModel.current.start_date = formatDate(
                        values.start_date,
                        'DD MMM YYYY'
                    )
                    requestModel.current.end_date = formatDate(
                        values.end_date,
                        'DD MMM YYYY'
                    )

                    handleNewLeaveRequest()
                }}
                innerRef={innerRef}
            />
            <CustomAlertWithTitleAndMessage
                title={''}
                message={STRINGS.newLeave.request_dialogbox}
                shouldShow={shouldShowErrorDialog}
                hideDialogue={handleNavigation}
            />
        </>
    )
}

export default NewLeaveController
