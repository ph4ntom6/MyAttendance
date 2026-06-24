import { COLORS, FONT_SIZE, FONTS, SPACE } from 'config'
import { usePreferredTheme } from 'hooks'
import React, { useEffect, useState } from 'react'
import {
    Platform,
    Pressable,
    StyleProp,
    StyleSheet,
    TextStyle,
    ViewProps,
    ViewStyle,
} from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import EIntBoolean from 'models/enums/EIntBoolean'
import { AppLabel } from './app_label/AppLabel'

interface OwnProps extends ViewProps {
    text: string
    isBold?: boolean
    style?: StyleProp<ViewStyle>
    preSelected?: boolean
    onChange: (checked: boolean, text?: string) => void
    shouldNotOptimize?: boolean
    isLocked?: EIntBoolean
    textStyle?: StyleProp<TextStyle>
}

type Props = OwnProps

const CheckboxWithText = React.memo<Props>(
    ({
        text,
        style,
        preSelected,
        onChange,
        isLocked = EIntBoolean.FALSE,
        textStyle,
    }) => {
        const [checked, setChecked] = useState(false)
        const { themedColors } = usePreferredTheme()

        //callback for preselected item only
        useEffect(() => {
            if (preSelected) {
                setChecked(true)
                onChange?.(true, text)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [preSelected])

        return (
            <Pressable
                style={[styles.container, style]}
                onPress={() => {
                    if (!isLocked) {
                        setChecked(!checked)
                        onChange(!checked, text)
                    }
                }}
            >
                <CheckBox
                    value={checked}
                    disabled={isLocked === EIntBoolean.TRUE ? true : false}
                    onChange={() => {
                        if (Platform.OS === 'android') {
                            setChecked(!checked)
                            onChange(!checked, text)
                        }
                    }}
                    boxType="square"
                    onCheckColor={COLORS.white}
                    onTintColor={COLORS.theme?.primaryShade['300']}
                    onFillColor={COLORS.theme?.primaryShade['300']}
                    tintColors={{
                        true: COLORS.theme?.primaryShade['300'],
                        false: '',
                    }}
                    style={[
                        styles.checkBox,

                        {
                            width: 20,
                            height: 20,
                        },
                    ]}
                />
                <AppLabel
                    text={text}
                    style={[
                        styles.textStyle,
                        { color: themedColors.interface['900'] },
                        textStyle,
                    ]}
                />
            </Pressable>
        )
    }
)
const styles = StyleSheet.create({
    checkboxText: {
        fontSize: FONT_SIZE.xs,
        marginLeft: SPACE.sm,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkBox: {
        paddingBottom: SPACE._2md,
    },
    textStyle: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZE.sm,
        paddingStart: SPACE.md,
    },
})

export default CheckboxWithText
