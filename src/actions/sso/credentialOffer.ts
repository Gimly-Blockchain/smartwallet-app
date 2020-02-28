import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { ThunkAction } from '../../store'
import { navigationActions } from '../index'
import { routeList } from '../../routeList'
import { setClaimsForDid } from '../account'
import { checkRecoverySetup } from '../notifications/checkRecoverySetup'
import { createInfoNotification, Notification } from '../../lib/notifications'
import { scheduleNotification } from '../notifications'
import I18n from 'src/locales/i18n'
import strings from '../../locales/strings'
import { CredentialOfferFlow } from '../../lib/interactionManager/credentialOfferFlow'
import {
  CredentialOffering,
  InteractionChannel,
} from '../../lib/interactionManager/types'

export const consumeCredentialOfferRequest = (
  credentialOfferRequest: JSONWebToken<CredentialOfferRequest>,
  interactionChannel: InteractionChannel,
): ThunkAction => async (dispatch, getState, { interactionManager }) => {
  const interaction = await interactionManager.start(
    interactionChannel,
    credentialOfferRequest,
  )

  await interaction.handleInteractionToken(credentialOfferRequest)
  return dispatch(
    navigationActions.navigate({
      routeName: routeList.CredentialReceive,
      params: { interactionId: credentialOfferRequest.nonce, credentialOfferingSummary: interaction.getState()},
    }),
  )
}

export const consumeCredentialReceive = (
  selectedCredentialOffering: CredentialOffering[],
  interactionId: string,
): ThunkAction => async (dispatch, getState, { interactionManager }) => {
  const interactionFlow = interactionManager.getInteraction(interactionId).getFlow<CredentialOfferFlow>()

  await interactionFlow.createCredentialResponseToken(
    selectedCredentialOffering,
  )

  await interactionFlow.sendCredentialResponse()
  return dispatch(validateReceivedCredentials(interactionId))
}

const validateReceivedCredentials = (
  interactionId: string,
): ThunkAction => async (dispatch, getState, { interactionManager }) => {
  const currentDid = getState().account.did.did

  const interactionFlow = interactionManager
    .getInteraction(interactionId)
    .getFlow<CredentialOfferFlow>()

  await interactionFlow.validateOfferingDigestable()
  await interactionFlow.verifyCredentialStored()
  interactionFlow.verifyCredentialSubject(currentDid)

  const offeringValidity = interactionFlow.credentialOfferingState.map(
    offering => offering.valid,
  )

  const allInvalid = !offeringValidity.includes(true)
  const someInvalid = offeringValidity.includes(false)

  const scheduleInvalidNotification = (message: string) =>
    dispatch(
      scheduleNotification(
        createInfoNotification({
          title: I18n.t(strings.AWKWARD),
          message,
        }),
      ),
    )

  if (allInvalid) {
    scheduleInvalidNotification(I18n.t(strings.IT_SEEMS_LIKE_WE_CANT_DO_THIS))
    return dispatch(endReceiving(interactionId))
  }

  if (someInvalid) {
    scheduleInvalidNotification(
      I18n.t(strings.SOMETHING_WENT_WRONG_CHOOSE_AGAIN),
    )

    return dispatch(
      navigationActions.navigate({
        routeName: routeList.CredentialReceiveInvalid,
        params: { interactionId },
      }),
    )
  }

  return dispatch(saveCredentialOffer(interactionId))
}

export const saveCredentialOffer = (
  interactionId: string,
): ThunkAction => async (dispatch, getState, { interactionManager }) => {
  const interactionFlow = interactionManager
    .getInteraction(interactionId)
    .getFlow<CredentialOfferFlow>()

  await interactionFlow.storeOfferedCredentials()
  await interactionFlow.storeOfferMetadata()
  await interactionFlow.storeIssuerProfile()

  dispatch(checkRecoverySetup)
  //TODO @mnzaki can we avoid running the FULL setClaimsForDid
  dispatch(setClaimsForDid)

  const notification: Notification = createInfoNotification({
    title: I18n.t(strings.GREAT_SUCCESS),
    message: I18n.t(strings.YOU_CAN_FIND_YOUR_NEW_CREDENTIAL_IN_THE_DOCUMENTS),
    interact: {
      label: I18n.t(strings.OPEN),
      onInteract: () => {
        dispatch(navigationActions.navigate({ routeName: routeList.Documents }))
      },
    },
  })

  dispatch(scheduleNotification(notification))
  return dispatch(endReceiving(interactionId))
}

const endReceiving = (interactionId: string): ThunkAction => (
  dispatch,
  getState,
  { interactionManager },
) => {
  const interaction = interactionManager.getInteraction(interactionId)
  const { channel } = interaction

  if (channel === InteractionChannel.Deeplink) {
    //TODO @clauxx handle deeplink properly
    return dispatch(navigationActions.navigatorResetHome())
  } else {
    return dispatch(
      navigationActions.navigate({ routeName: routeList.InteractionScreen }),
    )
  }
}
