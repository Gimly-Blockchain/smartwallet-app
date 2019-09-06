import React from 'react'
import { connect } from 'react-redux'
import { SeedPhrase as SeedPhraseComponent } from 'src/ui/recovery/seedPhrase/components/seedPhrase'
import { ThunkDispatch } from '../../../../store'
import { NavigationScreenProps } from 'react-navigation'
import { navigationActions } from '../../../../actions'
import { routeList } from '../../../../routeList'
import { StatusBar } from 'react-native'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps>,
    NavigationScreenProps {}

export class SeedPhraseContainer extends React.Component<Props> {
  public render() {
    const mnemonic =
      this.props.navigation && this.props.navigation.getParam('mnemonic')
    return (
      <React.Fragment>
        <StatusBar
          animated={false}
          barStyle="light-content"
          showHideTransition="fade"
        />
        <SeedPhraseComponent
          seedPhrase={mnemonic}
          handleButtonTap={() => this.props.repeatSeedPhrase(mnemonic)}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  repeatSeedPhrase: (mnemonic: string) =>
    dispatch(
      navigationActions.navigate({
        routeName: routeList.RepeatSeedPhrase,
        params: { mnemonic },
      }),
    ),
})

export const SeedPhrase = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SeedPhraseContainer)
