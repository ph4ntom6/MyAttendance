import { View, StyleSheet } from 'react-native'
import React, { FC, useRef, useState } from 'react'
import { COLORS, SPACE, STRINGS } from 'config'
import Screen from 'ui/components/atoms/Screen'
import { AppLabel, TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
import { AppButton } from 'ui/components/molecules/app_button/AppButton'
import Video from 'react-native-video'

type props = {
    onPressContinue: () => void
    pausedVideo: boolean
}

const WelcomeView: FC<props> = ({ onPressContinue, pausedVideo }) => {
    let videoRef = useRef(null)
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true)

    return (
        <Screen
            style={styles.container}
            bottomSafeAreaColor={COLORS.theme?.interface['50']}
        >
            <View style={[styles.innerContainer]}>
                <AppLabel
                    text={STRINGS.welcome.message}
                    numberOfLines={0}
                    style={{ marginTop: SPACE.lg }}
                />
                <View>
                    <Video
                        source={require('assets/video/tutorial.mp4')} // Can be a URL or a local file.
                        ref={videoRef} // Store reference
                        style={styles.backgroundVideo}
                        onEnd={() => setIsButtonDisabled(false)}
                        paused={pausedVideo}
                    />
                </View>
            </View>
            <AppButton
                text={STRINGS.welcome.buttonTitle}
                textType={TEXT_TYPE.SEMI_BOLD}
                isDisable={isButtonDisabled}
                onPress={onPressContinue}
            />
        </Screen>
    )
}

export default WelcomeView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: SPACE.lg,
        paddingHorizontal: SPACE.lg,
    },
    innerContainer: {
        flex: 1,
    },
    backgroundVideo: {
        height: 240,
        width: '100%',
        marginTop: SPACE._4xl,
    },
})
