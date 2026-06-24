import { AppLog, TAG } from '../utils/Util';
import { useCallback, useContext, useState } from 'react';
import { PushNotificationContext } from '../hooks/usePushNotificationContextToNavigate';
import { AppDataContext } from '../repo/AppDataProvider';

enum NotificationType {
  GENERAL = 'general',
}

type NotificationData = {
  type: NotificationType;
  orderId: number;
  venueId: number;
};

export const toNotificationData = (notificationPayload: any) => {
  return {
    type: notificationPayload.type,
    orderId: notificationPayload.data.order.id,
    venueId: notificationPayload.data.order.establishment_id,
  };
};

const useNotification = () => {
  const { notificationCount, setNotificationCount } =
    useContext(AppDataContext);
  const [data, setData] = useState<PushNotificationContext>({
    screenName: 'Home',
  });

  function handleNotification(notification: NotificationData) {
    AppLog.log(() => `notification data: ${notification}`, TAG.NOTIFICATION);

    switch (notification.type) {
      case NotificationType.GENERAL:
        setData({
          screenName: 'Order',
          params: { orderId: notification.orderId },
        });
        break;
    }
  }

  const addCount = useCallback(
    (notification: NotificationData) => {
      if (
        notificationCount !== undefined &&
        notificationCount.venueId === notification.venueId
      ) {
        setNotificationCount(prevState => {
          return {
            ...prevState!!,
            notificationCount: prevState!!.notificationCount + 1,
          };
        });
      }
    },
    [notificationCount, setNotificationCount],
  );

  return {
    notificationCount,
    setNotificationCount,
    data,
    handleNotification,
    addCount,
  };
};

export default useNotification;
