import { View, StyleSheet, Image, Pressable, Linking } from 'react-native'
import React, { FC } from 'react'
import Screen from 'ui/components/atoms/Screen'
import { COLORS, FONT_SIZE, SPACE, STRINGS } from 'config'
import { AppLabel, TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
import { AppButton } from 'ui/components/molecules/app_button/AppButton'

type props = {
    onPress: () => void
}

const ReportsAndToolsView: FC<props> = ({ onPress }) => {
    return (
        <Screen
            style={styles.container}
            bottomSafeAreaColor={COLORS.theme?.interface['50']}
        >
            <View style={[styles.innerContainer]}>
                <Image
                    source={require('assets/images/icon_mac.png')}
                    resizeMode={'cover'}
                    style={[styles.image]}
                />
                <AppLabel
                    text={STRINGS.reportAndTools.topMessage}
                    numberOfLines={0}
                />
                <Pressable
                    onPress={() => Linking.openURL(STRINGS.reportAndTools.link)}
                >
                    <AppLabel
                        text={STRINGS.reportAndTools.link}
                        style={[styles.linkText]}
                    />
                </Pressable>
                <AppLabel
                    text={STRINGS.reportAndTools.desc}
                    style={[styles.secondText]}
                    textType={TEXT_TYPE.SEMI_BOLD}
                />
                <AppLabel
                    text={STRINGS.reportAndTools.offers}
                    style={[styles.offers]}
                    numberOfLines={0}
                />
            </View>
            <View style={[styles.bottomViewButton]}>
                <AppButton
                    text={STRINGS.reportAndTools.buttonTitle}
                    textType={TEXT_TYPE.SEMI_BOLD}
                    textStyle={[styles.button]}
                    onPress={onPress}
                />
            </View>
        </Screen>
    )
}

export default ReportsAndToolsView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACE.lg,
    },
    innerContainer: {
        flex: 1,
    },
    image: {
        alignSelf: 'center',
        width: '100%',
        height: 180,
        aspectRatio: 14 / 8,
        marginVertical: SPACE.lg,
    },
    linkText: {
        color: COLORS.theme?.secondaryColor,
    },
    secondText: {
        marginTop: SPACE.lg,
    },
    offers: {
        marginLeft: SPACE.lg,
        marginTop: SPACE._2md,
    },
    button: {
        fontSize: FONT_SIZE.base,
    },
    bottomViewButton: {
        alignSelf: 'center',
    },
})
