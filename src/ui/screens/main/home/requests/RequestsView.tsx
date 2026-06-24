import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { COLORS, FONT_SIZE, SPACE, STRINGS } from 'config'
import {
    LeaveItem,
    LeaveRequest,
} from 'models/api_responses/LeaveRequestResponseModel'
import React, { FC, useCallback } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { HomeStackParamList } from 'routes/HomeStack'
import { AppLabel } from 'ui/components/atoms/app_label/AppLabel'
import Screen from 'ui/components/atoms/Screen'
import DateFields from 'ui/components/molecules/date_field/DateFields'
import FlexItems from 'ui/components/molecules/flex_items/FlexItems'
import { FlatListWithPb } from 'ui/components/organisms/flat_list/FlatListWithPb'
import ItemRequest from 'ui/components/organisms/item_request/ItemRequest'

type Props = {
    requestData: LeaveRequest | undefined
    shouldShowProgressBar: boolean
    setDateFields: (startDate: string, endDate: string) => void
    retryCallBack?: () => void
    error?: string
}
export type HomeNavigation = StackNavigationProp<HomeStackParamList, 'Home'>
export const RequestsView: FC<Props> = ({
    requestData,
    shouldShowProgressBar,
    setDateFields,
    retryCallBack,
    error,
}) => {
    const lowerTextArray = ['Total Requests', 'Approved', 'Rejected']
    const navigation = useNavigation<HomeNavigation>()
    const renderItem = useCallback(({ item }: { item: LeaveItem }) => {
        return <ItemRequest item={item} />
    }, [])
    return (
        <Screen style={styles.container} requiresSafeArea={false}>
            <DateFields
                setDateFields={setDateFields}
                isOpenFromRequestView={true}
            />
            <FlexItems
                lowerTextArray={lowerTextArray}
                requestData={requestData}
                isOpenFromRequestView={true}
            />
            <FlatListWithPb
                style={styles.listContainer}
                data={requestData?.records!}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                retryCallback={retryCallBack}
                error={error}
                shouldShowProgressBar={shouldShowProgressBar}
                noRecordFoundText={STRINGS.home.requests.no_record_found}
            />

            <Pressable
                onPress={() => navigation.navigate('NewLeave')}
                style={styles.newLeaveButton}
            >
                <AppLabel
                    text="+ New Leave Request"
                    style={styles.newLeaveText}
                />
            </Pressable>
        </Screen>
    )
}
const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        paddingHorizontal: SPACE.lg,
    },
    container: {
        flex: 1,
    },
    newLeaveButton: {
        backgroundColor: COLORS.theme?.interface[100],
        height: 50,
        alignItems: 'center',
    },
    newLeaveText: {
        color: COLORS.theme?.primaryColor,
        marginTop: SPACE.md,
        fontSize: FONT_SIZE._2xs,
    },
})
