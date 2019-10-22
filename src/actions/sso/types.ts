import { PublicProfileClaimMetadata } from 'cred-types-jolocom-core/types'
import { DecoratedClaims } from '../../reducers/account'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'

/**
 * @dev Simply using all claims required by the public profile
 */

export type IssuerPublicProfileSummary = PublicProfileClaimMetadata['claimInterface']

/**
 * @dev An identity summary is composed of a DID + all public info (currently public profile)
 */
export interface IdentitySummary {
  did: string
  publicProfile?: IssuerPublicProfileSummary
}

export interface RequestSummary {
  requester: IdentitySummary
  requestJWT: string
}

export interface AuthenticationRequestSummary extends RequestSummary {
  description: string
  callbackURL: string
}

export interface PaymentRequestSummary extends RequestSummary {
  callbackURL: string
  receiver: {
    did: string
    address: string
  }
  amount: number
  description: string
}

export interface CredentialReceiveSummary extends RequestSummary {
  external: ExternalCredentialSummary[]
}

export interface ExternalCredentialSummary {
  decoratedClaim: DecoratedClaims
  credential: SignedCredential
}

export interface CredentialRequestSummary extends RequestSummary {
  callbackURL: string
  availableCredentials: CredentialTypeSummary[]
}

export interface CredentialTypeSummary {
  type: string
  values: string[]
  verifications: CredentialVerificationSummary[]
}

export interface CredentialVerificationSummary {
  id: string
  issuer: IdentitySummary
  selfSigned: boolean
  expires: string | undefined | Date
}
