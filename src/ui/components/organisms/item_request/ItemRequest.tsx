import { COLORS, FONT_SIZE, SPACE } from 'config'
import { LeaveItem } from 'models/api_responses/LeaveRequestResponseModel'
import ELeaveType from 'models/enums/ELeaveType'
import EStatusType from 'models/enums/EStatusType'
import React, { FC } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { AppLabel, TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
import HelpIcon from 'assets/images/help-icon.svg'

type Props = {
    item: LeaveItem
}
const ItemRequest: FC<Props> = ({ item }) => {
    const renderLeaveTypeIcons = () => {
        if (
            item.type === ELeaveType.CASUAL ||
            item.type === ELeaveType.ANNUAL ||
            item.type === ELeaveType.SICK
        ) {
            return (
                <Image
                    source={{ uri: item.icon['2x'] }}
                    style={{ width: 55, height: 55 }}
                />
            )
        } else {
            return <HelpIcon height={55} width={55} />
        }
    }
    const renderStatusIcons = () => {
        return (
            <Image
                source={
                    item.status === EStatusType.APPROVED
                        ? require('assets/images/ic_tick.png')
                        : item.status === EStatusType.PENDING
                        ? require('assets/images/ic_pending.png')
                        : require('assets/images/ic_cross.png')
                }
                style={[styles.bottomRightItems, { width: 22, height: 22 }]}
            />
        )
    }
    const dateRender = () => {
        if (item.date_from === item.date_to) {
            return item.date_from
        } else {
            return item.date_from + ' - ' + item.date_to
        }
    }
    return (
        <>
            <View style={styles.topContainer}>
                {renderLeaveTypeIcons()}
                <View style={styles.rightContainer}>
                    <View style={styles.flexContainer}>
                        <AppLabel
                            style={styles.rightContainerTexts}
                            textType={TEXT_TYPE.SEMI_BOLD}
                            text={item.title}
                        />
                        <AppLabel
                            style={styles.rightContainerTexts}
                            textType={TEXT_TYPE.SEMI_BOLD}
                            text={item.created_at}
                        />
                    </View>
                    <View style={styles.flexContainer}>
                        <AppLabel
                            style={styles.bottomRightItems}
                            textType={TEXT_TYPE.SEMI_BOLD}
                            text={'Date: ' + dateRender()}
                        />
                        <View style={{ flexDirection: 'row' }}>
                            {item.is_half_day === 1 && (
                                <Image
                                    source={require('assets/images/ic_half_day.png')}
                                    style={[
                                        styles.bottomRightItems,
                                        styles.halfDay,
                                    ]}
                                />
                            )}
                            {renderStatusIcons()}
                        </View>
                    </View>
                    <View style={styles.separator} />
                </View>
            </View>
        </>
    )
}
export default ItemRequest
const styles = StyleSheet.create({
    flexContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    topContainer: {
        flexDirection: 'row',
        marginTop: SPACE.md,
        alignItems: 'center',
    },
    halfDay: {
        width: 22,
        height: 22,
        marginRight: SPACE.xs,
    },
    rightContainerTexts: {
        fontSize: FONT_SIZE._3xs,
        color: COLORS.theme?.interface[300],
    },
    bottomRightItems: {
        marginTop: SPACE.md,
        fontSize: FONT_SIZE._3xs,
    },
    separator: {
        borderColor: COLORS.theme?.interface[200],
        borderWidth: 0.5,
        marginTop: SPACE.lg,
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingHorizontal: SPACE.sm,
    },
})
