import { navigationActions } from 'src/actions'
import { resetSelected } from '../account'
import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { ThunkAction } from '../../store'
import { IdentitySummary, RequestSummary } from './types'
import { AppError } from '../../lib/errors'
import { generateIdentitySummary } from './utils'
import { JolocomLib } from 'jolocom-lib'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import { routeList } from '../../routeList'
import { requestFormatter } from '../../lib/storage/interactionTokens'
import { navigate } from '../navigation'
import ErrorCode from '../../lib/errorCodes'

/**
 * The function parses the interaction token and returns the respective request summary
 * @param jwt
 */
export const consumeInteractionRequest = (jwt: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const { identityWallet, registry, storageLib } = backendMiddleware
  // TODO Fix
  // The identityWallet is initialised before the deep link is handled. If it
  // is not initialized, then we may not even have an identity.
  if (!identityWallet) {
    return dispatch(
      navigate({
        routeName: routeList.Landing,
      }),
    )
  }

  const requestToken = JolocomLib.parse.interactionToken.fromJWT(jwt)
  await identityWallet.validateJWT(requestToken, undefined, registry)

  const issuer = await registry.resolve(keyIdToDid(requestToken.issuer))
  const requesterSummary = generateIdentitySummary(issuer)

  await storageLib.store.issuerProfile(requesterSummary)

  const formatter = requestFormatter[requestToken.interactionType]

  if (!formatter) {
    throw new AppError(
      ErrorCode.ParseJWTFailed,
      new Error('Could not handle interaction token'),
    )
  }

  // TODO ANY
  return formatter(requestToken, requesterSummary)
}

export const assembleRequestSummary = (
  interactionToken: JSONWebToken<JWTEncodable>,
  requester: IdentitySummary,
): RequestSummary => ({
  request: interactionToken,
  requestJWT: interactionToken.encode(),
  requester,
})

export const cancelSSO: ThunkAction = dispatch => {
  return dispatch(navigationActions.navigatorResetHome())
}

export const cancelReceiving: ThunkAction = dispatch => {
  dispatch(resetSelected())
  return dispatch(navigationActions.navigatorResetHome())
}
