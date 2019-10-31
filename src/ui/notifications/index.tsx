import React from 'react'
import { RootState } from '../../reducers'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { ThunkDispatch } from '../../store'
import { TopBarNotification } from './topBarNotification'
import {
  Notification,
  NotificationScope,
} from '../../reducers/notifications/types'

interface WithNotificationsProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

/**
 * Reference implementation of a Notification Manager HOC. It will subscribe to the redux state to receive notifications,
 * and after filtering them, will render a {@link TopBarNotification} for each of them.
 * @typeparam P - The props of the wrapped component / container
 * @param WrappedComponent - Notification bars will render in the top part of the wrapped component passed here
 */

const WithTopBarNotificationHOC = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.ComponentType<P & WithNotificationsProps> => ({
  notifications,
  handleConfirm,
  handleDismiss,
  ...rest
}: WithNotificationsProps & P) => {
  const notification = notifications[0]
  return (
    <View
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      {notification && (
        <TopBarNotification
          notification={notification}
          handleConfirm={handleConfirm}
          handleDismiss={handleDismiss}
        />
      )}
      <WrappedComponent {...(rest as P)} />
    </View>
  )
}
// Only global notifications are rendered here
const mapStateToProps = (state: RootState) => ({
  notifications: state.notifications.filter(
    ({ scope }) => scope === NotificationScope.global,
  ),
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  handleConfirm: (notification: Notification) =>
    dispatch(notification.handleConfirm(notification)),
  handleDismiss: (notification: Notification) =>
    dispatch(notification.handleDismiss(notification)),
})

export const withTopBarNotifications = <T extends object>(
  toWrap: React.ComponentType<T>,
) =>
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(WithTopBarNotificationHOC(toWrap))
