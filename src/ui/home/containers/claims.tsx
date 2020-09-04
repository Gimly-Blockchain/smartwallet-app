import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { CredentialOverview } from '../components/credentialOverview'
import { accountActions } from 'src/actions'
import { DecoratedClaims } from 'src/reducers/account/'
import { RootState } from '../../../reducers'
import { ThunkDispatch } from '../../../store'
import { Wrapper } from 'src/ui/structure'

export interface ClaimsContainerProps
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

export const ClaimsContainer = (props: ClaimsContainerProps) => {
  const { did, claimsState, openClaimDetails } = props

  useEffect(() => {
    props.checkLocalAuthSet()
  }, [])

  return (
    <Wrapper testID="claimsScreen">
      <CredentialOverview
        did={did}
        claimsToRender={claimsState.decoratedCredentials}
        onEdit={openClaimDetails}
      />
    </Wrapper>
  )
}

const mapStateToProps = ({
  account: {
    did: { did },
    claims: claimsState,
  },
}: RootState) => ({ did, claimsState })

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  openClaimDetails: (claim: DecoratedClaims) =>
    dispatch(accountActions.openClaimDetails(claim)),
    checkLocalAuthSet: () => dispatch(accountActions.checkLocalDeviceAuthSet),
})

export const Claims = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimsContainer)
