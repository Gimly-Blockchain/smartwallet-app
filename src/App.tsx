import React from 'react'
import { Provider } from 'react-redux'
import { initStore } from './store'
import { navigationActions } from 'src/actions'
import { StatusBar } from 'react-native'
import { RoutesContainer } from './routes'
import { AppLoading } from './ui/generic/appLoading'
import { useScreens } from 'react-native-screens'
import { NavigationContainerComponent } from 'react-navigation'
import { Notifications } from './ui/notifications/containers/notifications'
useScreens()

/**
 * NOTE: this is *not* exported on purpose
 * Other parts of the app should generally *not* access the store directly, but
 * rather through being connect()ed through redux
 *
 * If you think you need to export this, then something else probably needs
 * better architecture.
 */
let store: ReturnType<typeof initStore>

export default class App extends React.PureComponent<{}> {
  private navigator!: NavigationContainerComponent

  public constructor(props: {}) {
    super(props)
    // only init store once, or else Provider complains (especially on 'toggle
    // inspector')
    //
    // but it needs to be done only when a new App is
    // instantiated because otherwise the overrides at the top of index.ts will
    // have not been excuted yet (while files are being imported) and initStore
    // triggers creation of BackendMiddleware which needs those
    if (!store) store = initStore()
  }

  private setNavigator(nav: NavigationContainerComponent | null) {
    if (!nav) return
    this.navigator = nav
    navigationActions.setTopLevelNavigator(this.navigator)
  }

  public render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="default" />
        <Provider store={store}>
          <React.Fragment>
            <RoutesContainer ref={nav => this.setNavigator(nav)} />
            <Notifications />
            <AppLoading />
          </React.Fragment>
        </Provider>
      </React.Fragment>
    )
  }
}
