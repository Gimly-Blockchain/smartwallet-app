import React from 'react'
import { ButtonSection } from 'src/ui/structure/buttonSectionBottom'
import { Text, StyleSheet, View, Image } from 'react-native'
import I18n from 'src/locales/i18n'
import { StateAuthenticationRequestSummary } from 'src/reducers/sso'
import { JolocomTheme } from 'src/styles/jolocom-theme.ios'
const nameIcon = require('src/resources/svg/NameIcon.js')

interface Props {
  activeAuthenticationRequest: StateAuthenticationRequestSummary
  cancelAuthenticationRequest: () => void
  confirmAuthenticationRequest: () => void
}

interface State {}

const debug = {
  // borderColor: 'red',
  // borderWidth: 1,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  requesterContainer: {
    ...debug,
    flexDirection: 'row',
    backgroundColor: JolocomTheme.primaryColorWhite,
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 25,
  },
  requesterIconContainer: {
    ...debug,
  },
  requesterIcon: {
    backgroundColor: JolocomTheme.primaryColorGrey,
    width: 42,
    height: 42,
  },
  requesterTextContainer: {
    ...debug,
    marginLeft: 16,
    flex: -1,
  },
  requestContainer: {
    ...debug,
    flex: 1,
    paddingHorizontal: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestText: {
    ...JolocomTheme.textStyles.light.textDisplayField,
    textAlign: 'center',
    fontWeight: '300',
    marginTop: 10,
  },
  buttonContainer: {
    ...debug,
  },
})

export class AuthenticationConsentComponent extends React.Component<
  Props,
  State
> {
  state = {
    pending: false,
  }

  private handleConfirm = () => {
    this.setState({ pending: true })
    this.props.confirmAuthenticationRequest()
  }

  private renderButtons() {
    return (
      <ButtonSection
        disabled={this.state.pending}
        confirmText={I18n.t('Authorize')}
        denyText={I18n.t('Deny')}
        handleConfirm={this.handleConfirm}
        handleDeny={() => this.props.cancelAuthenticationRequest()}
        resetDeny
        verticalPadding={10}
      />
    )
  }

  render() {
    const {
      requester,
      callbackURL,
      description,
    } = this.props.activeAuthenticationRequest
    return (
      <View style={styles.container}>
        <View style={styles.requesterContainer}>
          <View style={styles.requesterIconContainer}>
            <Image source={nameIcon} style={styles.requesterIcon} />
          </View>
          <View style={styles.requesterTextContainer}>
            <Text
              style={JolocomTheme.textStyles.light.textDisplayField}
              numberOfLines={1}
            >
              {requester}
            </Text>
            <Text
              style={JolocomTheme.textStyles.light.labelDisplayField}
              numberOfLines={1}
            >
              {callbackURL}
            </Text>
          </View>
        </View>
        <View style={styles.requestContainer}>
          <Text style={styles.requestText}>{I18n.t('Would you like to')}</Text>
          <Text style={[styles.requestText, { fontSize: 42 }]}>
            {description}
          </Text>
          <Text style={styles.requestText}>
            {I18n.t('with your SmartWallet?')}
          </Text>
        </View>
        {this.renderButtons()}
      </View>
    )
  }
}
