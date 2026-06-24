import { ApiSuccessResponseModel } from './ApiSuccessResponseModel'
import { SignInResponse } from './SignInApiResponseModel'

export type CreateTeamApiResponseModel = ApiSuccessResponseModel<SignInResponse>
