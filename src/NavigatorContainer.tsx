import React from 'react'
import {
  addNavigationHelpers,
  NavigationEventSubscription,
  NavigationEventCallback,
  SafeAreaView,
} from 'react-navigation'
import { connect } from 'react-redux'
import { BackHandler, Linking, StatusBar } from 'react-native'
import { AnyAction } from 'redux'
import { Routes } from 'src/routes'
import { RootState } from 'src/reducers/'
import { navigationActions, accountActions, genericActions } from 'src/actions/'
import { BottomActionBar } from './ui/generic/'
import { routeList } from './routeList'
import { LoadingSpinner } from 'src/ui/generic/loadingSpinner'
import { JolocomTheme } from './styles/jolocom-theme'

const {
  createReduxBoundAddListener,
} = require('react-navigation-redux-helpers')

interface ConnectProps {
  navigation: RootState['navigation']
  openScanner: () => void
  goBack: () => void
  handleDeepLink: (url: string) => void
  checkIfAccountExists: () => void
  initApp: () => Promise<void>
}

interface OwnProps {
  dispatch: (action: AnyAction) => void
}

interface Props extends ConnectProps, OwnProps {
  deepLinkLoading: boolean
}

export class NavigatorContainer extends React.Component<Props> {
  private addListener: (
    name: string,
    cb: NavigationEventCallback,
  ) => NavigationEventSubscription

  constructor(props: Props) {
    super(props)
    this.addListener = createReduxBoundAddListener('root')
  }

  async componentDidMount() {
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
      routeList.PasswordEntry,
      routeList.Entropy,
      routeList.SeedPhrase,
      routeList.Exception,
      routeList.Loading,
    ]
    const isDarkBackground = darkBackgroundPages.includes(currentRoute)
    return (
      <React.Fragment>
        <StatusBar
          barStyle={isDarkBackground ? 'light-content' : 'dark-content'}
        />
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: isDarkBackground
              ? JolocomTheme.primaryColorBlack
              : JolocomTheme.primaryColorWhite,
          }}
        >
          <Routes
            navigation={addNavigationHelpers({
              dispatch: this.props.dispatch,
              state: this.props.navigation,
              addListener: this.addListener,
            })}
          />
          {this.props.deepLinkLoading && <LoadingSpinner />}
        </SafeAreaView>
        {currentRoute === routeList.Home && (
          <BottomActionBar openScanner={this.props.openScanner} />
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  navigation: state.navigation,
  deepLinkLoading: state.sso.deepLinkLoading,
})

const mapDispatchToProps = (dispatch: Function) => ({
  goBack: () => dispatch(navigationActions.goBack()),
  handleDeepLink: (url: string) =>
    dispatch(navigationActions.handleDeepLink(url)),
  openScanner: () =>
    dispatch(
      navigationActions.navigate({ routeName: routeList.QRCodeScanner }),
    ),
  checkIfAccountExists: () => dispatch(accountActions.checkIdentityExists()),
  initApp: async () => await dispatch(genericActions.initApp()),
})

export const Navigator = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigatorContainer)
