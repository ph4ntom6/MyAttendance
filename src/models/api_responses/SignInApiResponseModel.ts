import { ApiSuccessResponseModel } from './ApiSuccessResponseModel'

export type SignInApiResponseModel = ApiSuccessResponseModel<SignInResponse>

export interface SignInResponse {
    token: Token
    user: User
    intended: null
    code: number
}

export interface Token {
    token_type: string
    expires_in: number
    access_token: string
    refresh_token: string
}

export interface User {
    id: number
    full_name: string
    email: string
    team_id: number
    status: number
    image: string
    activation_key: null
    role_id: string
    created_at: string
    updated_at: string
    path: string
    tags: any[]
    team: Team
}

export interface Team {
    id: number
    name: string
    user_id: null
    countries: number
    countries_name: string
    timezones: number
    state: number
    created_at: string
    punch_out_required: number
    tax_percentage: number
    account_type: string
    timezones_name: string
    state_name: string
    isPaid: number
    locations: Locations[]
}

export interface Locations {
    id: number
    team_id: number
    title: string
    address: string
    latitude: string
    longitude: string
    radius: number
    status: number
    created_at: Date
    updated_at: Date
}
