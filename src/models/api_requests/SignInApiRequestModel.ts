export type SignInApiRequestModel = {
    email: string
    password: string
    remember_me?: boolean
    grant_type: string
    client_id: string
    client_secret: string
    scope: string
    device_type: string
    device_token?: string
}
