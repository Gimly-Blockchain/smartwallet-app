import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { fontMain } from '../../../styles/typography'
import { white, yellowError } from '../../../styles/colors'
import { INotification } from '../../../lib/notifications'
import { InteractButton } from './interactButton'
import { CrossNotificationIcon } from '../../../resources'
import { AnyAction } from 'redux'

const styles = StyleSheet.create({
  title: {
    // TODO: replace with TTCommons Medium
    fontFamily: fontMain,
    height: 18,
    fontSize: 18,
    marginHorizontal: 20,
  },
  message: {
    fontFamily: fontMain,
    fontSize: 14,
    color: white,
    marginHorizontal: 20,
    marginTop: 9,
  },
  buttonWrapper: {
    marginHorizontal: 20,
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dismissButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
})

interface Props {
  notification: INotification
  onPressDismiss: () => void | boolean | AnyAction | Promise<void | AnyAction>
  onPressInteract: () => void | boolean | AnyAction | Promise<void | AnyAction>
}

export const NotificationComponent: React.FC<Props> = ({
  notification,
  onPressDismiss,
  onPressInteract,
}) => {
  const isSticky = notification.dismiss && !notification.dismiss.timeout
  const isButtonSection = notification.dismiss || notification.interact

  return (
    <React.Fragment>
      <Text
        style={{
          ...styles.title,
          ...(isSticky && styles.centeredText),
          color: isSticky ? yellowError : white,
        }}
      >
        {notification.title}
      </Text>
      <Text style={{ ...styles.message, ...(isSticky && styles.centeredText) }}>
        {notification.message}
      </Text>
      {!isSticky && isButtonSection && (
        <View style={styles.buttonWrapper}>
          {!notification.dismiss ? (
            <TouchableOpacity
              onPress={onPressDismiss}
              style={styles.dismissButton}
            >
              <CrossNotificationIcon />
            </TouchableOpacity>
          ) : (
            <View />
          )}
          {notification.interact ? (
            <InteractButton
              onPress={onPressInteract}
              label={notification.interact.label}
              notificationType={notification.type}
            />
          ) : (
            <View />
          )}
        </View>
      )}
    </React.Fragment>
  )
}
