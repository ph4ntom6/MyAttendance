import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FC, useLayoutEffect, useState } from 'react'
import LeftArrow from 'assets/images/left.svg'
import { HomeStackParamList } from 'routes/HomeStack'
import HeaderLeftTextWithIcon from 'ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon'
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle'
import { AttendanceDetailView } from './AttendanceDetailView'
import AppPopUpWithActionsButton from 'ui/components/organisms/app_popup/AppPopUpWithActionsButton'
import HeaderRightTextWithIcon from 'ui/components/headers/header_right_text_with_icon/HeaderRightTextWithIcon'
import { Image, StyleSheet, ActivityIndicator } from 'react-native'
import { COLORS, STRINGS } from 'config'
import { useGeneralApis } from 'repo/general/GeneralApis'
import { usePreventDoubleTap } from 'hooks'
import SimpleToast from 'react-native-simple-toast'
import { useAppSelector } from 'hooks/redux'
import { RootState } from 'stores/store'
import useSaveImageGallery from 'hooks/useSaveImageGallery'

type Props = {}

export type HomeNavigation = StackNavigationProp<
    HomeStackParamList,
    'AttendanceDetail'
>
type AttendanceDetailRouteProp = RouteProp<
    HomeStackParamList,
    'AttendanceDetail'
>

const AttendanceDetailController: FC<Props> = () => {
    const navigation = useNavigation<HomeNavigation>()
    const { user } = useAppSelector((state: RootState) => state.auth)
    const route = useRoute<AttendanceDetailRouteProp>()
    const [showSignoutDialog, setShowSignoutDialog] = useState<boolean>(false)
    const [profilePictureDialog, setProfilePictureDialog] =
        useState<boolean>(false)
    const [downloadDialog, setDownloadDialog] = useState<boolean>(false)
    const [ImgUrl, setImageUrl] = useState<string>('')
    const [message, setMessage] = useState<string>()
    const [imageSaveLoading, setImageSaveLoading] = useState<boolean>(false)
    const { request: setProfilePicture, loading } =
        useGeneralApis().setProfilePicture
    const { saveImage } = useSaveImageGallery()
    const onHandleProfile = usePreventDoubleTap(
        async (isPunchOutSelected: boolean) => {
            let attendance_id
            if (route.params.item.punch_out_id) {
                attendance_id = isPunchOutSelected
                    ? route.params.item.punch_in_id
                    : route.params.item.punch_out_id
            } else {
                attendance_id = route.params.item.punch_in_id
            }
            const { hasError, dataBody, errorBody } = await setProfilePicture({
                email: user?.email!,
                attendance_id: attendance_id,
            })
            if (hasError && dataBody === undefined) {
                SimpleToast.show(
                    errorBody ?? STRINGS.common.some_thing_bad_happened
                )
            } else {
                setMessage(dataBody.messages[0])
                setProfilePictureDialog(true)
            }
        }
    )
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderLeftTextWithIcon
                    icon={() => <LeftArrow width={18} height={18} />}
                    onPress={() => {
                        navigation.goBack()
                    }}
                />
            ),
            headerTitle: () => (
                <HeaderTitle
                    text={route.params.item?.date!}
                    shouldTruncate={false}
                />
            ),
            headerRight: () => (
                <HeaderRightTextWithIcon
                    icon={() => (
                        <>
                            {imageSaveLoading ? (
                                <ActivityIndicator
                                    size={'small'}
                                    color={COLORS.theme?.primaryColor}
                                />
                            ) : (
                                <Image
                                    source={require('assets/images/save.png')}
                                    style={styles.icon}
                                />
                            )}
                        </>
                    )}
                    onPress={() => setShowSignoutDialog(true)}
                />
            ),
        })
    }, [imageSaveLoading, navigation, route.params.item])

    return (
        <>
            <AttendanceDetailView
                onHandleProfile={onHandleProfile}
                item={route?.params?.item!}
                shouldSetProfilePicture={loading}
                onSave={setImageUrl}
            />
            <AppPopUpWithActionsButton
                isVisible={showSignoutDialog}
                title={STRINGS.puchInAndOut.save_photo}
                message={STRINGS.puchInAndOut.save_picture}
                actions={[
                    {
                        title: 'Cancel',
                        onPress: () => setShowSignoutDialog(false),
                    },
                    {
                        title: 'Yes, Confirm',
                        onPress: () =>
                            saveImage(
                                setShowSignoutDialog,
                                ImgUrl,
                                setDownloadDialog,
                                setImageSaveLoading
                            ),
                    },
                ]}
            />
            <AppPopUpWithActionsButton
                isVisible={profilePictureDialog}
                message={message}
                actions={[
                    {
                        title: 'OK',
                        onPress: () => setProfilePictureDialog(false),
                    },
                ]}
            />
            <AppPopUpWithActionsButton
                isVisible={downloadDialog}
                message={STRINGS.puchInAndOut.saveDiaglog}
                actions={[
                    {
                        title: 'OK',
                        onPress: () => setDownloadDialog(false),
                    },
                ]}
            />
        </>
    )
}
const styles = StyleSheet.create({
    icon: {
        height: 25,
        width: 25,
        tintColor: COLORS.theme?.primaryColor,
    },
})
export default AttendanceDetailController
