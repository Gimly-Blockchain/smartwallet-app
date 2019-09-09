import React from 'react'
import { connect } from 'react-redux'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { navigationActions } from 'src/actions/'
import { ThunkDispatch } from 'src/store'
import { StatusBar } from 'react-native'
import { routeList } from '../../../routeList'

interface Props extends ReturnType<typeof mapDispatchToProps> {}

export class LandingContainer extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" />
        <LandingComponent
          handleGetStarted={this.props.getStarted}
          handleRecover={this.props.recoverIdentity}
          socialRecovery={this.props.socialRecovery}
        />
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  getStarted: () =>
    dispatch(
      navigationActions.navigate({
        routeName: routeList.Entropy,
      }),
    ),
  recoverIdentity: () =>
    dispatch(
      navigationActions.navigate({
        routeName: routeList.InputSeedPhrase,
      }),
    ),
  socialRecovery: () =>
    dispatch(
      navigationActions.navigate({
        routeName: routeList.CollectShards,
      }),
    ),
})

export const Landing = connect(
  null,
  mapDispatchToProps,
)(LandingContainer)
