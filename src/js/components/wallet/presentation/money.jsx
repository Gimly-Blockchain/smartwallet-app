import React from 'react'
import Radium from 'radium'

const STYLES = {
}

@Radium
export default class WalletMoney extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    return (<div>
      Money
    </div>)
  }
}
