import React, { FC, useEffect, useState } from 'react'
import { COLORS, FONT_SIZE, SPACE, STRINGS } from 'config'
import Fonts from 'config/Fonts'
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native'
import Screen from 'ui/components/atoms/Screen'
import { AppLabel, TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
import {
    AppButton,
    BUTTON_TYPES,
} from 'ui/components/molecules/app_button/AppButton'
import moment from 'moment'
import EAttendanceType from 'models/enums/EAttendanceType'
import { Quote } from 'models/api_responses/QuoteApiResponseModel'

type Props = {
    shouldShowProgressBar?: boolean
    openCameraScreen?: (attendanceType: EAttendanceType) => void
    quoteData: Quote | string | undefined
    qouteLoading: boolean
}

export const PunchInAndOutView: FC<Props> = ({
    openCameraScreen,
    quoteData,
    qouteLoading,
}) => {
    const [time, setTime] = useState(moment().format('h:mm -A'))
    const [date] = useState(moment().format('dddd, MMMM DD'))
    const [isVisble, setVisible] = useState<boolean>(true)

    //Clock
    useEffect(() => {
        let clock = setInterval(() => {
            setTime(moment().format('h:mm -A'))
            setVisible((prev) => !prev)
        }, 1000)

        return () => clearInterval(clock)
    }, [])

    return (
        <Screen style={styles.container} requiresSafeArea={false}>
            <View style={styles.timeDateWrapper}>
                <View style={styles.timeWrapper}>
                    <AppLabel
                        text={time?.split(':')[0]}
                        style={styles.timeTextStyle}
                    />

                    <AppLabel
                        text={isVisble ? ':' : ' '}
                        style={[styles.timeTextStyle, { width: 15 }]}
                    />

                    <AppLabel
                        text={time?.split(':')?.[1]?.split(' ')[0]}
                        style={styles.timeTextStyle}
                    />
                    <AppLabel
                        text={time?.split('-')[1]}
                        style={styles.timeFormat}
                    />
                </View>

                <AppLabel text={date} style={styles.dateTextStyle} />
            </View>
            <View style={styles.buttonViewWrapper}>
                <AppButton
                    onPress={() => openCameraScreen?.(EAttendanceType.PUNCH_IN)}
                    text={STRINGS.puchInAndOut.punch_in}
                    buttonType={BUTTON_TYPES.NORMAL}
                    textStyle={[styles.buttonText]}
                    textType={TEXT_TYPE.SEMI_BOLD}
                    buttonStyle={styles.pucnchInContainer}
                    leftIcon={() => (
                        <Image
                            source={require('assets/images/icon_punch_in.png')}
                        />
                    )}
                />
                <AppButton
                    onPress={() =>
                        openCameraScreen?.(EAttendanceType.PUNCH_OUT)
                    }
                    text={STRINGS.puchInAndOut.punch_out}
                    buttonType={BUTTON_TYPES.NORMAL}
                    textStyle={[styles.buttonText]}
                    textType={TEXT_TYPE.SEMI_BOLD}
                    buttonStyle={styles.punchOutContainer}
                    rightIcon={() => (
                        <Image
                            source={require('assets/images/icon_punch_out.png')}
                        />
                    )}
                />
                {quoteData !== undefined && (
                    <>
                        <AppLabel
                            text={STRINGS.puchInAndOut.qoute}
                            style={styles.qouteTitleStyle}
                            textType={TEXT_TYPE.SEMI_BOLD}
                        />

                        {qouteLoading ? (
                            <ActivityIndicator
                                size={'small'}
                                color={COLORS.theme?.primaryColor}
                                style={{ marginTop: 30 }}
                            />
                        ) : (
                            <>
                                <AppLabel
                                    text={(quoteData as Quote)?.quote}
                                    style={styles.qouteTextStyle}
                                    numberOfLines={0}
                                />
                                <AppLabel
                                    text={`- ${(quoteData as Quote)?.author}`}
                                    style={styles.qouteAuthTextStyle}
                                />
                            </>
                        )}
                    </>
                )}
            </View>
        </Screen>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: SPACE.lg,
        paddingHorizontal: SPACE.lg,
    },
    timeDateWrapper: {
        marginTop: SPACE._3xl,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACE._2xs,
    },
    timeTextStyle: {
        fontFamily: Fonts.thin,
        fontSize: 70,
        textAlign: 'center',
        lineHeight: 70,
    },
    timeFormat: {
        alignSelf: 'flex-end',
        fontSize: FONT_SIZE.xs,
        textAlign: 'right',
        marginBottom: SPACE.md,
        marginLeft: SPACE.md,
    },
    dateTextStyle: {
        fontFamily: Fonts.thin,
        fontSize: FONT_SIZE.lg,
        alignSelf: 'center',
        color: COLORS.theme?.interface[900],
    },
    buttonViewWrapper: {
        marginVertical: SPACE._2xl,
    },
    buttonText: {
        color: COLORS.theme?.primaryBackground,
    },
    pucnchInContainer: {
        margin: SPACE._2md,
        minHeight: 58,
        maxHeight: 60,
        backgroundColor: COLORS.theme?.secondaryColor,
    },
    punchOutContainer: {
        margin: SPACE._2md,
        minHeight: 58,
        maxHeight: 60,
        backgroundColor: COLORS.theme?.primaryColor,
    },
    qouteTitleStyle: {
        marginTop: SPACE.lg,
        fontSize: FONT_SIZE._2xs,
        color: COLORS.theme?.interface[300],
    },
    qouteTextStyle: {
        marginTop: SPACE.lg,
        fontSize: FONT_SIZE._2xs,
        color: COLORS.black,
    },
    qouteAuthTextStyle: {
        marginTop: SPACE.lg,
        fontSize: FONT_SIZE._2xs,
        color: COLORS.theme?.secondaryColor,
    },
    timeWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
})
