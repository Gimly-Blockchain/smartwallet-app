import React from 'react'
import {
  addNavigationHelpers,
  NavigationEventSubscription,
  NavigationEventCallback,
} from 'react-navigation'
import { connect } from 'react-redux'
import { BackHandler, Linking, StatusBar } from 'react-native'
import { RootState } from 'src/reducers/'
import { navigationActions, accountActions, genericActions } from 'src/actions/'
import { routeList } from './routeList'
import { LoadingSpinner } from 'src/ui/generic/loadingSpinner'
import { ThunkDispatch } from './store'
import { handleDeepLink } from './actions/navigation'
import { toggleLoading } from './actions/account'
import { Routes } from './routes'
import { withErrorHandling, withLoading } from './actions/modifiers'
import { showErrorScreen } from './actions/generic'

const {
  createReduxBoundAddListener,
  initializeListeners,
} = require('react-navigation-redux-helpers')

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {
  dispatch: ThunkDispatch
  deepLinkLoading: boolean
}

export class NavigatorContainer extends React.Component<Props> {
  private readonly addListener: (
    name: string,
    cb: NavigationEventCallback,
  ) => NavigationEventSubscription

  constructor(props: Props) {
    super(props)
    this.addListener = createReduxBoundAddListener('root')
  }

  async componentDidMount() {
    initializeListeners('root', this.props.navigation)
    await this.props.initApp()
    await this.props.checkIfAccountExists()
    const url = await Linking.getInitialURL()
    if (url) {
      this.props.handleDeepLink(url)
    }

    Linking.addEventListener('url', this.handleOpenURL)
    BackHandler.addEventListener('hardwareBackPress', this.navigateBack)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.navigateBack)
    Linking.removeEventListener('url', this.handleOpenURL)
  }

  private navigateBack = () => {
    // return false if app exit is desired
    const { navigation } = this.props
    if (
      navigation.index === 0 &&
      navigation.routes.length === 1 &&
      navigation.routes[0].index === 0
    ) {
      return false
    }

    return this.props.goBack()
  }

  //When handleOpenURL is called, we pass the event url to the navigate method.
  private handleOpenURL = (event: any) => {
    this.props.handleDeepLink(event.url)
  }

  render() {
    const { routes, index } = this.props.navigation
    const currentRoute = routes[index].routeName
    const darkBackgroundPages = [
      routeList.Landing,
      routeList.SeedPhrase,
      routeList.Exception,
      routeList.Loading,
      routeList.Entropy,
    ]
    const isDarkBackground = darkBackgroundPages.includes(currentRoute)
    return (
      <React.Fragment>
        <StatusBar barStyle={isDarkBackground ? 'light-content' : 'default'} />
        <Routes
          navigation={addNavigationHelpers({
            dispatch: this.props.dispatch,
            state: this.props.navigation,
            addListener: this.addListener,
          })}
        />
        {this.props.deepLinkLoading && <LoadingSpinner />}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  navigation: state.navigation,
  deepLinkLoading: state.sso.deepLinkLoading,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  goBack: () => dispatch(navigationActions.goBack),
  handleDeepLink: async (url: string) =>
    dispatch(
      withLoading(toggleLoading)(
        withErrorHandling(showErrorScreen)(handleDeepLink(url)),
      ),
    ),
  checkIfAccountExists: () =>
    dispatch(
      withLoading(toggleLoading)(
        withErrorHandling(showErrorScreen)(accountActions.checkIdentityExists),
      ),
    ),
  initApp: () => dispatch(genericActions.initApp),
})

export const Navigator = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigatorContainer)
