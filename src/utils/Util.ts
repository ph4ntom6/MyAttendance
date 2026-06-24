// A utility class

import { SPACE } from '../config'
import moment from 'moment'
import React from 'react'
import { ViewStyle } from 'react-native'
import { Color, NumberProp } from 'react-native-svg'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import dayjs from 'dayjs'

export enum TAG {
    ONE_SIGNAL = 'one_signal',
    NOTIFICATION = 'notification',
    AUTHENTICATION = 'authentication',
    VERSION_CHECK = 'version_check',
    API = 'api',
    TRACE_UPDATE = 'trace_update',
    APP = 'App',
}

export const AppLog = (function () {
    const LOGS_TAG_FILTER = []
    return {
        log: (onComputeMessage: () => string, tag?: string | TAG) => {
            if (tag && LOGS_TAG_FILTER.includes(tag as TAG)) {
                // eslint-disable-next-line no-console
                console.log(onComputeMessage())
            }
        },
        warn: (message?: any, ...optionalParams: any[]) => {
            // eslint-disable-next-line no-console
            console.warn(message, ...optionalParams)
        },
        bug: (message?: any, ...optionalParams: any[]) => {
            // eslint-disable-next-line no-console
            console.error(message, ...optionalParams)
        },
    }
})()

export const Price = (function () {
    return {
        toString: (currency?: string, amount?: number) => {
            return (
                (currency ?? '£') +
                ' ' +
                (amount != null
                    ? (Math.round(amount * 100) / 100).toFixed(2)
                    : '0.00')
            )
        },
    }
})()

export enum TruncateEnum {
    SHORT = 11,
    MEDIUM = 15,
    LONG = 20,
}
export const truncateString = function (
    textToTruncate: string,
    truncateLength: TruncateEnum
) {
    return textToTruncate.substring(0, truncateLength)
}

/***
 * @example parameterizedString("my name is %s1 and surname is %s2", "John", "Doe");
 * @return "my name is John and surname is Doe"
 *
 * @firstArgument {String} like "my name is %s1 and surname is %s2"
 * @otherArguments {String | Number}
 * @returns {String}
 */
export const parameterizedString = (...args: string[]) => {
    const str = args[0]
    const params = args.filter((arg: string, index: number) => index !== 0)
    if (!str) {
        return ''
    }
    return str.replace(/%s[0-9]+/g, (matchedStr: string) => {
        const variableIndex = Number.parseInt(matchedStr.replace('%s', '')) - 1
        return params[variableIndex]
    })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function delay<T, U, V>(t: T, v?: V) {
    return new Promise<U>((resolve) => {
        setTimeout(resolve.bind(null), t)
    })
}

export type SvgProp = (
    color?: Color,
    width?: NumberProp,
    height?: NumberProp
) => React.ReactElement

export const shadowStyleProps: ViewStyle = {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
}

export const listItemSeparator: ViewStyle = {
    height: SPACE.lg,
}

export const listContentContainerStyle: ViewStyle = {
    paddingVertical: SPACE.lg,
}

export const loginRegx = new RegExp('(?=.*[0-9])(?=.*[A-Z])[A-Za-z\\d]{8,}$')

export const formatTime = (date: string, format: string = 'h:mm a') => {
    return moment(date).format(format)
}
export const formatDate = (
    date?: string,
    outputFormat: string = 'DD MMM YYYY',
    inputFormat?: string
) => {
    dayjs.extend(advancedFormat)
    if (inputFormat) {
        return dayjs(dayjs(date).format(inputFormat)).format(outputFormat)
    }
    return dayjs(date).format(outputFormat)
}
export const getCircularReplacer = () => {
    const seen = new WeakSet()
    return (key: any, value: any) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return
            }
            seen.add(value)
        }
        return value
    }
}
