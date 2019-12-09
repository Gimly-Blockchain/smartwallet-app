import React, { useState } from 'react'
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { ScanIcon } from '../../../resources'

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  circle: {
    borderRadius: 35,
  },
  gradient: {
    flex: 1,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

interface Props {
  navigateScanner: () => void
}

/**
 * NOTE: scaling down the button proportionally to the SVG bar and aligning it
 */
const ORIG_SIZE = 414
const SCREEN_SIZE_MODIFIER = width / ORIG_SIZE
const BUTTON_SIZE_MODIFIER = 0.175
const BUTTON_OFFSET_MODIFIER = 16 / ORIG_SIZE

const BUTTON_SIZE = BUTTON_SIZE_MODIFIER * width
const BUTTON_VERTICAL_ALIGN = -(
  BUTTON_SIZE / 2 -
  width * BUTTON_OFFSET_MODIFIER
)

export const InteractionButton = (props: Props) => {
  const { navigateScanner } = props
  const [scaleAnimationValue] = useState(new Animated.Value(1))

  const onScannerStart = () => {
    Animated.timing(scaleAnimationValue, {
      duration: 80,
      toValue: 0.8,
    }).start(() => {
      navigateScanner()
      Animated.timing(scaleAnimationValue, {
        duration: 80,
        toValue: 1,
      }).start()
    })
  }

  return (
    <View style={{ position: 'absolute', width: '100%', alignItems: 'center' }}>
      <Animated.View
        style={{
          ...styles.circle,
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          top: BUTTON_VERTICAL_ALIGN,
          zIndex: 2,
          transform: [{ scale: scaleAnimationValue }],
        }}
      >
        <TouchableOpacity
          onPress={onScannerStart}
          activeOpacity={1}
          style={{ flex: 1 }}
        >
          <LinearGradient
            style={styles.gradient}
            colors={['rgb(210, 45, 105)', 'rgb(145, 25, 66)']}
          >
            <View style={{ transform: [{ scale: SCREEN_SIZE_MODIFIER }] }}>
              <ScanIcon />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}
