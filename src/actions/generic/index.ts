import { Linking } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { AppError, ErrorCode } from 'src/lib/errors'
import I18n from 'src/locales/i18n'
import { routeList } from 'src/routeList'
import { navigationActions, accountActions } from 'src/actions'
import { ThunkAction } from 'src/store'
import settingKeys from 'src/ui/settings/settingKeys'
import { withLoading, withErrorScreen } from '../modifiers'

// Default delay on the loading state value before it can switch back to 'false'
const DEFAULT_LOADING_LATCH_DELAY_MS = 300

export const showErrorScreen = (
  error: AppError | Error,
): ThunkAction => dispatch => {
  const appError: AppError =
    error.constructor === AppError
      ? (error as AppError)
      : new AppError(ErrorCode.Unknown, error)

  return dispatch(
    navigationActions.navigate({
      routeName: routeList.Exception,
      params: {
        returnTo: appError.navigateTo,
        error: appError,
      },
    }),
  )
}

export const initApp: ThunkAction = async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  try {
    await backendMiddleware.initStorage()
    const storedSettings = await backendMiddleware.storageLib.get.settingsObject()

    // locale setup
    /** locale setup
     * @dev Until German and Dutch terms are polished, only English is used.
     * previous code:
     * if (storedSettings.locale) I18n.locale = storedSettings.locale
     * else storedSettings.locale = I18n.locale
     */
    if (storedSettings.locale) I18n.locale = storedSettings.locale
    else storedSettings.locale = I18n.locale

    await dispatch(loadSettings(storedSettings))

    const ret = await dispatch(accountActions.checkIdentityExists)

    // FIXME what happens if no identity and this is a deeplink?
    // navigationActions.handleDeepLink throws NoWallet
    // need to improve this UX

    // FIXME: get rid of these after setting up deepLinking properly using
    // react-navigation
    const handleDeepLink = (url: string) =>
      dispatch(
        withLoading(
          withErrorScreen(navigationActions.handleDeepLink(url)),
        ),
      )
    Linking.addEventListener('url', event => handleDeepLink(event.url))
    await Linking.getInitialURL().then(url => {
      if (url) handleDeepLink(url)
    })

    return ret
  } catch (e) {
    return dispatch(
      showErrorScreen(
        new AppError(ErrorCode.WalletInitFailed, e, routeList.Landing),
      ),
    )
  } finally {
    SplashScreen.hide()
  }
}

const loadSettings = (settings: { [key: string]: any }) => ({
  type: 'LOAD_SETTINGS',
  value: settings,
})

export const setLocale = (locale: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  await backendMiddleware.storageLib.store.setting(settingKeys.locale, locale)
  I18n.locale = locale
  dispatch({ type: 'SET_LOCALE', value: locale })

  // we need to reset the navigator so that all screens are re-rendered with the
  // new locale
  return dispatch(navigationActions.navigatorReset())
}

const setLoading = (value: boolean) => ({
  type: 'SET_LOADING',
  value,
})

let curLoadingState = false
export const showAppLoading = (
  shouldShow: boolean,
  latchDelay = DEFAULT_LOADING_LATCH_DELAY_MS,
): ThunkAction => (dispatch, getState) => {
  const wasShowing = curLoadingState
  if (shouldShow && !wasShowing) {
    // for setting to "true" we do it immediately and set current state
    curLoadingState = shouldShow
    return new Promise(resolve => {
      const ret = dispatch(setLoading(shouldShow))
      setTimeout(() => resolve(ret), latchDelay)
    })
  }

  if (wasShowing && !shouldShow) {
    // for setting to 'false', we delay by the latchDelay amounr
    dispatch(delayedSetLoading(shouldShow, latchDelay))
  }

  // in all cases we return set to the "current" state again
  return dispatch(setLoading(curLoadingState))
}

let nextLoadingState = curLoadingState
let timeout: number | undefined
const delayedSetLoading = (
  value: boolean,
  latchDelay: number,
): ThunkAction => async dispatch => {
  nextLoadingState = value
  if (timeout !== undefined) clearTimeout(timeout)
  timeout = setTimeout(() => {
    curLoadingState = nextLoadingState
    dispatch(setLoading(curLoadingState))
    timeout = undefined
  }, latchDelay)
}
