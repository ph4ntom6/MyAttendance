import { API } from 'config'
import { useApi } from 'hooks/useApi'
import { NewLeaveRequestModel } from 'models/api_requests/NewLeaveRequestModel'
import { ContactUsRequestModel } from 'models/api_requests/ContactUsRequestModel'
import { LeaveApiResponseModel } from 'models/api_responses/LeaveRequestResponseModel'
import { apiClient } from 'repo/Client'
import { QuoteApiResponseModel } from 'models/api_responses/QuoteApiResponseModel'
import { LeaveTypeApiResponseModel } from 'models/api_responses/GetLeaveTypesApiResponseModel'
import { GetLeaveTypesApiRequestModel } from 'models/api_requests/GetLeaveTypesApiRequestModel'
import { NewLeaveApiResponseModel } from 'models/api_responses/NewLeaveResponseModel'
import { AttendanceApiResponseModel } from 'models/api_responses/AttendanceApiResponseModel'
import { AttendanceLeaveApiRequestModel } from 'models/api_requests/AttendanceLeaveApiRequestModel'
import { PunchInAndOutRequestModel } from 'models/api_requests/PunchInAndOutRequestModel'
import { SetProfilePictureRequestModel } from 'models/api_requests/SetProfilePictureRequestModel'
import { SetProfilePictureResponseModel } from 'models/api_responses/SetProfilePictureResponseModel'
import { Platform } from 'react-native'

function getLeaveRequests(requestModel: AttendanceLeaveApiRequestModel) {
    return apiClient.get<LeaveApiResponseModel>(
        API.GET_ALL_LEAVES_URL,
        requestModel
    )
}
function getAttendanceList(requestModel: AttendanceLeaveApiRequestModel) {
    return apiClient.get<AttendanceApiResponseModel>(
        API.GET_ATTENDANCE_URL,
        requestModel
    )
}
function requestLeave(requestModel: NewLeaveRequestModel) {
    return apiClient.post<NewLeaveApiResponseModel>(
        API.GET_ALL_LEAVES_URL,
        JSON.stringify(requestModel)
    )
}
function punchInAndOut(requestModel: PunchInAndOutRequestModel) {
    const data = new FormData()
    data.append('location_latitude', requestModel?.location_latitude)
    data.append('location_longitude', requestModel?.location_longitude)
    data.append('type', requestModel?.type)
    data.append('punch_in_id', requestModel?.punch_in_id)
    data.append('punch_time', requestModel?.punch_time)
    data.append('punchin_via', requestModel?.punchin_via)
    data.append('user_id', requestModel?.user_id)
    data.append('missing_punch_out', requestModel?.missing_punch_out)
    data.append('file_name', {
        uri:
            requestModel.photoFile?.path &&
            `${Platform.OS === 'android' ? 'file://' : ''}${
                requestModel.photoFile?.path
            }`,

        type: 'image/jpeg',
        name: 'sampleName.png',
    })

    return apiClient.post<any>(API.PUNCH_IN_AND_OUT, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}
function getLeaveRequestsType(requestModel: GetLeaveTypesApiRequestModel) {
    return apiClient.get<LeaveTypeApiResponseModel>(
        API.LEAVE_REQUEST_URL,
        requestModel
    )
}
function contactUs(requestModel: ContactUsRequestModel) {
    return apiClient.post<any>(API.CONTACT_US_URL, JSON.stringify(requestModel))
}

function getQuote() {
    return apiClient.get<QuoteApiResponseModel>(API.QUOUTE_URL)
}
function setProfilePicture(requestModel: SetProfilePictureRequestModel) {
    return apiClient.post<SetProfilePictureResponseModel>(
        API.SET_PROFILE_PICTURE_URL,
        JSON.stringify(requestModel)
    )
}

export const useGeneralApis = () => {
    return {
        getLeaveRequests: useApi(getLeaveRequests),
        getAttendanceList: useApi(getAttendanceList),
        requestLeave: useApi(requestLeave),
        getLeaveRequestsType: useApi(getLeaveRequestsType),
        contactUs: useApi(contactUs),
        getQuote: useApi(getQuote),
        punchInAndOut: useApi(punchInAndOut),
        setProfilePicture: useApi(setProfilePicture),
    }
}
