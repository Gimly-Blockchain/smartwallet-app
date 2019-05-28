import { AnyAction } from 'redux'
import { SET_EXPIRED_DOC, CLEAR_EXPIRED_DOC } from 'src/actions/documents'
import { Document } from 'src/ui/documents/components/documentCard'

export interface DocumentsState {
  selectedExpiredDocument: Document | undefined
}

const initialState = {
  selectedExpiredDocument: undefined,
}

export const documentsReducer = (
  state = initialState,
  action: AnyAction,
): DocumentsState => {
  switch (action.type) {
    case SET_EXPIRED_DOC:
      return { ...state, selectedExpiredDocument: action.value }
    case CLEAR_EXPIRED_DOC:
      return { ...state, selectedExpiredDocument: undefined }
    default:
      return state
  }
}
