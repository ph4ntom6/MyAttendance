import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import {
    Pressable,
    SectionList,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native'
import { AppLog, TAG } from 'utils/Util'

export type BaseItem = {
    key: () => string
}

export type Section<T extends BaseItem, U extends BaseItem> = {
    header: T
    data: U[]
}

interface Props<ItemT extends BaseItem, ItemU extends BaseItem> {
    style?: StyleProp<ViewStyle>
    list: Section<ItemT, ItemU>[]
    selectedIndexProp?: number
    headerView: (
        header: ItemT,
        isSelected: boolean,
        index: number
    ) => React.ReactElement
    bodyView: (
        bodyItem: ItemU,
        parentIndex: number,
        index: number
    ) => React.ReactElement
}

const SectionedList = <ItemT extends BaseItem, ItemU extends BaseItem>({
    style,
    list,
    selectedIndexProp = 0,
    headerView,
    bodyView,
}: Props<ItemT, ItemU>) => {
    AppLog.log(() => 'rendering SectionedList', TAG.APP)
    const [selectedIndex, setSelectedIndex] =
        useState<number>(selectedIndexProp)
    const sectionList = useRef<SectionList<any, any> | null>(null)

    useLayoutEffect(() => {
        AppLog.log(
            () => `scrolling to section ${selectedIndex} and item 0`,
            TAG.APP
        )
        sectionList.current?.scrollToLocation({
            sectionIndex: selectedIndex,
            itemIndex: 0,
        })
    })

    const bodyItemView = useCallback(
        ({
            index,
            item,
            section,
        }: {
            index: number
            item: ItemU
            section: Section<ItemT, ItemU>
        }) => {
            const parentPosition: number = list.indexOf(section)

            if (parentPosition === selectedIndex) {
                AppLog.log(() => `rendering BodyView ${item.key()}`, TAG.APP)
                return bodyView(item, parentPosition, index)
            } else {
                return null
            }
        },
        [list, selectedIndex, bodyView]
    )

    const sectionView = useCallback(
        ({ section }: { section: Section<ItemT, ItemU> }) => {
            const index = list.indexOf(section)
            AppLog.log(
                () => `rendering HeaderView ${section.header.key()}`,
                TAG.APP
            )

            const onPress = () => {
                AppLog.log(
                    () => `HeaderView ${section.header.key()} pressed`,
                    TAG.APP
                )
                setSelectedIndex(index)
            }

            return (
                <View style={styles.bodyItem}>
                    <Pressable onPress={onPress}>
                        {headerView(
                            section.header,
                            selectedIndex === index,
                            index
                        )}
                    </Pressable>
                </View>
            )
        },
        [list, selectedIndex, headerView]
    )

    return (
        <SectionList
            ref={sectionList}
            sections={list}
            renderItem={bodyItemView}
            renderSectionHeader={sectionView}
            keyExtractor={(item) => item.key()}
            contentContainerStyle={style}
            onScrollToIndexFailed={(info) => {
                AppLog.log(() => 'Failed to scroll to ' + info.index, TAG.APP)
            }}
        />
    )
}

const styles = StyleSheet.create({
    bodyItem: {
        flexDirection: 'column',
    },
})

export default SectionedList
