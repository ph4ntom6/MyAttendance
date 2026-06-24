import { COLORS, FONT_SIZE, SPACE } from 'config'
import { AttendenceItem } from 'models/api_responses/AttendanceApiResponseModel'
import ELeaveType from 'models/enums/ELeaveType'
import React, { FC, useState } from 'react'
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native'
import { AppLabel, TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
// import HelpIcon from 'assets/images/help-icon.svg'

type Props = {
    item: AttendenceItem
    index: number
    lastIndex: number
}
    const ItemAttendance: FC<Props> = ({ item, index, lastIndex }) => {
    const [onLoadImage, setOnloadImage] = useState(false)
    const renderLocationImage = () => {
         return (
             <Image
                 source={require('assets/images/ic_location.png')}
                 style={styles.locationStyle}
             />
         )
    }

      const renderImage = () => {
         return (
             <View>
                 {item.punch_out_id
                     ? item.location_flag_punch_out === 1 &&
                       renderLocationImage()
                     : item.location_flag === 1 && renderLocationImage()}
                 {item?.leave?.name === ELeaveType.EARLY_OFF ||
                 item?.leave?.name === ELeaveType.BIRTHDAY ||
                 item?.leave?.name === ELeaveType.URGENT ? (
                     <HelpIcon height={55} width={55} />
                 ) : (
                     <>
                         <Image
                             source={{
                                 uri:
                                     item?.type === ELeaveType.ATTENDANCE
                                         ? item.punch_out_id !== null
                                             ? item?.punch_out_img['2x']
                                             : item?.punch_in_img['2x']
                                         : item?.leave?.image_url['2x'],
                             }}
                             onLoadEnd={() => {
                                 setOnloadImage(false)
                             }}
                             onLoadStart={() => {
                                 setOnloadImage(true)
                             }}
                             resizeMode={'cover'}
                             style={{ width: 55, height: 55 }}
                         />

                         <ActivityIndicator
                             size={'small'}
                             animating={onLoadImage}
                             color={COLORS.theme?.primaryColor}
                             style={styles.activityIndicator}
                         />
                     </>
                 )}
             </View>
         )
      }

    return (
        <>
            <View style={styles.topContainer}>
                {/* {renderImage()} */}
                <View style={styles.rightContainer}>
                    <AppLabel
                        style={{ fontSize: FONT_SIZE._3xs }}
                        textType={TEXT_TYPE.SEMI_BOLD}
                        text={item.date_formatted}
                    />

                    <View style={styles.bottomContainer}>
                        {item?.type === ELeaveType.ATTENDANCE ? (
                            <>
                                <View style={styles.iconContainer}>
                                    <Image
                                        source={require('assets/images/icon_punch_in.png')}
                                        style={styles.iconsStyle}
                                    />
                                    <AppLabel
                                        style={styles.times}
                                        text={item?.in_time}
                                    />
                                </View>
                                <View style={styles.iconContainer}>
                                    <Image
                                        source={require('assets/images/icon_punch_out.png')}
                                        style={styles.iconsStyle}
                                    />
                                    <AppLabel
                                        style={styles.times}
                                        text={item?.out_time}
                                    />
                                </View>
                                <View style={styles.iconContainer}>
                                    <Image
                                        source={require('assets/images/punch_in_out.png')}
                                        style={styles.iconsStyle}
                                    />
                                    <AppLabel
                                        style={styles.times}
                                        text={item?.working_hours}
                                    />
                                </View>
                            </>
                        ) : item?.leave?.name ? (
                            <AppLabel
                                text={
                                    item.type === ELeaveType.HOLIDAY
                                        ? `Holiday: ${item?.leave?.name}`
                                        : `Absent: ${item?.leave?.name}`
                                }
                                style={{ fontSize: FONT_SIZE._3xs }}
                            />
                        ) : (
                            <AppLabel
                                text={'N/A'}
                                style={{ fontSize: FONT_SIZE._3xs }}
                            />
                        )}
                    </View>

                    {index !== lastIndex && <View style={styles.separator} />}
                </View>
            </View>
        </>
    )
}
export default ItemAttendance
const styles = StyleSheet.create({
    topContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: SPACE.md,
        justifyContent: 'center',
    },
    iconsStyle: {
        width: 17,
        height: 17,
        tintColor: COLORS.theme?.interface[500],
        marginEnd: SPACE.xs,
    },
    times: {
        fontSize: FONT_SIZE._2xs,
    },
    separator: {
        borderColor: COLORS.theme?.interface[200],
        borderWidth: 0.5,
        marginTop: SPACE.lg,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACE._2md,
    },
    rightContainer: {
        flex: 1,
        paddingHorizontal: SPACE.sm,
        justifyContent: 'center',
    },
    locationStyle: {
        width: 15,
        height: 15,
        position: 'absolute',
        zIndex: 1,
        top: 0,
        right: 0,
    },
    activityIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
})
