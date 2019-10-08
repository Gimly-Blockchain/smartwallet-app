import { Platform } from 'react-native'

const isAndroid = Platform.OS === 'android'

// COLOR NAMES

export const black = 'black' // rgb(0, 0, 0)
export const black010 = 'rgba(0, 0, 0, 0.1)'
export const black030 = 'rgba(0, 0, 0, 0.3)'
export const black040 = 'rgba(0, 0, 0, 0.4)'
export const black065 = 'rgba(0, 0, 0, 0.65)'
export const white = 'white' // rgb(255, 255, 255)
export const white050 = 'rgba(255, 255, 255, 0.5)'
export const white040 = 'rgba(255, 255, 255, 0.4)'
export const white080 = 'rgba(255, 255, 255, 0.8)'
export const blackMain = 'rgb(5, 5, 13)'
export const blackMain030 = 'rgba(5, 5, 13, 0.3)'
export const blackMain040 = 'rgba(5, 5, 13, 0.4)'
export const blackMain050 = 'rgba(5, 5, 13, 0.5)'
export const sand = 'rgb(255, 222, 188)'
export const sand025 = 'rgba(255, 222, 188, 0.25)'
export const sand090 = 'rgb(255, 222, 188, 0.9)'
export const sandLight = 'rgb(255, 239, 223)'
export const sandLight040 = 'rgba(255, 239, 223)'
export const sandLight070 = 'rgba(255, 239, 223, 0.7)'
export const sandLight080 = 'rgba(255, 239, 223, 0.8)'
export const purpleMain = 'rgb(148, 47, 81)'
export const purpleMain040 = 'rgba(148, 47, 81, 0.4)'
export const lightGreyLightest = 'rgb(250, 250, 250)'
export const lightGreyLighter = 'rgb(245, 245, 245)'
export const lightGreyLight = 'rgb(242, 242, 242)'
export const lightGrey = 'rgb(236, 236, 236)'
export const greyLighter = 'rgb(155, 155, 158)'
export const greyLight = 'rgb(149, 149, 149)'
export const grey = 'grey' // rgb(128, 128, 128)
export const golden = 'rgb(241, 161, 7)'

export const greenMain = 'rgb(40, 165, 45)'
export const greenFaded060 = 'rgba(233, 239, 221, 0.6)'
export const mint = 'rgb(89, 167, 145)'
// PRESETS

export const backgroundDarkMain = blackMain
export const backgroundLightMain = lightGreyLighter
export const dotColorActive = sand
export const dotColorInactive = 'rgba(255, 254, 252, 0.7)'
export const spinnerColor = sand090
export const disabledButtonBackground = lightGrey
export const disabledButtonText = blackMain030
export const backUpWarningBg = golden
export const validTextValid = greenMain

export const navHeaderTintDefault = isAndroid ? white : black
export const navHeaderBgDefault = isAndroid ? black : lightGreyLighter
export const bottomTabBarBg = isAndroid ? lightGreyLightest : blackMain
