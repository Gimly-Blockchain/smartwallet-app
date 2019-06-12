import React from 'react'
import { connect } from 'react-redux'
import { LoadingScreen } from 'src/ui/generic/'
import { LandingComponent } from 'src/ui/landing/components/landing'
import { registrationActions } from 'src/actions/'
import { RootState } from 'src/reducers/'

interface ConnectProps {
  startRegistration: () => void
  loading: boolean
}

interface Props extends ConnectProps {}

export class LandingContainer extends React.Component<Props> {
  render() {
    if (this.props.loading) {
      return <LoadingScreen />
    } else {
      return <LandingComponent handleButtonTap={this.props.startRegistration} />
    }
  }
}

const mapStateToProps = ({account: {loading: {loading}}}: RootState) => {
  return {
    loading,
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  startRegistration: () => dispatch(registrationActions.startRegistration()),
})

export const Landing = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LandingContainer)
