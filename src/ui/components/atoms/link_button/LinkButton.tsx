import { FONT_SIZE, SPACE } from 'config'
import { usePreferredTheme } from 'hooks'
import React from 'react'
import {
    ImageStyle,
    StyleProp,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle,
} from 'react-native'
import { AppLabel, TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
import { SvgProp } from 'utils/Util'

export interface LinkButtonProps extends TouchableOpacityProps {
    onPress?: () => void
    text: string
    textStyle?: StyleProp<TextStyle>
    leftIcon?: SvgProp
    rightIcon?: SvgProp
    iconStyle?: StyleProp<ImageStyle>
    viewStyle?: StyleProp<ViewStyle>
    textType?: TEXT_TYPE
    numberOfLines?: number
}

export const LinkButton = React.memo<LinkButtonProps>(
    ({
        text,
        onPress,
        textStyle,
        leftIcon,
        rightIcon,
        viewStyle,
        textType = TEXT_TYPE.NORMAL,
        numberOfLines = 1,
    }) => {
        const theme = usePreferredTheme()
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={[style.container, viewStyle]}>
                    {leftIcon
                        ? leftIcon?.(theme.themedColors.primaryColor, 20, 20)
                        : null}
                    <AppLabel
                        numberOfLines={numberOfLines}
                        textType={textType}
                        style={[
                            style.text,
                            { color: theme.themedColors.interface['900'] },
                            leftIcon
                                ? { paddingLeft: SPACE.sm }
                                : { paddingRight: SPACE.sm },
                            textStyle,
                        ]}
                        text={text}
                    />
                    {rightIcon
                        ? rightIcon?.(theme.themedColors.primaryColor, 20, 20)
                        : null}
                </View>
            </TouchableOpacity>
        )
    }
)

const style = StyleSheet.create({
    text: {
        fontSize: FONT_SIZE.xs,
        includeFontPadding: false,
    },
    leftIcon: {
        marginLeft: SPACE.sm,
        width: 20,
        height: 20,
    },
    rightIcon: {
        marginRight: SPACE.sm,
        width: 20,
        height: 20,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})
