import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native'
import Keychain from 'react-native-keychain'

import Header from './components/Header'
import Paragraph, { ParagraphSizes } from './components/Paragraph'
import AbsoluteBottom from './components/AbsoluteBottom'
import Btn, { BtnTypes } from './components/Btn'
import ScreenContainer from './components/ScreenContainer'
import PasscodeInput from './PasscodeInput'
import strings from '../../locales/strings'
import { PIN_USERNAME, PIN_SERVICE } from './utils/keychainConsts'
import BP from './utils/breakpoints'

import LocalModal from './LocalModal'
import { Colors } from './colors'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers'
import { ThunkDispatch } from 'src/store'
import { accountActions } from 'src/actions'

interface PropsI {
  isLocalAuthVisible: boolean
  closeLocalAuth: () => void
}

const RegisterPIN: React.FC<PropsI> = ({
  isLocalAuthVisible,
  closeLocalAuth,
}) => {
  const [isCreating, setIsCreating] = useState(true) // to display create passcode or verify passcode
  const [passcode, setPasscode] = useState('')
  const [verifiedPasscode, setVerifiedPasscode] = useState('')
  const [hasError, setHasError] = useState(false) // to indicate if verifiedPasscode doesn't match passcode

  const handlePasscodeSubmit = useCallback(() => {
    setIsCreating(false)
  }, [])

  const handleVerifiedPasscodeSubmit = async () => {
    if (passcode === verifiedPasscode) {
      try {
        // setting up pin in the keychain
        await Keychain.setGenericPassword(PIN_USERNAME, passcode, {
          service: PIN_SERVICE,
          storage: Keychain.STORAGE_TYPE.AES,
        })
      } catch (err) {
        console.log({ err })
      }

      closeLocalAuth()
    } else {
      setHasError(true)
    }
  }

  const resetPasscode = () => {
    setIsCreating(true)
    setPasscode('')
    setVerifiedPasscode('')
    setHasError(false)
  }

  useEffect(() => {
    if (verifiedPasscode.length < 4 && hasError) {
      setHasError(false)
    }
  }, [verifiedPasscode])

  return (
    <LocalModal isVisible={isLocalAuthVisible}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScreenContainer
          customStyles={{
            justifyContent: 'flex-start',
          }}
        >
          <View>
            <Header color={Colors.white90}>
              {isCreating ? strings.CREATE_PASSCODE : strings.VERIFY_PASSCODE}
            </Header>
            <Paragraph
              color={Colors.white70}
              size={ParagraphSizes.medium}
              customStyles={{ marginHorizontal: 5, opacity: 0.8 }}
            >
              {isCreating
                ? strings.IN_ORDER_TO_PROTECT_YOUR_DATA
                : strings.YOU_WONT_BE_ABLE_TO_EASILY_CHECK_IT_AGAIN}
            </Paragraph>
          </View>
          <View style={styles.passcodeContainer}>
            {isCreating ? (
              <PasscodeInput
                value={passcode}
                stateUpdaterFn={setPasscode}
                onSubmit={handlePasscodeSubmit}
              />
            ) : (
              <PasscodeInput
                value={verifiedPasscode}
                stateUpdaterFn={setVerifiedPasscode}
                onSubmit={handleVerifiedPasscodeSubmit}
                errorStateUpdaterFn={setHasError}
                hasError={hasError}
              />
            )}
          </View>
          {isCreating && (
            <Paragraph
              size={ParagraphSizes.medium}
              color={Colors.success}
              customStyles={{ marginTop: 20 }}
            >
              {strings.ANY_FUTURE_PASSCODE_RESTORE}
            </Paragraph>
          )}
          {hasError && (
            <Paragraph color={Colors.error} customStyles={{ marginTop: 20 }}>
              {strings.PINS_DONT_MATCH}
            </Paragraph>
          )}
          {!isCreating && (
            <AbsoluteBottom customStyles={styles.btn}>
              <Btn type={BtnTypes.secondary} onPress={resetPasscode}>
                {strings.RESET}
              </Btn>
            </AbsoluteBottom>
          )}
        </ScreenContainer>
      </KeyboardAvoidingView>
    </LocalModal>
  )
}

const styles = StyleSheet.create({
  passcodeContainer: {
    marginTop: BP({
      large: '30%',
      medium: '30%',
      small: '10%',
      xsmall: '10%',
    }),
    position: 'relative',
  },
  spinner: {
    position: 'absolute',
    left: '38%',
    top: 100,
  },
  btn: {
    bottom: 0,
  },
})

const mapStateToProps = (state: RootState) => ({
  isLocalAuthVisible: state.account.did.isLocalAuthVisible,
})
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  closeLocalAuth: () => dispatch(accountActions.closeLocalAuth()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPIN)
