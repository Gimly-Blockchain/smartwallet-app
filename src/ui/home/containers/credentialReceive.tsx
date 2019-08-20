import React from 'react'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers/'
import { DecoratedClaims } from 'src/reducers/account'

import { saveExternalCredentials } from 'src/actions/account'
import { CredentialDialogComponent } from '../components/credentialDialog'
import { cancelReceiving } from 'src/actions/sso'
import { ButtonSection } from 'src/ui/structure/buttonSectionBottom'
import { View } from 'react-native'
import { ThunkDispatch } from '../../../store'
import { demoData } from '../../../../demoDocuments'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

interface State {
  toRender: DecoratedClaims
}

export class CredentialsReceiveContainer extends React.Component<Props, State> {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.9 }}>
          <CredentialDialogComponent
            requester={demoData[0].issuer}
            credentialToRender={demoData[0]}
          />
        </View>
        <View style={{ flex: 0.1 }}>
          <ButtonSection
            confirmText={'Accept'}
            denyText={'Deny'}
            handleConfirm={this.props.saveExternalCredentials}
            handleDeny={this.props.goBack}
            disabled={false}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  // offer: state.account.claims.pendingExternal.offer[0].decoratedClaim,
  offeror: state.account.claims.pendingExternal.offeror,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  saveExternalCredentials: () => dispatch(saveExternalCredentials),
  goBack: () => dispatch(cancelReceiving),
})

export const CredentialReceive = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CredentialsReceiveContainer)
