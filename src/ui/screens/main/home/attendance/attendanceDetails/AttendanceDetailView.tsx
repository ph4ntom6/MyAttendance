import React, { FC, useEffect, useState } from 'react'
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native'
import { COLORS, FONTS, FONT_SIZE, SPACE, STRINGS } from 'config'
import { AppLabel } from 'ui/components/atoms/app_label/AppLabel'
import Screen from 'ui/components/atoms/Screen'
import { AttendenceItem } from 'models/api_responses/AttendanceApiResponseModel'

type Props = {
    onHandleProfile: (isPunchOut: boolean) => void
    item: AttendenceItem
    shouldSetProfilePicture?: boolean
    onSave: (value: string) => void
}

export const AttendanceDetailView: FC<Props> = ({
    onHandleProfile,
    item,
    shouldSetProfilePicture,
    onSave,
}) => {
    const [isPunchOutSelected, setisPunchOutSelected] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        onSave(
            isPunchOutSelected
                ? item.punch_out_img['2x']
                : item.punch_in_img['2x']
        )
    }, [isPunchOutSelected, item.punch_in_img, item.punch_out_img, onSave])

    const profilePictureRender = () => {
        return (
            <>
                <Image
                    onLoadEnd={() => {
                        setLoading(false)
                    }}
                    onLoadStart={() => {
                        setLoading(true)
                    }}
                    source={{
                        uri: item.punch_out_id
                            ? isPunchOutSelected
                                ? item.punch_in_img['2x']
                                : item.punch_out_img['2x']
                            : item.punch_in_img['2x'],
                    }}
                    style={styles.image}
                />
                <ActivityIndicator
                    size={'large'}
                    animating={loading}
                    color={COLORS.theme?.primaryColor}
                    style={styles.activityIndicator}
                />
            </>
        )
    }
    return (
        <Screen
            style={styles.container}
            requiresSafeArea={true}
            bottomSafeAreaColor={COLORS.theme?.interface['50']}
        >
            <View style={styles.imgCont}>{profilePictureRender()}</View>
            <View style={styles.bottomWarraper}>
                <AppLabel
                    text={STRINGS.puchInAndOut.punch_in}
                    style={[
                        styles.punchOutSelected,
                        item.punch_out_id !== null &&
                            !isPunchOutSelected &&
                            styles.bottomText,
                    ]}
                    onPress={() =>
                        item.punch_out_id ? setisPunchOutSelected(true) : {}
                    }
                />
                {shouldSetProfilePicture ? (
                    <ActivityIndicator
                        testID="loader"
                        size="small"
                        color={COLORS.theme?.interface['600']}
                    />
                ) : (
                    <AppLabel
                        text={STRINGS.puchInAndOut.set_as_picture}
                        style={
                            loading
                                ? styles.punchOutSelected
                                : styles.bottomTextRed
                        }
                        onPress={() =>
                            !loading && onHandleProfile(isPunchOutSelected)
                        }
                    />
                )}

                <AppLabel
                    text={STRINGS.puchInAndOut.punch_out}
                    style={[
                        styles.punchOutSelected,
                        item.punch_out_id !== null &&
                            isPunchOutSelected &&
                            styles.bottomText,
                    ]}
                    onPress={() => setisPunchOutSelected(false)}
                />
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imgCont: {
        flex: 1,
    },
    image: {
        height: '100%',
        width: '100%',
    },
    activityIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    bottomWarraper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACE.lg,
    },
    punchOutSelected: {
        fontSize: FONT_SIZE.xs,
        fontFamily: FONTS.regular,
        paddingHorizontal: SPACE.sm,
        color: COLORS.theme?.interface[400],
    },
    bottomTextRed: {
        fontSize: FONT_SIZE.xs,
        fontFamily: FONTS.regular,
        color: COLORS.theme?.primaryColor,
    },
    bottomText: {
        color: COLORS.theme?.secondaryColor,
        textDecorationLine: 'underline',
    },
})
