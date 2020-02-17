import { Linking } from 'react-native'
import { JolocomLib } from 'jolocom-lib'
import { navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { getUiCredentialTypeByType } from 'src/lib/util'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { ThunkAction } from '../../store'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import {
  CredentialRequestSummary,
  CredentialVerificationSummary,
} from './types'
import { AppError, ErrorCode } from 'src/lib/errors'
import { generateIdentitySummary } from './utils'

interface AttributeSummary {
  type: string[]
  results: Array<{
    verification: string
    fieldName: string
    values: string[]
  }>
}

export const consumeCredentialRequest = (
  decodedCredentialRequest: JSONWebToken<CredentialRequest>,
  isDeepLinkInteraction: boolean,
): ThunkAction => async (dispatch, getState, backendMiddleware) => {
  const { storageLib, identityWallet, registry } = backendMiddleware
  const { did } = getState().account.did

  await identityWallet.validateJWT(
    decodedCredentialRequest,
    undefined,
    registry,
  )

  const requester = await registry.resolve(
    keyIdToDid(decodedCredentialRequest.issuer),
  )

  const requesterSummary = generateIdentitySummary(requester)

  const {
    requestedCredentialTypes: requestedTypes,
  } = decodedCredentialRequest.interactionToken

  const attributesForType = await Promise.all<AttributeSummary>(
    requestedTypes.map(storageLib.get.attributesByType),
  )

  const populatedWithCredentials = await Promise.all(
    attributesForType.map(async entry => {
      if (entry.results.length) {
        return Promise.all(
          entry.results.map(async result => ({
            type: getUiCredentialTypeByType(entry.type),
            values: result.values,
            verifications: await storageLib.get.verifiableCredential({
              id: result.verification,
            }),
          })),
        )
      }

      return [
        {
          type: getUiCredentialTypeByType(entry.type),
          values: [],
          verifications: [],
        },
      ]
    }),
  )

  const abbreviated = populatedWithCredentials.map(attribute =>
    attribute.map(entry => ({
      ...entry,
      verifications: entry.verifications.map((vCred: SignedCredential) => ({
        id: vCred.id,
        issuer: {
          did: vCred.issuer,
        },
        selfSigned: vCred.signer.did === did,
        expires: vCred.expires,
      })),
    })),
  )

  const flattened = abbreviated.reduce((acc, val) => acc.concat(val))

  // TODO requester shouldn't be optional
  const credentialRequestDetails = {
    callbackURL: decodedCredentialRequest.interactionToken.callbackURL,
    requester: requesterSummary,
    availableCredentials: flattened,
    requestJWT: decodedCredentialRequest.encode(),
  }

  return dispatch(
    navigationActions.navigate({
      routeName: routeList.Consent,
      params: { isDeepLinkInteraction, credentialRequestDetails },
      key: 'credentialRequest',
    }),
  )
}

export const sendCredentialResponse = (
  selectedCredentials: CredentialVerificationSummary[],
  credentialRequestDetails: CredentialRequestSummary,
  isDeepLinkInteraction: boolean = false,
): ThunkAction => async (dispatch, getState, backendMiddleware) => {
  const { storageLib, keyChainLib, identityWallet } = backendMiddleware
  const { callbackURL, requestJWT } = credentialRequestDetails

  const password = await keyChainLib.getPassword()
  const request = JolocomLib.parse.interactionToken.fromJWT(requestJWT)

  const credentials = await Promise.all(
    selectedCredentials.map(
      async cred =>
        (await storageLib.get.verifiableCredential({ id: cred.id }))[0],
    ),
  )

  const jsonCredentials = credentials.map(cred => cred.toJSON())

  const response = await identityWallet.create.interactionTokens.response.share(
    {
      callbackURL,
      suppliedCredentials: jsonCredentials,
    },
    password,
    request,
  )

  if (isDeepLinkInteraction) {
    const callback = `${callbackURL}${response.encode()}`
    if (!(await Linking.canOpenURL(callback))) {
      throw new AppError(ErrorCode.DeepLinkUrlNotFound)
    }

    return Linking.openURL(callback).then(() => dispatch(cancelSSO))
  }
  await fetch(callbackURL, {
    method: 'POST',
    body: JSON.stringify({ token: response.encode() }),
    headers: { 'Content-Type': 'application/json' },
  })
  dispatch(cancelSSO)
}

export const cancelSSO: ThunkAction = dispatch => {
  return dispatch(navigationActions.navigatorResetHome())
}
