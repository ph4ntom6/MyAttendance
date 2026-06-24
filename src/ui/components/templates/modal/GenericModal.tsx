import React, { FC } from 'react'
import { Modal, StyleSheet, View, ViewProps } from 'react-native'

interface OwnProps extends ViewProps {
    visibility: boolean
    hideSelf?: () => void
}

type Props = OwnProps

export const GenericModal: FC<Props> = ({
    children,
    visibility = false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hideSelf,
}) => {
    return (
        <Modal visible={visibility} animationType="slide" transparent={true}>
            <View style={styles.root}>{children}</View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: 'grey',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        overflow: 'hidden',
        flex: 1,
    },
})
