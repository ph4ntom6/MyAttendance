import DateTime from './DateTime'

type Notification = {
    title: string
    order_id: number
    type: string
    establishment_id: number
    message: string
    created_at: DateTime
    is_read: boolean
}

export default Notification
