import { consumeInteractionToken } from 'src/actions/sso/consumeInteractionToken'

import React from 'react'
import { connect } from 'react-redux'
import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'

import { ErrorCode, AppError } from 'src/lib/errors'
import { ThunkDispatch } from 'src/store'
import { CloseIcon } from 'src/resources'

import { Wrapper } from 'src/ui/structure'
import { white } from 'src/styles/colors'
import { fontMain, textXXS } from 'src/styles/typography'
import { showErrorScreen } from 'src/actions/generic'

import { ScannerContainer } from './scanner'
import { genericActions, navigationActions } from 'src/actions'

const IS_IOS = Platform.OS === 'ios'

const styles = StyleSheet.create({
  iconWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontFamily: fontMain,
    fontSize: textXXS,
    color: white,
    position: 'absolute',
    bottom: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    NavigationInjectedProps {}

const InteractionContainer = (props: Props) => {
  return (
    <Wrapper dark centered withoutSafeArea withoutStatusBar>
      {IS_IOS && (
        <TouchableOpacity
          onPress={props.navigateHome}
          style={styles.closeButton}>
          <CloseIcon />
        </TouchableOpacity>
      )}
      <ScannerContainer
        navigation={props.navigation}
        consumeToken={props.consumeToken}
        setDisableLock={props.setDisableLock}
      />
    </Wrapper>
  )
}

// TODO: move these ErrorCodes to lib as LibError or something
// in the App we should have just the errors that match user experience
const localNotificationErrors = [
  // AppError: "Wrong QR"
  ErrorCode.ParseJWTFailed,
  // AppError: "Wrong Data"
  ErrorCode.WrongDID,
  ErrorCode.WrongNonce,
  ErrorCode.InvalidSignature,
  ErrorCode.TokenExpired,
]

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  consumeToken: async (jwt: string) => {
    try {
      return dispatch(consumeInteractionToken(jwt))
    } catch (e) {
      if (localNotificationErrors.includes(e.message)) {
        throw e
      } else {
        return dispatch(showErrorScreen(new AppError(ErrorCode.Unknown, e)))
      }
    }
  },
  navigateHome: () => dispatch(navigationActions.navigateBackHome()),
  setDisableLock: (val: boolean) => dispatch(genericActions.setDisableLock(val))
})

export const InteractionScreen = connect(
  null,
  mapDispatchToProps,
)(InteractionContainer)
