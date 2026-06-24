import { createStackNavigator } from '@react-navigation/stack'
import { SignInResponse } from 'models/api_responses/SignInApiResponseModel'
import EScreen from 'models/enums/EScreen'

export type AuthStackParamList = {
    Login: undefined
    CreateTeam: undefined
    ForgotPassword: undefined
    ReportAndTools: { user?: SignInResponse }
    Welcome: { user?: SignInResponse }
    AccountVerification: {
        email: string
        user: SignInResponse
        isFrom?: EScreen
    }
}

export const AuthStack = createStackNavigator<AuthStackParamList>()
