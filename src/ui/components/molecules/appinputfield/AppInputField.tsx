import React, { useState } from 'react'
import {
    StyleProp,
    StyleSheet,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native'
import { COLORS, FONTS, FONT_SIZE, SPACE } from 'config'
import { ImageStyle } from 'react-native'
import { useEffect } from 'react'

export interface AppInputFieldProps extends TextInputProps {
    style?: StyleProp<TextStyle>
    // default undefined
    valueToShowAtStart?: string
    // default false
    shouldDisable?: boolean
    secureTextEntry?: boolean

    rightIcon?: () => React.ReactElement | null
    leftIcon?: () => React.ReactElement | null
    viewStyle?: StyleProp<ViewStyle>
    iconStyle?: StyleProp<ImageStyle>
    multiline?: boolean
    textAlignVertical?: any
    onClickedOnRightIcon?: () => void
}

type Props = AppInputFieldProps

export const AppInputField = React.memo<Props>(
    ({
        onChangeText,
        style,
        valueToShowAtStart,
        shouldDisable = false,
        rightIcon,
        leftIcon,
        viewStyle,
        //iconStyle,
        multiline = false,
        textAlignVertical,
        secureTextEntry = false,
        //iconStyle,
        onClickedOnRightIcon,
        ...rest
    }) => {
        const [value, setTextInputValue] = useState(valueToShowAtStart)

        useEffect(() => {
            setTextInputValue(valueToShowAtStart)
        }, [valueToShowAtStart])

        const getMultiline = () => (multiline ? styles.multiline : {})

        return (
            <View style={[styles.input, viewStyle]}>
                {leftIcon && (
                    <View style={styles.leftIconView}>
                        {leftIcon ? leftIcon() : null}
                    </View>
                )}
                <TextInput
                    textAlignVertical={
                        textAlignVertical ? textAlignVertical : 'center'
                    }
                    testID="InputField"
                    value={value}
                    secureTextEntry={secureTextEntry}
                    editable={!shouldDisable}
                    onChangeText={(text) => {
                        onChangeText?.(text)
                        setTextInputValue(text)
                    }}
                    placeholderTextColor={COLORS.theme?.interface['300']}
                    style={[styles.textInput, style, getMultiline()]}
                    multiline={multiline}
                    {...rest}
                />
                {rightIcon && (
                    <TouchableOpacity
                        onPress={onClickedOnRightIcon}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View style={styles.rightIconView}>
                            {rightIcon ? rightIcon() : null}
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        )
    }
)

const styles = StyleSheet.create({
    input: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        color: COLORS.black,
        borderStyle: 'solid',
        borderRadius: 6,
        flex: 1,
        backgroundColor: COLORS.transparent,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grey1,
    },
    multiline: {
        paddingBottom: SPACE.sm,
    },
    textInput: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZE.base,
        flex: 1,
        color: COLORS.black,
        textAlignVertical: 'center',
    },
    leftIconView: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingStart: SPACE.md,
    },
    rightIconView: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingEnd: SPACE.md,
    },
})
