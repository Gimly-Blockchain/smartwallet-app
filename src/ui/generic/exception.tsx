import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-native-material-ui'
import { navigationActions } from 'src/actions/'
import { Text, StyleSheet, View, Image } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import I18n from 'src/locales/i18n'
import { errorTitleMessages } from 'src/lib/errors'
import { getRandomStringFromArray } from 'src/utils/getRandomStringFromArray'
import strings from 'src/locales/strings'
import { ThunkDispatch } from '../../store'
import { NavigationScreenProps } from 'react-navigation'
const errorImage = require('src/resources/img/error_image.png')

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps>,
    NavigationScreenProps {
  errorTitle?: string
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(5, 5, 13)',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    padding: '5%',
  },
  upperContainer: {
    marginTop: 85,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  imagePlaceholder: {
    backgroundColor: 'grey',
    width: 160,
    height: 160,
  },
  textBlock: {
    marginTop: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  errorTextHeader: {
    textAlign: 'center',
    color: JolocomTheme.primaryColorSand,
    fontSize: JolocomTheme.landingHeaderFontSize,
    fontFamily: JolocomTheme.contentFontFamily,
  },
  errorText: {
    marginTop: 15,
    textAlign: 'center',
    color: JolocomTheme.primaryColorSand,
    fontSize: JolocomTheme.labelFontSize,
    fontFamily: JolocomTheme.contentFontFamily,
  },
  buttonBlock: {
    marginTop: 20,
    backgroundColor: JolocomTheme.primaryColorBlack,
  },
  buttonContainer: {
    height: 48,
    borderRadius: 4,
    backgroundColor: JolocomTheme.primaryColorPurple,
  },
  buttonText: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontFamily: JolocomTheme.contentFontFamily,
    color: JolocomTheme.primaryColorWhite,
    fontSize: JolocomTheme.headerFontSize,
    fontWeight: '100',
  },
})

export class ExceptionComponent extends React.PureComponent<Props> {
  goBack() {
    this.props.navigation && this.props.navigation.goBack()
  }

  render() {
    const stateParams =
      this.props.navigation &&
      this.props.navigation.state &&
      this.props.navigation.state.params
    if (!stateParams) return null

    // TODO: display error code
    const err = stateParams.error
    const errorTitle =
      this.props.errorTitle || getRandomStringFromArray(errorTitleMessages)
    let errorText = err
      ? err.message
      : strings.THERE_WAS_AN_ERROR_WITH_YOUR_REQUEST
    errorText = I18n.t(errorText) + '.'
    console.error(err && err.origError ? err.origError : err)

    return (
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <Image source={errorImage} style={{ width: 160, height: 160 }} />
          <View style={styles.textBlock}>
            <Text style={styles.errorTextHeader}>
              {I18n.t(errorTitle) + '.'}
            </Text>
            <Text numberOfLines={5} style={styles.errorText}>
              {errorText}
            </Text>
          </View>
        </View>
        <View style={styles.buttonBlock}>
          <Button
            raised
            onPress={this.goBack.bind(this)}
            style={{
              container: styles.buttonContainer,
              text: styles.buttonText,
            }}
            upperCase={false}
            text={I18n.t(strings.GO_BACK)}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (): {} => ({})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  navigateBack: (routeName: string) =>
    dispatch(navigationActions.navigatorReset({ routeName })),
})

export const Exception = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExceptionComponent)
