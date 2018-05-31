import { combineReducers } from 'redux'
import { did } from 'src/reducers/account/did'
import { claims } from 'src/reducers/account/claims'
import { loading } from 'src/reducers/account/loading'
import { Map } from 'immutable'

export interface DidState {
  readonly did: string
}

export interface ClaimState {
  readonly claims: Map<string, any>
}

export interface LoadingState {
  readonly loading: boolean
}


export interface AccountState {
  did: DidState,
  claims: ClaimState,
  loading: LoadingState
}

export const accountReducer = combineReducers({
  did,
  claims,
  loading
})
