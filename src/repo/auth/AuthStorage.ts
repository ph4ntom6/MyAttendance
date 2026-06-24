import {
    SignInResponse,
    User,
} from 'models/api_responses/SignInApiResponseModel'
import * as Keychain from 'react-native-keychain'
import { AppLog } from 'utils/Util'

const key = 'user_data'

const storeUser = async (user: SignInResponse) => {
    try {
        await Keychain.setGenericPassword(key, JSON.stringify(user))
    } catch (error: any) {
        AppLog.log(() => 'Error storing the user', error)
    }
}

const storeProfileInCurrentUser = async (profile: User) => {
    const signInResponse = await getUser()
    if (signInResponse !== undefined) {
        signInResponse.user = profile
        await storeUser(signInResponse)
    }
}

const getUser = async () => {
    try {
        const userAsString = await Keychain.getGenericPassword()
        if (typeof userAsString !== 'boolean') {
            return JSON.parse(userAsString.password) as SignInResponse
        }
    } catch (error) {
        AppLog.warn('Error getting the user', error)
    }
}

const getUserToken = async () => {
    try {
        const user = await getUser()
        const userToken = user?.token.access_token
        if (userToken === undefined) {
            throw Error('Unable to fetch user token from AsyncStorage')
        }
        return userToken
    } catch (error: any) {
        AppLog.log(() => 'Error getting the user: ', error)
    }
}

const removeUser = async (callback?: () => void) => {
    try {
        await Keychain.resetGenericPassword()
        callback?.()
    } catch (error) {
        AppLog.warn('Error removing the user', error)
    }
}

export default {
    storeUser,
    getUser,
    removeUser,
    getUserToken,
    storeProfileInCurrentUser,
}
