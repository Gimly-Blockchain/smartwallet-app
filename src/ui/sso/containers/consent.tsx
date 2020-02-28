import React from 'react'
import { connect } from 'react-redux'
import { ConsentComponent } from 'src/ui/sso/components/consent'
import { ssoActions } from 'src/actions'
import { ThunkDispatch } from 'src/store'
import { withLoading, withErrorScreen } from 'src/actions/modifiers'
import {
  CredentialRequestSummary,
  CredentialVerificationSummary,
} from '../../../actions/sso/types'
import { NavigationScreenProp, NavigationState } from 'react-navigation'

interface CredentialRequestNavigationParams {
  interactionId: string
  credentialRequestDetails: CredentialRequestSummary
}

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {
  navigation: NavigationScreenProp<
    NavigationState,
    CredentialRequestNavigationParams
  >
}

const ConsentContainer = (props: Props) => {
  const {
    currentDid,
    sendCredentialResponse,
    cancelSSO,
    navigation: {
      state: {
        params: { interactionId, credentialRequestDetails },
      },
    },
  } = props

  const handleSubmitClaims = (credentials: CredentialVerificationSummary[]) => {
    sendCredentialResponse(
      credentials,
      credentialRequestDetails,
      interactionId,
    )
  }

  const {
    availableCredentials,
    requester,
    callbackURL,
  } = credentialRequestDetails

  return (
    <ConsentComponent
      requester={requester}
      callbackURL={callbackURL}
      did={currentDid}
      availableCredentials={availableCredentials}
      handleSubmitClaims={handleSubmitClaims}
      handleDenySubmit={cancelSSO}
    />
  )
}

const mapStateToProps = (state: any) => ({
  currentDid: state.account.did.did,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  sendCredentialResponse: (
    credentials: CredentialVerificationSummary[],
    credentialRequestDetails: CredentialRequestSummary,
    interactionId: string,
  ) =>
    dispatch(
      withLoading(
        withErrorScreen(
          ssoActions.sendCredentialResponse(
            credentials,
            credentialRequestDetails,
            interactionId,
          ),
        ),
      ),
    ),
  cancelSSO: () => dispatch(ssoActions.cancelSSO),
})

export const Consent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConsentContainer)
