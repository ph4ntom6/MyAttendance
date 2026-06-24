import { createSlice } from '@reduxjs/toolkit'

export type EventName = {
    POP_UP_OPEN: Boolean
}

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U]

export type RefreshingEventType = AtLeastOne<EventName>

export interface GeneralState {}

const initialState: GeneralState = {}

export const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {},
})

// Action creators are generated for each case reducer function
export const {} = generalSlice.actions

export default generalSlice.reducer
