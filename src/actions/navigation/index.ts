import {
  NavigationActions,
  StackActions,
  NavigationNavigateActionPayload,
  NavigationContainer,
} from 'react-navigation'
import { setDeepLinkLoading } from 'src/actions/sso'
import { routeList } from 'src/routeList'
import { JolocomLib } from 'jolocom-lib'
import { interactionHandlers } from '../../lib/storage/interactionTokens'
import { showErrorScreen } from '../generic'
import { AppError, ErrorCode } from '../../lib/errors'
import { withErrorHandling, withLoading } from 'src/actions/modifiers'
import { ThunkAction } from '../../store'

let topLevelNavigator: any
export const setTopLevelNavigator = (nav: NavigationContainer) => {
  topLevelNavigator = nav
}

/**
 * NOTE: navigate and navigatorReset are both async so that it does not have to
 * return a value, since it actually is not a real action but rather a bridge into
 * react-navigation state
 */
export const navigate = (
  options: NavigationNavigateActionPayload,
): ThunkAction => async () => {
  topLevelNavigator.dispatch(NavigationActions.navigate(options))
}
export const navigatorReset = (
  newScreen: NavigationNavigateActionPayload,
): ThunkAction => async () => {
  topLevelNavigator.dispatch(
    StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate(newScreen)],
    }),
  )
}

export const navigatorResetHome = (): ThunkAction => dispatch =>
  dispatch(navigatorReset({ routeName: routeList.Home }))

/**
 * The function that parses a deep link to get the route name and params
 * It then matches the route name and dispatches a corresponding action
 * @param url - a deep link string with the following schema: appName://routeName/params
 */
export const handleDeepLink = (url: string): ThunkAction => (
  dispatch,
  getState,
  backendMiddleware,
) => {
  // TODO Fix
  const route: string = url.replace(/.*?:\/\//g, '')
  const params: string = (route.match(/\/([^\/]+)\/?$/) as string[])[1] || ''
  const routeName = route.split('/')[0]

  if (
    routeName === 'consent' ||
    routeName === 'payment' ||
    routeName === 'authenticate'
  ) {
    // The identityWallet is initialised before the deep link is handled.
    if (!backendMiddleware.identityWallet) {
      return dispatch(navigatorReset({ routeName: routeList.Landing }))
    }

    const interactionToken = JolocomLib.parse.interactionToken.fromJWT(params)
    const handler = interactionHandlers[interactionToken.interactionType]

    if (handler) {
      return dispatch(
        withLoading(setDeepLinkLoading)(
          withErrorHandling(showErrorScreen)(handler(interactionToken, true)),
        ),
      )
    }

    /** @TODO Use error code */
    return dispatch(
      showErrorScreen(
        new AppError(ErrorCode.Unknown, new Error('No handler found')),
      ),
    )
  }

  return dispatch(
    navigate({
      routeName: routeList.Home,
    }),
  )
}
