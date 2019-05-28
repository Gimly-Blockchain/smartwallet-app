import React from 'react'
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export interface DocumentViewToggleProps {
  showingValid: boolean
  handlePress: () => void
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    borderRadius: 4,
  },
  containerValid: {
    backgroundColor: 'rgba(233, 239, 221, 0.57)',
  },
  containerExpired: {
    backgroundColor: 'rgba(255, 222, 188, 0.25)',
  },
  icon: {
    color: 'rgba(5, 5, 13, 0.48)',
    marginRight: 8,
  },
  iconExpired: {
    color: 'rgba(5, 5, 13, 0.48)',
    fontSize: 17,
    fontFamily: JolocomTheme.contentFontFamily,
    fontWeight: 'bold',
    marginRight: 8,
  },
  text: {
    color: 'rgba(5, 5, 13, 0.48)',
    fontSize: 17,
    fontFamily: JolocomTheme.contentFontFamily,
  },
  underline: {
    textDecorationLine: 'underline',
  },
})

export const DocumentViewToggle: React.SFC<DocumentViewToggleProps> = (
  props,
): JSX.Element =>
  props.showingValid ? (
    <TouchableWithoutFeedback onPress={props.handlePress}>
      <View style={[styles.container, styles.containerValid]}>
        <Icon style={styles.icon} size={17} name="check-all" />
        <Text style={styles.text}>
          Showing valid.{' '}
          <Text style={styles.underline}>Tap to show expired.</Text>
        </Text>
      </View>
    </TouchableWithoutFeedback>
  ) : (
    <TouchableWithoutFeedback onPress={props.handlePress}>
      <View style={[styles.container, styles.containerExpired]}>
        <Icon style={styles.icon} size={17} name="alert-circle-outline" />
        <Text style={styles.text}>
          Showing expired.{' '}
          <Text style={styles.underline}>Tap to show valid.</Text>
        </Text>
      </View>
    </TouchableWithoutFeedback>
  )
