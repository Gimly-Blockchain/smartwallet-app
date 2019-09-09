import { Image, Platform, StyleProp, TextStyle } from 'react-native'
import { createElement } from 'react'

import {
  createAppContainer,
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  NavigationRoute,
  NavigationScreenOptions,
  NavigationScreenProp,
} from 'react-navigation'

import { ClaimDetails, Claims, Records } from 'src/ui/home/'
import { DocumentDetails, Documents } from 'src/ui/documents'
import { Landing } from 'src/ui/landing/'
import { PaymentConsent } from 'src/ui/payment'
import { Entropy, RegistrationProgress } from 'src/ui/registration/'
import { Exception } from 'src/ui/generic/'
import { Consent } from 'src/ui/sso'
import { CredentialReceive } from 'src/ui/home'
import { Settings } from 'src/ui/settings'
import I18n from 'src/locales/i18n'
import { QRScannerContainer } from 'src/ui/generic/qrcodeScanner'
import { AuthenticationConsent } from 'src/ui/authentication'
import { routeList } from './routeList'
import { AppInit } from './ui/generic/appInit'
import BottomTabBar from 'src/ui/generic/bottomTabBar'
import strings from './locales/strings'
import { Colors, Typography } from 'src/styles'

import {
  DocumentsMenuIcon,
  IdentityMenuIcon,
  RecordsMenuIcon,
  SettingsMenuIcon,
} from 'src/resources'
import { InputSeedPhrase } from './ui/recovery/seedPhrase/container/inputSeedPhrase'
import { RepeatSeedPhrase } from './ui/recovery/seedPhrase/container/repeatSeedPhrase'
import { SeedPhrase } from './ui/recovery/seedPhrase/container/seedPhrase'
import { SocialRecovery } from './ui/recovery/socialRecovery/container/socialRecovery'
import { ReceivedShards } from './ui/recovery/socialRecovery/container/receivedShards'
import { AcceptShard } from './ui/recovery/socialRecovery/container/acceptShard'
import { CollectShards } from './ui/recovery/socialRecovery/container/collectShards'

// only used on android
const headerBackImage = createElement(Image, {
  source: require('./resources/img/close.png'),
  style: {
    height: 26,
    width: 26,
    padding: 4,
  },
})

const noHeaderNavOpts = {
  header: null,
}

const headerTitleStyle: StyleProp<TextStyle> = {
  ...Typography.standardText,
  // the default is 500, which is not supported on Android properly
  fontWeight: 'normal',
  color: Colors.navHeaderTintDefault,
}

const commonNavigationOptions: NavigationScreenOptions = {
  headerTitleStyle,
  headerStyle: {
    backgroundColor: Colors.navHeaderBgDefault,
    borderBottomWidth: 0,
  },
}

const navOptScreenWCancel = {
  ...commonNavigationOptions,
  ...Platform.select({
    android: {
      headerBackImage,
    },
    ios: {
      headerTintColor: Colors.purpleMain,
    },
  }),
}

export const BottomTabBarRoutes = {
  [routeList.Claims]: {
    screen: Claims,
    title: strings.MY_IDENTITY,
    navigationOptions: {
      ...commonNavigationOptions,
      tabBarIcon: IdentityMenuIcon,
    },
  },
  [routeList.Documents]: {
    screen: Documents,
    title: strings.DOCUMENTS,
    navigationOptions: {
      ...commonNavigationOptions,
      tabBarIcon: (props: {
        tintColor: string
        focused: boolean
        fillColor?: string
      }) => {
        props.fillColor = Colors.bottomTabBarBg
        return new DocumentsMenuIcon(props)
      },
    },
  },
  [routeList.Records]: {
    screen: Records,
    title: strings.LOGIN_RECORDS,
    navigationOptions: {
      ...commonNavigationOptions,
      tabBarIcon: RecordsMenuIcon,
    },
  },
  [routeList.Settings]: {
    screen: Settings,
    title: strings.SETTINGS,
    navigationOptions: {
      ...commonNavigationOptions,
      tabBarIcon: SettingsMenuIcon,
    },
  },
}

