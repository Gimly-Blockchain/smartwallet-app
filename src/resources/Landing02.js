import React from 'react'
import { ImageBackground } from 'react-native'
import { getI18nImage } from 'src/locales/i18n'
import { Presets } from 'src/styles'
const image = getI18nImage('02.jpg')

export default class Landing02 extends React.PureComponent {
  render() {
    return (
      <ImageBackground
        source={image}
        style={Presets.landingBackground}
        imageStyle={Presets.landingBackgroundImage}
      />
    )
  }
}
