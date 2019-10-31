import {
  CLEAR_NOTIFICATIONS,
  InfoNotification,
  Notification,
  NotificationMessage,
  NotificationSeverity,
  NotificationTypes,
  REMOVE_NOTIFICATION,
  SCHEDULE_NOTIFICATION,
} from '../../reducers/notifications'
import { randomBytes } from 'crypto'

export const removeNotification = (notification: Notification) => ({
  type: REMOVE_NOTIFICATION,
  value: notification,
})

export const scheduleNotification = (notification: Notification) => ({
  type: SCHEDULE_NOTIFICATION,
  value: notification,
})

export const clearAllNotifications = () => ({
  type: CLEAR_NOTIFICATIONS,
})

export const infoNotification = (
  message: NotificationMessage,
  severity: NotificationSeverity = NotificationSeverity.medium,
): InfoNotification => ({
  uid: randomBytes(4).toString('hex'), // TODO abstract
  type: NotificationTypes.info,
  message,
  severity,
  dismissible: true,
  onClose: removeNotification,
  onConfirm: removeNotification,
})
