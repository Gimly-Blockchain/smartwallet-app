import { PublicProfileClaimMetadata } from 'cred-types-jolocom-core/types'

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

export interface AuthenticationRequestSummary {
  callbackURL: string
  requester: IdentitySummary
  description: string
  requestJWT: string
}

export interface PaymentRequestSummary {
  receiver: {
    did: string
    address: string
  }
  requester: IdentitySummary
  callbackURL: string
  amount: number
  description: string
  paymentRequest: string
}

export interface CredentialRequestSummary {
  readonly callbackURL: string
  readonly requester: IdentitySummary
  readonly availableCredentials: CredentialTypeSummary[]
  readonly requestJWT: string
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
