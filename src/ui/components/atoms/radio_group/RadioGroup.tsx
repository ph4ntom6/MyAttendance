import React, { useEffect, useState } from 'react'
import {
    Dimensions,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
} from 'react-native'
import { AppLabel } from 'ui/components/atoms/app_label/AppLabel'
import usePreferredTheme from 'hooks/theme/usePreferredTheme'
import EIntBoolean from 'models/enums/EIntBoolean'
import { DropDownItem as OptionsData } from 'models/DropDownItem'

export type Choice = { id: number; value: string }

type Props = {
    style?: StyleProp<ViewStyle>
    values: Array<OptionsData>
    onChange?: (value: OptionsData, index: number) => void
    direction: DIRECTION_TYPE
    byDefaultSelected?: number
    itemsInRow?: number //for horizontal buttons
    shouldNotOptimize?: boolean
    isLocked?: EIntBoolean
}

export enum DIRECTION_TYPE {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical',
}

export const RadioGroup = React.memo<Props>(
    ({
        style,
        values,
        onChange,
        itemsInRow = 2,
        direction,
        byDefaultSelected = 0,
        isLocked = EIntBoolean.FALSE,
    }) => {
        const theme = usePreferredTheme()
        const [selectedPosition, setSelectedPosition] = useState<number>(
            values.length - 1 >= byDefaultSelected && byDefaultSelected !== -1
                ? byDefaultSelected
                : 0
        )

        //only used to sent default callback when byDefaultSelected is updated
        useEffect(() => {
            onChange?.(values[selectedPosition], selectedPosition)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [byDefaultSelected])

        function buttonPressed(position: number) {
            if (position !== selectedPosition) {
                setSelectedPosition(position)
                onChange?.(values[position], position)
            }
        }

        function getStyleAsPerSelectionStatus(position: number) {
            return selectedPosition === position
                ? [
                      {
                          backgroundColor: !isLocked
                              ? theme.themedColors.interface['900']
                              : theme.themedColors.interface['700'],
                      },
                  ]
                : [
                      {
                          backgroundColor: !isLocked
                              ? theme.themedColors.primaryBackground
                              : theme.themedColors.secondaryBackground,
                      },
                  ]
        }

        const getDirection = () => {
            if (direction === DIRECTION_TYPE.HORIZONTAL) {
                return styles.direction_horizontal
            } else if (direction === DIRECTION_TYPE.VERTICAL) {
                return styles.direction_vertical
            }
        }

        return (
            <View
                style={[style, getDirection(), styles.radioButtonWrapper]}
                testID={'RADIO_GROUP'}
            >
                {values?.map((item, index) => (
                    <View
                        style={[
                            styles.radioButtonContainer,
                            {
                                width:
                                    Dimensions.get('window').width /
                                    (itemsInRow - 10),
                            },
                        ]}
                        key={item.value}
                    >
                        <TouchableOpacity
                            testID={'RADIO_GROUP_BUTTON'}
                            activeOpacity={isLocked ? 1 : 0.2}
                            style={[
                                styles.radioButton,
                                {
                                    borderColor: !isLocked
                                        ? theme.themedColors.interface['900']
                                        : theme.themedColors.interface['700'],
                                    backgroundColor: !isLocked
                                        ? theme.themedColors.primaryBackground
                                        : theme.themedColors
                                              .secondaryBackground,
                                },
                            ]}
                            onPress={() => !isLocked && buttonPressed(index)}
                        >
                            <View
                                style={[
                                    styles.radioButtonIcon,
                                    getStyleAsPerSelectionStatus(index),
                                ]}
                            />
                        </TouchableOpacity>
                        <TouchableWithoutFeedback
                            testID="RADIO_GROUP_LABEL"
                            onPress={() => !isLocked && buttonPressed(index)}
                        >
                            <AppLabel
                                style={styles.radioButtonText}
                                text={item.value ?? ''}
                            />
                        </TouchableWithoutFeedback>
                    </View>
                ))}
            </View>
        )
    }
)

const styles = StyleSheet.create({
    radioButtonContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    radioButtonWrapper: {
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonIcon: {
        height: 16,
        width: 16,
        borderRadius: 10,
        justifyContent: 'flex-start',
    },
    radioButtonText: {
        fontSize: 14,
        marginLeft: 10,
        marginRight: 16,
    },
    direction_horizontal: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    direction_vertical: {
        flexDirection: 'column',
    },
})
