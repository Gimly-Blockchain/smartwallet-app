import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import {
  CredentialOffer,
  CredentialOfferResponseSelection,
} from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { CredentialOfferResponse } from 'jolocom-lib/js/interactionTokens/credentialOfferResponse'
import { httpAgent } from '../http'
import { JolocomLib } from 'jolocom-lib'
import { isNil, uniqBy } from 'ramda'
import { Interaction } from './interaction'
import { CredentialMetadataSummary } from '../storage/storage'
import { InteractionManager } from './interactionManager'

export enum InteractionChannel {
  QR = 'QR',
  Deeplink = 'Deeplink',
}

export interface CredentialOffering extends CredentialOffer {
  credential?: SignedCredential
  valid: boolean
}

export class CredentialOfferFlow {
  public interactionManager: InteractionManager
  public interaction: Interaction

  public tokens: Array<JSONWebToken<JWTEncodable>> = []
  public credentialOfferingState: CredentialOffering[] = []
  public callbackURL: string

  public constructor(
    manager: InteractionManager,
    credentialOfferRequest: JSONWebToken<CredentialOfferRequest>,
  ) {
    this.interactionManager = manager
    this.interaction = manager.getInteraction(credentialOfferRequest.nonce)
    this.callbackURL = credentialOfferRequest.interactionToken.callbackURL
    this.handleInteractionToken(credentialOfferRequest)
  }

  public getToken<T extends JWTEncodable>(type: InteractionType) {
    const token = this.tokens.find(token => token.interactionType === type)
    if (!token) throw new Error('Token not found')

    // TODO fix type casting
    return token as JSONWebToken<T>
  }

  public handleInteractionToken(token: JSONWebToken<JWTEncodable>) {
    switch (token.interactionType) {
      case InteractionType.CredentialOfferRequest:
        this.consumeOfferRequest(token)
        break
      case InteractionType.CredentialOfferResponse:
        break
      case InteractionType.CredentialsReceive:
        this.consumeCredentialReceive(token)
        break
      default:
        throw new Error('Interaction type not found')
    }
    this.tokens.push(token)
  }

  public consumeOfferRequest(token: JSONWebToken<JWTEncodable>) {
    const credOfferRequest = token as JSONWebToken<CredentialOfferRequest>
    this.setOffering(_ =>
      credOfferRequest.interactionToken.offeredCredentials.map(offer => ({
        ...offer,
        valid: true,
      })),
    )
  }

  public consumeCredentialReceive(token: JSONWebToken<JWTEncodable>) {
    const credentialsReceive = token as JSONWebToken<CredentialsReceive>
    this.updateOfferingWithCredentials(
      credentialsReceive.interactionToken.signedCredentials,
    )
  }

  public updateOfferingWithCredentials = (credentials: SignedCredential[]) => {
    this.setOffering(offeringState =>
      credentials.map(credential => {
        const type = credential.type[credential.type.length - 1]
        const offering = offeringState.find(offering => offering.type === type)
        if (!offering) {
          throw new Error('Received wrong credentials')
        }
        return {
          ...offering,
          credential,
        }
      }),
    )
  }

  public setOffering(
    factory: (state: CredentialOffering[]) => CredentialOffering[],
  ) {
    this.credentialOfferingState = factory(this.credentialOfferingState)
    return this.credentialOfferingState
  }

  public async createCredentialResponseToken(
    selectedOffering: CredentialOffering[],
  ) {
    const credentialOfferRequest = this.getToken<CredentialOfferRequest>(
      InteractionType.CredentialOfferRequest,
    )
    const { callbackURL } = credentialOfferRequest.interactionToken
    const password = await this.interactionManager.backendMiddleware.keyChainLib.getPassword()

    // NOTE not returning providedInput since it's not used
    const selectedTypes: CredentialOfferResponseSelection[] = selectedOffering.map(
      offer => ({ type: offer.type }),
    )
    const credOfferResponse = await this.interactionManager.backendMiddleware.identityWallet.create.interactionTokens.response.offer(
      { callbackURL, selectedCredentials: selectedTypes },
      password,
      this.getToken(InteractionType.CredentialOfferRequest),
    )
    this.handleInteractionToken(credOfferResponse)
    return credOfferResponse
  }

  public async sendCredentialResponse() {
    const credentialOfferResponse = this.getToken<CredentialOfferResponse>(
      InteractionType.CredentialOfferResponse,
    )

    const res = await httpAgent.postRequest<{ token: string }>(
      this.callbackURL,
      { 'Content-Type': 'application/json' },
      { token: credentialOfferResponse.encode() },
    )
    const credentialsReceive = JolocomLib.parse.interactionToken.fromJWT<
      CredentialsReceive
    >(res.token)

    await this.interactionManager.backendMiddleware.identityWallet.validateJWT(
      credentialsReceive,
    )

    this.handleInteractionToken(credentialsReceive)

    return credentialsReceive
  }

  public async validateOfferingDigestable() {
    const validatedOffering = await Promise.all(
      this.credentialOfferingState.map(async offering => {
        let valid
        if (isNil(offering.credential)) {
          valid = false
        } else {
          valid = await JolocomLib.util.validateDigestable(offering.credential)
        }
        return {
          ...offering,
          valid,
        }
      }),
    )
    this.setOffering(_ => validatedOffering)
  }

  public async verifyCredentialStored() {
    const verifiedOffering = await Promise.all(
      this.credentialOfferingState.map(async offering => {
        let valid
        if (isNil(offering.credential)) {
          valid = false
        } else {
          const storedCredential = await this.interactionManager.backendMiddleware.storageLib.get.verifiableCredential(
            {
              id: offering.credential.id,
            },
          )
          valid = !storedCredential.length
        }
        return {
          ...offering,
          valid,
        }
      }),
    )
    this.setOffering(_ => verifiedOffering)
  }

  public verifyCredentialSubject(did: string) {
    this.setOffering(offering =>
      offering.map(offer => {
        let valid
        if (isNil(offer.credential)) {
          valid = false
        } else {
          valid = offer.credential.subject === did
        }
        return {
          ...offer,
          valid,
        }
      }),
    )
  }

  public async storeOfferedCredentials() {
    this.credentialOfferingState.map(async offering => {
      if (offering.credential) {
        const credential = offering.credential
        await this.interactionManager.backendMiddleware.storageLib.delete.verifiableCredential(
          credential.id,
        )
        await this.interactionManager.backendMiddleware.storageLib.store.verifiableCredential(
          credential,
        )
      }
    })
  }

  public async storeOfferMetadata() {
    const { issuerSummary } = this.interaction
    const offerCredentialDetails: CredentialMetadataSummary[] = this.credentialOfferingState.map(
      ({ type, renderInfo, metadata }) => ({
        issuer: {
          did: issuerSummary.did,
        },
        type,
        renderInfo: renderInfo || {},
        metadata: metadata || {},
      }),
    )

    if (offerCredentialDetails) {
      const uniqCredentialDetails = uniqBy(
        detail => `${detail.issuer.did}${detail.type}`,
        offerCredentialDetails,
      )

      await Promise.all(
        uniqCredentialDetails.map(
          this.interactionManager.backendMiddleware.storageLib.store
            .credentialMetadata,
        ),
      )
    }
  }

  public async storeIssuerProfile() {
    const { issuerSummary } = this.interaction
    if (issuerSummary.publicProfile) {
      await this.interactionManager.backendMiddleware.storageLib.store.issuerProfile(
        issuerSummary,
      )
    }
  }
}
