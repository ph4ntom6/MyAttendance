import { StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { FAQItem } from '../faq/FAQView'
import { COLORS, SPACE } from 'config'
import Screen from 'ui/components/atoms/Screen'
import { AppLabel, TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'

type props = {
    item: FAQItem
}

const FAQDetailView: FC<props> = ({ item }) => {
    return (
        <Screen
            style={styles.container}
            requiresSafeArea={false}
            bottomSafeAreaColor={COLORS.theme?.interface['50']}
        >
            <AppLabel
                text={item.title}
                textType={TEXT_TYPE.SEMI_BOLD}
                numberOfLines={0}
            />
            <AppLabel
                text={item.description}
                textType={TEXT_TYPE.NORMAL}
                numberOfLines={0}
                style={[styles.desc]}
            />
        </Screen>
    )
}

export default FAQDetailView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: SPACE.xl,
        paddingHorizontal: SPACE.xl,
    },
    desc: {
        marginTop: SPACE._2md,
    },
})
