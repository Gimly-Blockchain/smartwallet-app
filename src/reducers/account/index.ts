import { combineReducers } from 'redux'
import { did } from 'src/reducers/account/did'
import { claims } from 'src/reducers/account/claims'
import { loading } from 'src/reducers/account/loading'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { ClaimEntry } from 'jolocom-lib/js/credentials/credential/types'
import {
  CredentialOfferMetadata,
  CredentialOfferRenderInfo
} from 'jolocom-lib/js/interactionTokens/interactionTokens.types'

export interface DecoratedClaims {
  credentialType: string
  claimData: ClaimEntry
  id: string
  issuer: string
  subject: string
  expires?: Date,
  renderInfo?: CredentialOfferRenderInfo,
  metadata?: CredentialOfferMetadata,
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
  renderInfo?: {
    // TODO: convert to CredentialRenderTypes
    renderAs?: string
    background?: {
      color?: string
      url?: string
    }
    logo?: {
      url: string
    }
    text?: {
      color: string
    }
  }
  // TODO: convert to CredentialOfferMetadata
  metadata?: {}
}

export interface CategorizedClaims {
  readonly [key: string]: DecoratedClaims[]
}

export interface ClaimsState {
  readonly loading: boolean
  readonly selected: DecoratedClaims
  readonly decoratedCredentials: CategorizedClaims
  readonly pendingExternal: SignedCredential[]
}

export interface DidState {
  readonly did: string
}

export interface LoadingState {
  readonly loading: boolean
}

// TODO avoid state.account.did.did access patterns
export interface AccountState {
  did: DidState
  claims: ClaimsState
  loading: LoadingState
}

export const accountReducer = combineReducers({
  did,
  claims,
  loading,
})
