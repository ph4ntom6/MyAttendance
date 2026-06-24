import { ApiSuccessResponseModel } from './ApiSuccessResponseModel'

export type SetProfilePictureResponseModel =
    ApiSuccessResponseModel<SetProfilePicture>

export type SetProfilePicture = {
    activation_key: string
    card_brand: string
    card_last_four: string
    created_at: string
    email: string
    full_name: string
    id: number
    image: string
    role_id: number
    status: number
    tax_percentage: number
    trial_ends: string
}
