import React from 'react'
import { LandingContainer } from 'src/ui/landing/containers/landing'
import { shallow } from 'enzyme'

describe('landing container', () => {
  it('mounts correctly and matches snapshot', () => {
    const props: LandingContainer['props'] = {
      openInitAction: jest.fn(),
    }

    const rendered = shallow(<LandingContainer {...props} />)
    expect(rendered).toMatchSnapshot()
    expect(props.openInitAction).not.toHaveBeenCalled()
  })
})
