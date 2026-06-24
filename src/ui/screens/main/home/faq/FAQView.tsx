import { Pressable, StyleSheet, View } from 'react-native'
import React, { FC, useCallback } from 'react'
import Screen from 'ui/components/atoms/Screen'
import { COLORS, FONT_SIZE, SPACE, STRINGS } from 'config'
import FAQData from './faq.json'
import { AppLabel, TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
import { FlatListWithPb } from 'ui/components/organisms/flat_list/FlatListWithPb'
import RightIcon from 'assets/images/right.svg'

type props = {
    onPress: (item: FAQItem) => void
}

export type FAQItem = {
    title: string
    description: string
}

const FAQView: FC<props> = ({ onPress }) => {
    const renderItem = useCallback(
        ({ item }: { item: FAQItem }) => {
            return (
                <Pressable
                    style={[styles.quesContainer]}
                    onPress={() => onPress(item)}
                >
                    <AppLabel
                        text={item.title}
                        textType={TEXT_TYPE.NORMAL}
                        style={[styles.ques]}
                        numberOfLines={0}
                    />
                    <RightIcon />
                </Pressable>
            )
        },
        [onPress]
    )

    return (
        <Screen
            style={styles.container}
            requiresSafeArea={false}
            bottomSafeAreaColor={COLORS.theme?.interface['50']}
        >
            <View style={[styles.titleContainer]}>
                <AppLabel
                    text={STRINGS.faq.faq}
                    textType={TEXT_TYPE.SEMI_BOLD}
                    style={[styles.topTitle]}
                />
            </View>
            <FlatListWithPb
                data={FAQData.data}
                renderItem={renderItem}
                shouldShowProgressBar={false}
                isAllDataLoaded={true}
                scrollEnabled={true}
                keyExtractor={(item) => item.title}
                showsVerticalScrollIndicator={false}
                style={[styles.flatlist]}
                ItemSeparatorComponent={() => (
                    <View style={[styles.flatListBorders]} />
                )}
            />
        </Screen>
    )
}

export default FAQView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: SPACE.lg,
    },
    topTitle: {
        paddingLeft: SPACE.lg,
        paddingBottom: SPACE._2md,
        fontSize: FONT_SIZE._3xs,
    },
    titleContainer: {
        borderBottomWidth: 0.7,
        borderBottomColor: COLORS.theme?.interface[300],
    },
    flatlist: {
        overflow: 'hidden',
        paddingBottom: SPACE._2xl,
    },
    flatListBorders: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.theme?.interface[200],
    },
    ques: {
        flex: 1,
        paddingVertical: SPACE._2md,
        paddingHorizontal: SPACE.xs,
        fontSize: FONT_SIZE.sm,
    },
    quesContainer: {
        paddingHorizontal: SPACE.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})
