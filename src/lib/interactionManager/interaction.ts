import { CredentialOfferFlow, InteractionChannel } from './credentialOfferFlow'
import { IdentitySummary } from '../../actions/sso/types'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'

class CredentialRequestFlow {
  public handleInteractionToken(token: JSONWebToken<JWTEncodable>) {}
}

type InteractionFlows = CredentialOfferFlow | CredentialRequestFlow

/***
 * - initiated by InteractionManager when an interaction starts
 * - handles the communication channel of the interaction
 * - holds the instance of the particular interaction (e.g. CredentialOffer, Authentication)
 */
export class Interaction {
  public id: string
  private interactionFlow = {
    [InteractionType.CredentialOfferRequest]: CredentialOfferFlow,
    [InteractionType.CredentialRequest]: CredentialRequestFlow,
  }
  public flow: InteractionFlows
  public channel: InteractionChannel
  public issuerSummary: IdentitySummary
  // callbackURL should be here ???

  public constructor(
    channel: InteractionChannel,
    jwt: JSONWebToken<JWTEncodable>,
    issuerSummary: IdentitySummary,
  ) {
    this.flow = new this.interactionFlow[jwt.interactionType](jwt)
    this.channel = channel
    this.issuerSummary = issuerSummary
    this.id = jwt.nonce
  }
}
