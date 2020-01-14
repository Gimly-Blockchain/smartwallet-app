import React from 'react'
import {
  LayoutChangeEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { fontMain } from '../../../styles/typography'
import { white, yellowError } from '../../../styles/colors'
import { Notification } from '../../../lib/notifications'
import { InteractButton } from './interactButton'
import { AnyAction } from 'redux'
import { BP } from '../../../styles/breakpoints'

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  bottomPadding: {
    paddingBottom: BP({
      small: 12,
      medium: 12,
      large: 15,
    }),
  },
  title: {
    // TODO: replace with TTCommons Medium
    fontFamily: fontMain,
    fontSize: BP({
      small: 16,
      medium: 16,
      large: 18,
    }),
    marginTop: BP({
      small: 12,
      medium: 16,
      large: 20,
    }),
    marginHorizontal: 20,
  },
  message: {
    fontFamily: fontMain,
    fontSize: BP({
      small: 12,
      medium: 12,
      large: 14,
    }),
    color: white,
    marginHorizontal: 20,
    marginTop: 8,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  notification: Notification
  onPressDismiss: () => void | boolean | AnyAction | Promise<void | AnyAction>
  onPressInteract: () => void | boolean | AnyAction | Promise<void | AnyAction>
  isSticky: boolean | undefined
  onButtonLayout?: (event: LayoutChangeEvent) => void
}

export const NotificationComponent: React.FC<Props> = ({
  notification,
  onPressInteract,
  isSticky,
  onButtonLayout,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity
        activeOpacity={isSticky ? 0.7 : 1}
        {...((isSticky || !notification.interact) && {
          style: styles.bottomPadding,
        })}
        {...(isSticky && { onPress: onPressInteract })}
      >
        <Text
          style={{
            ...styles.title,
            ...(isSticky && styles.centeredText),
            color: isSticky ? yellowError : white,
          }}
        >
          {notification.title}
        </Text>
        <Text
          style={{ ...styles.message, ...(isSticky && styles.centeredText) }}
        >
          {notification.message}
        </Text>
        {!isSticky && notification.interact && (
          <View style={styles.buttonWrapper}>
            {notification.interact && (
              <InteractButton
                onPress={onPressInteract}
                label={notification.interact.label}
                notificationType={notification.type}
                onLayout={onButtonLayout}
              />
            )}
          </View>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  )
}
