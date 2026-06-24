import { API } from 'config'
import { useApi } from 'hooks/useApi'
import { SignInApiRequestModel } from 'models/api_requests/SignInApiRequestModel'
import { CreateTeamApiRequestModel } from 'models/api_requests/CreateTeamRequestModel'
import { SignInApiResponseModel } from 'models/api_responses/SignInApiResponseModel'
import { apiClient } from 'repo/Client'
import { ForgotPasswordRequestModel } from 'models/api_requests/ForgotPasswordRequestModel'
import { AccountVerificationRequestModel } from 'models/api_requests/AccountVerificationRequestModel'
import { CreateTeamApiResponseModel } from 'models/api_responses/CreateTeamApiResponseModel'

function signIn(requestModel: SignInApiRequestModel) {
    return apiClient.post<SignInApiResponseModel>(
        API.LOGIN_URL,
        JSON.stringify(requestModel)
    )
}

function createTeam(requestModel: CreateTeamApiRequestModel) {
    return apiClient.post<CreateTeamApiResponseModel>(
        API.CREATE_TEAM_URL,
        JSON.stringify(requestModel)
    )
}

function updateUser() {
    return apiClient.get<SignInApiResponseModel>(API.UPDATE_USER)
}

function checkAppVersion() {
    return apiClient.get<any>(API.VERSION)
}

function accountVerify(requestModel: AccountVerificationRequestModel) {
    return apiClient.post<any>(API.ACCOUNT_VERIFY, JSON.stringify(requestModel))
}
function resendCode(requestModel: AccountVerificationRequestModel) {
    return apiClient.post<any>(API.CODE_RESEND, JSON.stringify(requestModel))
}
function forgotPassword(requestModel: ForgotPasswordRequestModel) {
    return apiClient.post<any>(
        API.FORGOT_PASSWORD,
        JSON.stringify(requestModel)
    )
}

export const useAuthApis = () => {
    return {
        signIn: useApi(signIn),
        createTeam: useApi(createTeam),
        forgotPassword: useApi(forgotPassword),
        accountVerify: useApi(accountVerify),
        resendCode: useApi(resendCode),
        updateUser: useApi(updateUser),
        checkAppVersion: useApi(checkAppVersion),
    }
}
