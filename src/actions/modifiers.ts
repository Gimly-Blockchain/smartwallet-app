import { ActionCreator } from 'redux'
import { ThunkAction, AnyAction } from 'src/store'
import { AppError } from '../lib/errors'
import { toggleLoading } from './account'

/**
 * Curried function that wraps a {@link ThunkAction} with two calls to the provided loadingAction
 * {@link ActionCreator} (called with "true" before the wrapped action is dispatched, and with "false" after)
 * @param loadingAction - An action creator to create the actions to be dispatched before and after the wrappedAction-
 * @param wrappedAction - The thunkAction to be wrapped
 * @example dispatch(withLoading(toggleLoading)(saveClaims))
 */
export const withLoadingHandler = (loadingAction: ActionCreator<AnyAction>) => (
  wrappedAction: ThunkAction,
): ThunkAction => async dispatch => {
  try {
    dispatch(loadingAction(true))
    return await dispatch(wrappedAction)
  } finally {
    // NOTE: timeout is a hack to avoid flashing when navigating, as the new
    // screen will have not been loaded yet but the AppLoading will be taken
    // down, which will flash the old screen shortly
    setTimeout(() => dispatch(loadingAction(false)), 100)
  }
}

/**
 * Curried function that wraps a {@link ThunkAction} with the provided error handler to be dispatched on thrown error
 * @param errorHandler - An {@link ActionCreator} to be dispatched with the error if an error is thrown
 * @param errorModifier - An optional modifier for the error which is thrown, is Identity function by default
 * @param wrappedAction - The {@link ThunkAction} to be wrapped. If dispatching it throws an error, the errorhandler will be dispatched
 * @example dispatch(withErrorHandling(showErrorScreen)(saveClaims))
 * @dev The return value from this modifier can be passed to other modifiers, i.e. modifiers can be composed
 * e.g. dispatch(withLoading(toggleLoading)(withErrorHandling(showErrorScreen)(saveClaims)))
 */
export const withErrorHandling = (
  errorHandler: ActionCreator<ThunkAction>,
  errorModifier: (error: AppError) => AppError = (error: AppError) => error,
) => (wrappedAction: ThunkAction): ThunkAction => async dispatch => {
  try {
    return await dispatch(wrappedAction)
  } catch (error) {
    return dispatch(errorHandler(errorModifier(error)))
  }
}

export const withLoading = withLoadingHandler(toggleLoading)
