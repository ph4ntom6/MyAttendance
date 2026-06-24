import { API } from 'config'
import { usePaginatedApi } from 'hooks/usePaginatedApi'
import { PaginationParamsModel } from 'hooks/usePaginatedApi'
import { Dispatch, SetStateAction } from 'react'
import { apiClient } from 'repo/Client'
import { NotificationListSuccessResponseModel } from 'models/api_responses/NotificationListResposeModel'
import { NotificationListRequestModel } from 'models/api_requests/NotificationListRequestModel'
import Notification from 'models/Notification'

function NotificationList(
    requestModel?: NotificationListRequestModel,
    paginationParamsModel?: PaginationParamsModel
) {
    return apiClient.get<NotificationListSuccessResponseModel>(
        API.NOTIFICATION_URL,
        {
            ...paginationParamsModel,
            ...requestModel,
        }
    )
}

export const useNotificationApis = () => {
    return {
        notifications: (
            _usePaginatedApi: typeof usePaginatedApi,
            setData: Dispatch<SetStateAction<Notification[] | undefined>>,
            requestModel?: NotificationListRequestModel
        ) => {
            return _usePaginatedApi(NotificationList, requestModel, setData)
        },
    }
}
