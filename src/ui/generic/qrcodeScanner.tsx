import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'
import { Container } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Button } from 'react-native-material-ui'
import { QrScanEvent } from 'src/ui/generic/qrcodeScanner'
import { navigationActions } from 'src/actions'
import I18n from 'src/locales/i18n'
import { LoadingSpinner } from './loadingSpinner'
import strings from '../../locales/strings'
import { JolocomLib } from 'jolocom-lib'
import { interactionHandlers } from '../../lib/storage/interactionTokens'
import { ThunkDispatch } from '../../store'
import { showErrorScreen } from '../../actions/generic'
import { RootState } from '../../reducers'
import { goBack } from '../../actions/navigation'
import { withErrorHandling, withLoading } from '../../actions/modifiers'
import { NavigationNavigateAction } from 'react-navigation'
import { AppError } from '../../lib/errors'
import { toggleLoading } from '../../actions/account'
import ErrorCode from '../../lib/errorCodes'

const QRScanner = require('react-native-qrcode-scanner').default

export interface QrScanEvent {
  data: string
}

interface Props {
  loading: boolean
  onScannerSuccess: (e: QrScanEvent) => Promise<NavigationNavigateAction>
  onScannerCancel: () => typeof goBack
}

interface State {}

const styles = StyleSheet.create({
  buttonText: {
    color: JolocomTheme.primaryColorBlack,
  },
})

export class QRcodeScanner extends React.Component<Props, State> {
  render() {
    const { loading, onScannerSuccess, onScannerCancel } = this.props
    return (
      <React.Fragment>
        {loading && <LoadingSpinner />}
        <Container>
          <QRScanner
            onRead={(e: QrScanEvent) => onScannerSuccess(e)}
            topContent={
              <Text>{I18n.t(strings.YOU_CAN_SCAN_THE_QR_CODE_NOW)}</Text>
            }
            bottomContent={
              <Button
                onPress={onScannerCancel}
                style={{ text: styles.buttonText }}
                text={I18n.t(strings.CANCEL)}
              />
            }
          />
        </Container>
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({
  account: {
    loading: { loading },
  },
}: RootState) => ({
  loading,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  onScannerSuccess: async (e: QrScanEvent) => {
    let interactionToken

    try {
      interactionToken = JolocomLib.parse.interactionToken.fromJWT(e.data)
    } catch (err) {
      return dispatch(
        showErrorScreen(new AppError(ErrorCode.ParseJWTFailed, err)),
      )
    }

    const handler = interactionHandlers[interactionToken.interactionType]

    return handler
      ? dispatch(
          withLoading(toggleLoading)(
            withErrorHandling(showErrorScreen)(handler(interactionToken)),
          ),
        )
      : dispatch(
          showErrorScreen(
            new AppError(ErrorCode.Unknown, new Error('No handler found')),
          ),
        )
  },
  onScannerCancel: () => dispatch(navigationActions.goBack),
})

export const QRScannerContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(QRcodeScanner)
