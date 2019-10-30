import { combineReducers } from 'redux'
import { settingsReducer, SettingsState } from 'src/reducers/settings/'
import { accountReducer, AccountState } from 'src/reducers/account/'
import {
  registrationReducer,
  RegistrationState,
} from 'src/reducers/registration/'
import { documentsReducer, DocumentsState } from './documents'
import { notificationsReducer } from './notifications'

export const rootReducer = combineReducers<RootState>({
  settings: settingsReducer,
  account: accountReducer,
  registration: registrationReducer,
  documents: documentsReducer,
  notifications: notificationsReducer,
})

export interface RootState {
  readonly settings: SettingsState
  readonly account: AccountState
  readonly registration: RegistrationState
  readonly documents: DocumentsState
}
