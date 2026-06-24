import moment from 'moment'

type DateTime = {
    date?: Date
    timezone_type?: number
    timezone?: string
}

export const toString = (dateTime: DateTime) => {
    return moment(dateTime.date).format('MMMM D YYYY HH:mm')
}

export const timeFromNow = (dateTime: DateTime) => {
    return moment(dateTime.date).from(Date.now())
}

export default DateTime
