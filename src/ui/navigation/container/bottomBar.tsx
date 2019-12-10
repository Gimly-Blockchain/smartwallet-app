import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  AccessibilityRole,
  AccessibilityState,
  Animated,
  Platform,
  Keyboard,
  EmitterSubscription,
} from 'react-native'
import { BottomTabBarProps, TabScene, SafeAreaView } from 'react-navigation'
import { BottomBarSVG } from '../components/bottomBarSvg'
import { routeList } from '../../../routeList'
import { TabButton } from '../components/tabButton'
import { InteractionButton } from '../components/interactionButton'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
import { navigationActions } from '../../../actions'
import { withLoading } from '../../../actions/modifiers'

const { width } = Dimensions.get('window')

/* Calculation of the bottom bar size and position relative to the original SVG */

// Width and height of the bottom bar original svg
const ORIG_BAR_WIDTH = 414
const ORIG_BAR_HEIGHT = 110
// The visible height of the original bar svg (the difference is the SafeView
// for iOS devices newer than iPhone X
const VISIBLE_ORIGINAL_BAR_HEIGHT = 80
const SCREEN_PROPORTION = width / ORIG_BAR_WIDTH
// Scaled down height of the original visible bar
const VISIBLE_BAR_HEIGHT = SCREEN_PROPORTION * VISIBLE_ORIGINAL_BAR_HEIGHT
// Scaled down height of the whole original bar
const BAR_HEIGHT = SCREEN_PROPORTION * ORIG_BAR_HEIGHT
// Additional "SafeView" for extra large devices e.g. iPhone 11 Pro Max
const BAR_EXTRA_SAFE_HEIGHT = 30

/* Calculation of button size and position proportionally to the original bar */
// Ratio of the original button size relative to the original bar width
const BUTTON_SIZE_MODIFIER = 0.175
const BUTTON_SIZE = BUTTON_SIZE_MODIFIER * width
// Original distance from the center of the button to the top of the bar (vertical offset)
const ORIGINAL_VERTICAL_OFFSET = 16
const VERTICAL_OFFSET = -(
  BUTTON_SIZE / 2 -
  width * (ORIGINAL_VERTICAL_OFFSET / ORIG_BAR_WIDTH)
)

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
    bottom: VISIBLE_BAR_HEIGHT - BAR_HEIGHT - BAR_EXTRA_SAFE_HEIGHT,
    height: BAR_HEIGHT + BAR_EXTRA_SAFE_HEIGHT,
  },
  buttonWrapper: {
    position: 'absolute',
    width: '100%',
    top: 0,
    bottom: 0,
    height: VISIBLE_BAR_HEIGHT,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safeView: {
    width: '100%',
    height: BAR_EXTRA_SAFE_HEIGHT,
    backgroundColor: '#0B030D',
    marginTop: -4,
  },
})

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView)

interface Props
  extends BottomTabBarProps,
    ReturnType<typeof mapDispatchToProps> {
  onTabPress: (scene: TabScene) => null
  onTabLongPress: (scene: TabScene) => null
  getTestID: (scene: TabScene) => string
  getAccessibilityLabel: (scene: TabScene) => string
  getAccessibilityRole: (scene: TabScene) => string
  getAccessibilityStates: (scene: TabScene) => string[]
}

const BottomBarContainer = (props: Props) => {
  const {
    navigation,
    renderIcon,
    onTabPress,
    getLabelText,
    getTestID,
    getAccessibilityLabel,
    getAccessibilityRole,
    getAccessibilityStates,
    navigateInteraction,
    safeAreaInset,
    activeTintColor,
    inactiveTintColor,
  } = props
  const { routes, index } = navigation.state
  const colors = { activeTintColor, inactiveTintColor }

  const [AnimatedHiding] = useState(new Animated.Value(0))

  useEffect(() => {
    AnimatedHiding.setValue(0)

    const blurListener = navigation.addListener('willBlur', animateHiding)
    const focusListener = navigation.addListener('didFocus', animateAppear)

    const isIOS = Platform.OS === 'ios'

    let keyboardShowListener: EmitterSubscription,
      keyboardHideListener: EmitterSubscription

    if (isIOS) {
      keyboardShowListener = Keyboard.addListener(
        'keyboardWillShow',
        animateAppear,
      )
      keyboardHideListener = Keyboard.addListener(
        'keyboardWillHide',
        animateHiding,
      )
    } else {
      keyboardShowListener = Keyboard.addListener(
        'keyboardDidShow',
        animateAppear,
      )
      keyboardHideListener = Keyboard.addListener(
        'keyboardDidHide',
        animateHiding,
      )
    }

    return () => {
      blurListener.remove()
      focusListener.remove()
      keyboardShowListener.remove()
      keyboardHideListener.remove()
    }
  }, [])

  const animateHiding = () => {
    Animated.timing(AnimatedHiding, {
      // NOTE: to account for screens that use SafeAreaView
      toValue: BAR_HEIGHT - 2 * VERTICAL_OFFSET,
      duration: 400,
      useNativeDriver: true,
    }).start()
  }

  const animateAppear = () => {
    Animated.timing(AnimatedHiding, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start()
  }

  return (
    <AnimatedSafeAreaView
      style={[styles.wrapper, { transform: [{ translateY: AnimatedHiding }] }]}
      forceInset={safeAreaInset}
    >
      <View style={[styles.buttonWrapper]}>
        {routes.map((route, i) => {
          const focused = i === index
          const scene = { route, index, focused }
          const label = getLabelText(scene) as string
          const testID = getTestID(scene)
          const accessibility = {
            label: getAccessibilityLabel(scene),
            role: getAccessibilityRole(scene) as AccessibilityRole,
            states: getAccessibilityStates(scene) as AccessibilityState[],
          }

          return (
            <React.Fragment key={route.key}>
              {i === 2 && <View style={{ flex: 1 }} />}
              <TabButton
                testID={testID}
                scene={scene}
                renderIcon={renderIcon}
                onTabPress={() => onTabPress(scene)}
                label={label}
                accessibility={accessibility}
                colors={colors}
              />
            </React.Fragment>
          )
        })}
      </View>
      <InteractionButton
        topMargin={VERTICAL_OFFSET}
        buttonSize={BUTTON_SIZE}
        scale={SCREEN_PROPORTION}
        navigateScanner={navigateInteraction}
      />
      {/* NOTE: the *1.01 is removing the white space between the bar and screen edges */}
      <BottomBarSVG scaledHeight={BAR_HEIGHT * 1.01} />
      <View style={styles.safeView} />
    </AnimatedSafeAreaView>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  navigateInteraction: () =>
    dispatch(
      withLoading(
        navigationActions.navigate({ routeName: routeList.InteractionScreen }),
      ),
    ),
})

export const BottomBar = connect(
  null,
  mapDispatchToProps,
)(BottomBarContainer)
