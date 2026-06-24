export type ApiSuccessResponseModel<T> = {
    code: number
    messages: string[]
    data: T
}
