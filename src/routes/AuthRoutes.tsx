import React, { FC } from 'react'
import LoginController from 'ui/screens/auth/login/LoginController'
import { AuthStack } from './AuthStack'
import { COLORS } from 'config'
import { shadowStyleProps } from 'utils/Util'
import CreateTeamController from 'ui/screens/auth/create_team/CreateTeamController'
import ForgotPasswordController from 'ui/screens/auth/forgot_password/ForgotPasswordController'
import ReportsAndToolsController from 'ui/screens/main/home/reports_and_tools/ReportsAndToolsController'
import WelcomeController from 'ui/screens/main/home/welcome/WelcomeController'
import AccountVerificationController from 'ui/screens/auth/account_verification/AccountVerificationController'

type Props = {
    initialRouteName: 'Login'
}

export const AuthRoutes: FC<Props> = ({ initialRouteName }) => {
    return (
        <AuthStack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: COLORS.theme?.interface[100],
                    ...shadowStyleProps,
                    shadowOpacity: 0.2,
                },
            }}
        >
            <AuthStack.Screen
                name="Login"
                component={LoginController}
                options={{
                    headerShown: false,
                }}
            />
            <AuthStack.Screen
                name="CreateTeam"
                component={CreateTeamController}
            />
            <AuthStack.Screen
                name="AccountVerification"
                component={AccountVerificationController}
            />
            <AuthStack.Screen
                name="ForgotPassword"
                component={ForgotPasswordController}
            />
            <AuthStack.Screen
                name="ReportAndTools"
                component={ReportsAndToolsController}
            />
            <AuthStack.Screen name={'Welcome'} component={WelcomeController} />
        </AuthStack.Navigator>
    )
}
