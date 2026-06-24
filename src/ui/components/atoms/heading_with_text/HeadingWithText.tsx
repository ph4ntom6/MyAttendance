import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { AppLabel, TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
import { FONT_SIZE } from 'config'

interface OwnProps {
    headingText: string
    text: string
    headingStyle?: StyleProp<ViewStyle>
    textStyle?: StyleProp<ViewStyle>
}

type Props = OwnProps

export const HeadingWithText = React.memo<Props>(
    ({ text, headingText, headingStyle, textStyle }) => {
        return (
            <View testID={'HEADING_WITH_TEXT'}>
                <AppLabel
                    text={headingText}
                    textType={TEXT_TYPE.BOLD}
                    style={[headingStyle, { fontSize: FONT_SIZE.lg }]}
                />
                <AppLabel
                    text={text}
                    numberOfLines={0}
                    style={[textStyle, { fontSize: FONT_SIZE.sm }]}
                />
            </View>
        )
    }
)
