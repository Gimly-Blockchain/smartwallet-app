import { Dimensions, Platform } from 'react-native'

const initialViewportWidth = Dimensions.get('window').width
// const initialViewportHeight = Dimensions.get('window').height

const isSmallViewportWidth = initialViewportWidth < 360

export const fontMain = Platform.OS === 'android' ? 'TTCommons' : 'TT Commons'
export const baseFontStyles = {
  fontFamily: fontMain,
  // fontWeight doesn't do anything, but React Material Button needs it on
  // Android to display the font properly it seems
  // https://github.com/xotahal/react-native-material-ui/issues/301 related
  fontWeight: 'normal' as 'normal',
}

export const textXXS = 14
export const textXS = 17
export const textSM = 18
export const textMD = 20
export const textLG = 22
export const textXL = 28
export const text2XL = 30
export const text3XL = 34
export const text4XL = 42

export const textHeader = isSmallViewportWidth ? textXL : text2XL
export const textSubheader = isSmallViewportWidth ? textSM : textMD

// it's unclear if fontWeight does anything
// it may be best to use different names for the different weights
// https://github.com/facebook/react-native/issues/19707
// export const fontWeight = '100'

// PRESETS

export const mainText = {
  ...baseFontStyles,
  fontSize: textHeader,
}

export const subMainText = {
  ...baseFontStyles,
  fontSize: textSubheader,
}

// this is used for main information such as issuer name, claimCard's main info
//  button text, iOS header
export const standardText = {
  ...baseFontStyles,
  fontSize: textLG,
}
