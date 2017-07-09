import React, { Component } from 'react'
import ReactStripeCheckout from 'react-stripe-checkout'
import * as settings from 'settings'

import {
  RaisedButton
} from 'material-ui'

export default class StripeCheckout extends Component {
  static propTypes = {
    buyEther: React.PropTypes.func.isRequired
  }

  buyEther = (token) => {
    this.props.buyEther(token)
  }

  render() {
    return (
      <ReactStripeCheckout
        token={this.buyEther.bind(this)}
        stripeKey={settings.stripe.publishableKey}
        name="JOLOCOM SMARTWALLET"
        description="Add Ether to your Smart Wallet."
        image="/img/logo.png"
        panelLabel="Bezahlen"
      >
        <RaisedButton
          secondary
          fullWidth
          label="BUY ETHER" />
      </ReactStripeCheckout>
    )
  }
}