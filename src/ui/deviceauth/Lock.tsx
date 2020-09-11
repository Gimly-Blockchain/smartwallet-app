import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  BackHandler,
} from 'react-native'

import { NavigationInjectedProps } from 'react-navigation'

import I18n from 'src/locales/i18n'

import PasscodeInput from './PasscodeInput'
import ScreenContainer from './components/ScreenContainer'
import Header from './components/Header'
import Btn, { BtnTypes } from './components/Btn'

import strings from '../../locales/strings'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers'
import { ThunkDispatch } from 'src/store'
import AbsoluteBottom from './components/AbsoluteBottom'
import { genericActions, navigationActions } from 'src/actions'
import useKeyboardHeight from './hooks/useKeyboardHeight'
import { routeList } from 'src/routeList'


interface LockProps extends
  NavigationInjectedProps,
  ReturnType<typeof mapDispatchToProps>,
  ReturnType<typeof mapStateToProps> {
}

const Lock: React.FC<LockProps> = ({
  navigateTorecoveryInstuction,
  unlockApp,
  navigation,
  isLocked
}) => {
  const [pin, setPin] = useState('')
  const [hasError, setHasError] = useState(false)
  const { keyboardHeight } = useKeyboardHeight()

  useEffect(() => {
    if (pin.length < 4 && hasError) {
      setHasError(false)
    }
  }, [pin])

  /*
  useEffect(() => {
    setTimeout(() => {
      Keyboard.dismiss()
    }, 3000)
  }, [])
  */

  let errorTimeout: number

  useEffect(() => {
    const handleBack = () => {
      if (isLocked && navigation.isFocused()) {
        // don't let react-navigation handle this back button press
        return true;
      } else {
        return false;
      }
    }

    BackHandler.addEventListener('hardwareBackPress', handleBack)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBack)
      if (errorTimeout) clearTimeout(errorTimeout)
    }
  }, [])

  const handleAppUnlock = async () => {
    await unlockApp(pin)
    // unlockApp() should navigate away, if it hasn't then something is wrong.
    // this is in a timeout to not show error immediately
    errorTimeout = setTimeout(() => setHasError(true), 100)
  }

  return (
    <ScreenContainer customStyles={{ justifyContent: 'flex-start' }}>
      <Header customStyles={{ paddingTop: 100 }}>
        {I18n.t(strings.ENTER_YOUR_PIN)}
      </Header>
      <View style={styles.inputContainer}>
        <PasscodeInput
          value={pin}
          stateUpdaterFn={setPin}
          onSubmit={handleAppUnlock}
          hasError={hasError}
          errorStateUpdaterFn={setHasError}
        />
      </View>
      <AbsoluteBottom customStyles={{ bottom: keyboardHeight }}>
        <Btn
          type={BtnTypes.secondary}
          onPress={navigateTorecoveryInstuction}>
          {I18n.t(strings.FORGOT_YOUR_PIN)}
        </Btn>
      </AbsoluteBottom>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
})

const mapStateToProps = (state: RootState) => ({
  isLocked: state.generic.locked
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  unlockApp: (pin: string) => dispatch(genericActions.unlockApp(pin)),
  navigateTorecoveryInstuction: () => {
    dispatch(navigationActions.navigate({ routeName: routeList.HowToChangePIN }))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Lock)
