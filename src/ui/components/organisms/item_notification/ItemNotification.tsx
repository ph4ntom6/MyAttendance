import { COLORS, FONT_SIZE, SPACE } from 'config'
import Colors from 'config/Colors'
import usePreferredTheme from 'hooks/theme/usePreferredTheme'
import Notification from 'models/Notification'
import React from 'react'
import { StyleSheet, View, Pressable } from 'react-native'
import { timeFromNow } from 'models/DateTime'
import { AppLabel, TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'

type Props = {
    notification: Notification
    navigateToOrder: (orderId: number) => void
}

export const ItemNotification = React.memo<Props>(
    ({ notification, navigateToOrder }) => {
        const { themedColors } = usePreferredTheme()
        return (
            <Pressable
                onPress={() => navigateToOrder(notification.order_id)}
                style={[styles.container]}
            >
                <AppLabel
                    textType={TEXT_TYPE.BOLD}
                    text={notification.title}
                    style={[
                        styles.title,
                        { color: themedColors.interface['900'] },
                    ]}
                />
                <AppLabel
                    numberOfLines={3}
                    text={notification.message}
                    style={[
                        styles.description,
                        { color: themedColors.interface['900'] },
                    ]}
                />
                <AppLabel
                    text={timeFromNow(notification.created_at)}
                    style={[styles.time, { color: Colors.blue2 }]}
                />
                <View style={styles.separator} />
            </Pressable>
        )
    }
)

export const styles = StyleSheet.create({
    container: {
        paddingTop: SPACE.lg,
        paddingRight: SPACE.lg,
        paddingLeft: SPACE.lg,
    },
    title: {
        fontSize: FONT_SIZE.base,
    },
    description: {
        fontSize: FONT_SIZE.sm,
        paddingTop: SPACE.sm,
    },
    time: {
        fontSize: FONT_SIZE.xs,
        paddingTop: SPACE.sm,
    },
    separator: {
        marginTop: SPACE.lg,
        height: 0.5,
        backgroundColor: COLORS.black,
    },
})
