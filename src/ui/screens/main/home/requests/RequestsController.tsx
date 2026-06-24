import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { COLORS, STRINGS } from 'config'
import { usePreventDoubleTap } from 'hooks'
import React, {
    FC,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'
import { useGeneralApis } from 'repo/general/GeneralApis'
import { HomeBottomBarParamList } from 'routes/HomeBottomBar'
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle'
import { RequestsView } from './RequestsView'
import { LeaveRequest } from 'models/api_responses/LeaveRequestResponseModel'
import { useAppSelector } from 'hooks/redux'
import { RootState } from 'stores/store'
import { AttendanceLeaveApiRequestModel } from 'models/api_requests/AttendanceLeaveApiRequestModel'
import SimpleToast from 'react-native-simple-toast'

type Props = {}

export type HomeBottomBarNavigation = StackNavigationProp<
    HomeBottomBarParamList,
    'Requests'
>

const RequestsController: FC<Props> = () => {
    const { user } = useAppSelector((state: RootState) => state.auth)
    const requestModel = useRef<AttendanceLeaveApiRequestModel>({
        user_id: user?.id!,
        start_date: '',
        end_date: '',
    })
    const {
        request: getLeaveRequest,
        loading,
        error,
    } = useGeneralApis().getLeaveRequests
    const [leaveRequestData, setLeaveRequestData] = useState<
        LeaveRequest | undefined
    >()
    const navigation = useNavigation<HomeBottomBarNavigation>()
    const getLeaveRequestData = usePreventDoubleTap(
        async (clearData: boolean = false) => {
            if (clearData) {
                setLeaveRequestData(undefined)
            }
            const { hasError, dataBody, errorBody } = await getLeaveRequest(
                requestModel.current
            )
            if (hasError && dataBody === undefined) {
                SimpleToast.show(
                    errorBody ?? STRINGS.common.some_thing_bad_happened
                )
            } else {
                setLeaveRequestData(dataBody.data)
            }
        }
    )
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: COLORS.theme?.interface['50'],
                elevation: 0,
                shadowOpacity: 0,
            },
            headerTitle: () => (
                <HeaderTitle
                    text={STRINGS.home.requests.title}
                    shouldTruncate={false}
                />
            ),
        })
    }, [navigation])
    useEffect(() => {
        getLeaveRequestData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onRefresh = useCallback(() => {
        getLeaveRequestData(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updatedDates = useCallback(
        (startDate, endDate) => {
            requestModel.current.start_date = startDate
            requestModel.current.end_date = endDate
            onRefresh()
        },
        [onRefresh]
    )

    return (
        <RequestsView
            requestData={leaveRequestData}
            shouldShowProgressBar={loading}
            setDateFields={updatedDates}
            retryCallBack={getLeaveRequestData}
            error={error}
        />
    )
}

export default RequestsController
