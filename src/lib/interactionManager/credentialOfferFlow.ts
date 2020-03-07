import {
  JSONWebToken, JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { SignedCredentialWithMetadata } from './types'
import { Interaction } from './interaction'
import { CredentialOfferResponse } from 'jolocom-lib/js/interactionTokens/credentialOfferResponse'
import { Flow } from './flow'
import { last } from 'ramda'

type ValidationErrorMap = {
  invalidIssuer?: boolean
  invalidSubject?: boolean
}

export type OfferWithValidity = SignedCredentialWithMetadata & {
  validationErrors: ValidationErrorMap
}

export class CredentialOfferFlow extends Flow {
  public credentialOfferingState: OfferWithValidity[] = []
  public constructor(ctx: Interaction) {
    super(ctx)
  }

  public getState() {
    return this.credentialOfferingState
  }

  // TODO Go back to JSONWebToken<JWTEncodable> and use guard functions when casting
  public async handleInteractionToken(
    token: JSONWebToken<JWTEncodable>,
  ): Promise<any> {
    // TODO Push once all is good FIX
    this.tokens.push(token)
    switch (token.interactionType) {
      case InteractionType.CredentialOfferRequest:
        return this.handleOfferRequest(token as JSONWebToken<CredentialOfferRequest>)
      case InteractionType.CredentialOfferResponse:
        return this.handleOfferResponse(token as JSONWebToken<CredentialOfferResponse>)
      case InteractionType.CredentialsReceive:
        return this.handleCredentialReceive(token as JSONWebToken<CredentialsReceive>)
      default:
        throw new Error('Interaction type not found')
    }
  }

  private handleOfferRequest({ interactionToken }: JSONWebToken<CredentialOfferRequest>) {
    const { offeredCredentials } = interactionToken
    this.credentialOfferingState = offeredCredentials.map(offer => ({ ...offer, validationErrors: {} }))
  }

  private async handleOfferResponse(
    token: JSONWebToken<CredentialOfferResponse>,
  ) {
  // TODO Lift this to the base class? Perhaps it can later be composed with a function to prepare the response
    const credentialsReceive = await this.ctx.send<CredentialsReceive>(token)
    return this.handleInteractionToken(credentialsReceive)
  }

  // Sets the validity map, currently if the issuer and if the subjects are correct.
  // also populates the SignedCredentialWithMetadata with credentials
  private handleCredentialReceive(token: JSONWebToken<CredentialsReceive>) {

  // This actually cares about the credentials the user selected
  // TODO parse from previous messages or extend the flow state
  const { signedCredentials } = token.interactionToken
  this.credentialOfferingState = signedCredentials.map(signedCredential => {
    // TODO Should this throw or signal through the validitySummary?
    const offer = this.credentialOfferingState
      .find(({type}) => type === last(signedCredential.type))

    if (!offer) {
      throw new Error('Received wrong credentials')
    }

    return {
      ...offer,
      signedCredential,
      validationErrors: {
        // This signals funny things in the flow without throwing errors. We don't simply throw because often times
        // negotiation is still possible on the UI / UX layer, and the interaction can continue.
        invalidIssuer: signedCredential.issuer !== this.ctx.issuerSummary.did,
        invalidSubject: signedCredential.subject !== this.ctx.ctx.identityWallet.did // TODO FIXME Too many ctx.
      }
    }
  })
  }
}
