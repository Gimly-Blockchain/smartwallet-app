import React from 'react'
import { CredentialCard } from 'src/ui/home/components/credentialCard'
import { shallow } from 'enzyme'

describe('ClaimCard component', () => {
  it('matches the snapshot on render', () => {
    const props = {
      credential: {
        credentialType: 'Name',
        claimData: {
          familyName: 'Running',
        },
        id: 'claim:id:1234',
        issuer: {
          did: 'did:issuer:ex',
        },
        subject: 'did:subject:ex',
      },
      leftIcon: null,
      did: 'test0123',

      openClaimsDetails: () => null,
    }
    const rendered = shallow(<CredentialCard {...props} />)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot of a two line claim', () => {
    const props = {
      credential: {
        credentialType: 'Name',
        claimData: {
          givenName: 'Test',
          familyName: 'Running',
        },
        id: 'claim:id:1234',
        issuer: {
          did: 'did:issuer:ex',
        },
        subject: 'did:subject: ex',
      },
      leftIcon: null,
      did: 'test0123',
      openClaimsDetails: () => null,
    }

    const rendered = shallow(<CredentialCard {...props} />)
    expect(rendered).toMatchSnapshot()
  })
})