const BottomTabNavigator = createBottomTabNavigator(BottomTabBarRoutes, {
  tabBarOptions: {
    ...Platform.select({
      android: {
        activeTintColor: Colors.purpleMain,
        inactiveTintColor: Colors.greyLighter,
      },
      ios: {
        activeTintColor: Colors.white,
        inactiveTintColor: Colors.white050,
      },
    }),
    showLabel: false,
    style: {
      height: 50,
      bottom: 0,
      backgroundColor: Colors.bottomTabBarBg,
    },
  },
  navigationOptions: ({
    navigation,
  }: {
    navigation: NavigationScreenProp<NavigationRoute>
  }) => {
    // proxy the route title as the headerTitle for this screen
    const nestedRouteName =
      navigation.state.routes[navigation.state.index].routeName
    return {
      headerTitle: I18n.t(BottomTabBarRoutes[nestedRouteName].title),
    }
  },
  tabBarComponent: BottomTabBar,
  //tabBarPosition: 'bottom',
})

const RegistrationScreens = createSwitchNavigator(
  {
    [routeList.Landing]: {
      screen: Landing,
      navigationOptions: noHeaderNavOpts,
    },
    [routeList.InputSeedPhrase]: {
      screen: InputSeedPhrase,
      navigationOptions: noHeaderNavOpts,
    },
    [routeList.CollectShards]: {
      screen: CollectShards,
      navigationOptions: noHeaderNavOpts,
    },
    [routeList.Entropy]: {
      screen: Entropy,
      navigationOptions: noHeaderNavOpts,
    },
    [routeList.RegistrationProgress]: {
      screen: RegistrationProgress,
      navigationOptions: noHeaderNavOpts,
    },
  },
  {
    initialRouteName: routeList.Landing,
  },
)

const MainStack = createStackNavigator(
  {
    [routeList.Home]: {
      screen: BottomTabNavigator,
    },
    [routeList.QRCodeScanner]: {
      screen: QRScannerContainer,
      navigationOptions: navOptScreenWCancel,
    },

    [routeList.CredentialDialog]: {
      screen: CredentialReceive,
      navigationOptions: () => ({
        ...navOptScreenWCancel,
        headerTitle: I18n.t(strings.RECEIVING_NEW_CREDENTIAL),
      }),
    },
    [routeList.Consent]: {
      screen: Consent,
      navigationOptions: () => ({
        ...navOptScreenWCancel,
        headerTitle: I18n.t(strings.SHARE_CLAIMS),
      }),
    },
    [routeList.PaymentConsent]: {
      screen: PaymentConsent,
      navigationOptions: () => ({
        ...navOptScreenWCancel,
        headerTitle: I18n.t(strings.CONFIRM_PAYMENT),
      }),
    },
    [routeList.AuthenticationConsent]: {
      screen: AuthenticationConsent,
      navigationOptions: () => ({
        ...navOptScreenWCancel,
        headerTitle: I18n.t(strings.AUTHORIZATION_REQUEST),
      }),
    },
    [routeList.ClaimDetails]: {
      screen: ClaimDetails,
      navigationOptions: navOptScreenWCancel,
    },
    [routeList.DocumentDetails]: {
      screen: DocumentDetails,
      navigationOptions: {
        ...navOptScreenWCancel,
      },
    },

    [routeList.SeedPhrase]: {
      screen: SeedPhrase,
      navigationOptions: noHeaderNavOpts,
    },
    [routeList.RepeatSeedPhrase]: {
      screen: RepeatSeedPhrase,
      navigationOptions: noHeaderNavOpts,
    },
    [routeList.SocialRecovery]: {
      screen: SocialRecovery,
      navigationOptions: noHeaderNavOpts,
    },
    [routeList.ReceivedShards]: {
      screen: ReceivedShards,
      navigationOptions: noHeaderNavOpts,
    },
    [routeList.AcceptShard]: {
      screen: AcceptShard,
      navigationOptions: noHeaderNavOpts,
    },

    [routeList.Exception]: {
      screen: Exception,
      navigationOptions: noHeaderNavOpts,
    },
  },
  {
    defaultNavigationOptions: commonNavigationOptions,
  },
)

export const Routes = createSwitchNavigator(
  {
    [routeList.AppInit]: {
      screen: AppInit,
      navigationOptions: noHeaderNavOpts,
    },
    MainStack,
    RegistrationScreens,
  },
  {
    initialRouteName: routeList.AppInit,
  },
)

export const RoutesContainer = createAppContainer(Routes)
