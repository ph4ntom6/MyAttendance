import { ApiErrorResponseModel } from 'models/api_responses/ApiErrorResponseModel'
import { ApiSuccessResponseModel } from 'models/api_responses/ApiSuccessResponseModel'
import { PaginationParamsModel } from 'hooks/usePaginatedApi/PaginationParamsModel'
import { useState, useCallback, Dispatch, SetStateAction, useRef } from 'react'
import { useApi, ApiMethodType } from '../useApi'
import { AppLog } from 'utils/Util'

export function usePaginatedApi<
    Data,
    RequestModel,
    ResponseModel extends ApiSuccessResponseModel<Data[]>,
    V extends ApiErrorResponseModel = ApiErrorResponseModel
>(
    apiMethod: ApiMethodType<RequestModel, ResponseModel, V>,
    requestModel: RequestModel,
    setData: Dispatch<SetStateAction<Data[] | undefined>>,
    overriddenRequestModel?: PaginationParamsModel
) {
    const paginationRequestModel = useRef<PaginationParamsModel>({
        page: 1,
        limit: 9,
        pagination: true,
        ...overriddenRequestModel,
    })

    const [isLoading, _setIsLoading] = useState(true)

    const [isAllDataLoaded, setIsAllDataLoaded] = useState<boolean>(false)

    const [errorMessage, setErrorMessage] = useState<string>()

    const api = useApi<RequestModel, ResponseModel>(apiMethod)

    const handleDataResponse = useCallback(
        async (
            isFromPullToRefresh: boolean = false,
            onComplete?: (data?: Data[]) => void
        ) => {
            const _paginationRequestModel = paginationRequestModel.current

            AppLog.log(
                () =>
                    '_paginationModel: ' +
                    JSON.stringify(_paginationRequestModel),
                'pagination'
            )

            if (!isFromPullToRefresh) {
                _setIsLoading(true)
            }
            const { hasError, dataBody, errorBody } = await api.request(
                requestModel,
                _paginationRequestModel
            )

            if (hasError || dataBody === undefined) {
                setErrorMessage(errorBody)
                _setIsLoading(false)
                return
            } else {
                setErrorMessage(undefined)
                _setIsLoading(false)
                const _data = dataBody.data ?? []

                if (_paginationRequestModel.page === 1) {
                    setData?.(_data)
                    onComplete?.(_data)
                } else {
                    setData?.((_oldData) => {
                        let completeData = [...(_oldData ?? []), ..._data]
                        onComplete?.(completeData)
                        return completeData
                    })
                }

                paginationRequestModel.current = {
                    ..._paginationRequestModel,
                    page: _paginationRequestModel.page! + 1,
                }

                AppLog.log(
                    () =>
                        'isAllDataLoaded going to be: ' +
                        (_data.length < _paginationRequestModel.limit!),
                    'pagination'
                )
                AppLog.log(() => '_data.length: ' + _data.length, 'pagination')
                AppLog.log(
                    () =>
                        '_paginationRequestModel.limit: ' +
                        _paginationRequestModel.limit,
                    'pagination'
                )

                setIsAllDataLoaded(
                    _data.length < _paginationRequestModel.limit!
                )
            }
        },
        [api, setData, requestModel]
    )

    const onEndReached = useCallback(() => {
        if (api.loading) {
            return
        }
        AppLog.log(
            () => 'isAllDataLoaded from onEndReached: ' + isAllDataLoaded,
            'pagination'
        )
        if (isAllDataLoaded) {
            return
        }
        handleDataResponse(false)
    }, [isAllDataLoaded, handleDataResponse, api.loading])

    const _refetchData = useCallback(
        (
            onComplete?: (data?: Data[]) => void,
            requestModelFieldsToOverride?: PaginationParamsModel,
            isFromPullToRefresh: boolean = false
        ) => {
            paginationRequestModel.current = {
                ...paginationRequestModel.current,
                ...requestModelFieldsToOverride,
                page: 1,
            }

            handleDataResponse(isFromPullToRefresh, (data?: Data[]) => {
                onComplete?.(data)
            })
        },
        [handleDataResponse]
    )

    const refetchDataFromStart = useCallback(
        (
            onComplete?: (data?: Data[]) => void,
            requestModelFieldsToOverride?: PaginationParamsModel
        ) => {
            setData?.(undefined)
            _refetchData(onComplete, requestModelFieldsToOverride, false)
        },
        [setData, _refetchData]
    )

    const onPullToRefresh = useCallback(
        (onComplete?: (data?: Data[]) => void) => {
            _refetchData(onComplete, undefined, true)
        },
        [_refetchData]
    )

    return {
        request: handleDataResponse,
        isLoading,
        isAllDataLoaded,
        onEndReached,
        errorMessage,
        onPullToRefresh,
        refetchDataFromStart,
    }
}
