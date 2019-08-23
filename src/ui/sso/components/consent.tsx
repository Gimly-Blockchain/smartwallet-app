import React from 'react'
import { Text, ScrollView, View, StyleSheet } from 'react-native'
import { Container } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { StateTypeSummary, StateVerificationSummary } from 'src/reducers/sso'
import { IconToggle } from 'react-native-material-ui'
import { getCredentialIconByType } from 'src/resources/util'
import { ButtonSection } from 'src/ui/structure/buttonSectionBottom'
import { ConsentAttributeCard, HeaderSection } from './claimCard'
import I18n from 'src/locales/i18n'
import { IdentitySummary } from '../../../actions/sso/types'
import { IssuerCard } from '../../documents/components/issuerCard'
import strings from '../../../locales/strings'
import { Typography, Colors, Spacing } from 'src/styles'

interface Props {
  did: string
  requester: IdentitySummary
  callbackURL: string
  availableCredentials: StateTypeSummary[]
  handleSubmitClaims: (credentials: StateVerificationSummary[]) => void
  handleDenySubmit: () => void
}

interface State {
  pending: boolean
  selectedCredentials: {
    [type: string]: StateVerificationSummary | undefined
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundLightMain,
    alignItems: 'stretch',
  },
  topSection: {
    flex: 0.3,
    marginTop: Spacing.XL,
  },
  messageContainer: {
    marginTop: Spacing.LG,
    paddingHorizontal: '5%',
  },
  message: {
    ...Typography.subMainText,
    color: Colors.blackMain,
  },
  claimsSection: {
    marginTop: Spacing.MD,
    flex: 0.6,
  },
  buttonSection: {
    flex: 0.1,
  },
})

export class ConsentComponent extends React.Component<Props, State> {
  state: State = {
    pending: false,
    selectedCredentials: this.props.availableCredentials.reduce(
      (acc, curr) => ({ ...acc, [curr.type]: undefined }),
      {},
    ),
  }

  private handleAttributeSelect(
    type: string,
    selectedCredential: StateVerificationSummary,
  ) {
    const selected = this.state.selectedCredentials[type]
    if (selected && selected.id === selectedCredential.id) {
      this.setState({
        selectedCredentials: {
          ...this.state.selectedCredentials,
          [type]: undefined,
        },
      })
    } else {
      this.setState({
        selectedCredentials: {
          ...this.state.selectedCredentials,
          [type]: selectedCredential,
        },
      })
    }
  }

  private handleSubmitClaims = () => {
    const { selectedCredentials } = this.state
    const credentials = Object.keys(selectedCredentials).map(
      key => selectedCredentials[key],
    )
    this.setState({ pending: true })
    this.props.handleSubmitClaims(credentials as StateVerificationSummary[])
  }

  private renderButtons() {
    const { selectedCredentials } = this.state

    const submitAllowed = Object.keys(selectedCredentials).every(
      key => selectedCredentials[key] !== undefined,
    )
    const buttonDisabled = !submitAllowed || this.state.pending

    return (
      <ButtonSection
        disabled={buttonDisabled}
        denyDisabled={this.state.pending}
        confirmText={I18n.t(strings.SHARE_CLAIMS)}
        denyText={I18n.t(strings.DENY)}
        handleConfirm={() => this.handleSubmitClaims()}
        handleDeny={() => this.props.handleDenySubmit()}
      />
    )
  }

  private renderFirstSection() {
    return (
      <View style={styles.topSection}>
        {IssuerCard(this.props.requester)}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            {I18n.t(
              strings.THIS_SERVICE_IS_ASKING_YOU_TO_SHARE_THE_FOLLOWING_CLAIMS,
            )}
            :
          </Text>
        </View>
      </View>
    )
  }

  private renderRightIcon(selected: boolean, entry: StateTypeSummary) {
    const checkboxColor = selected
      ? JolocomTheme.primaryColorPurple
      : JolocomTheme.disabledButtonBackgroundGrey
    const { type, verifications } = entry

    return (
      <IconToggle
        name={selected ? 'check-circle' : 'fiber-manual-record'}
        onPress={() => this.handleAttributeSelect(type, verifications[0])}
        color={checkboxColor}
      />
    )
  }

  private renderLeftIcon(type: string) {
    return getCredentialIconByType(type)
  }

  private renderSelectionSections(sections: StateTypeSummary[]) {
    const groupedByType = sections.reduce<{
      [key: string]: StateTypeSummary[]
    }>(
      (acc, current) =>
        acc[current.type]
          ? { ...acc, [current.type]: [...acc[current.type], current] }
          : { ...acc, [current.type]: [current] },
      {},
    )

    return Object.keys(groupedByType).map(sectionType => (
      <View>
        {groupedByType[sectionType].map((entry, idx, arr) =>
          this.renderCredentialCards(entry, idx, arr),
        )}
      </View>
    ))
  }

  private renderCredentialCards(
    entry: StateTypeSummary,
    idx: number,
    arr: StateTypeSummary[],
  ) {
    const isFirst = idx === 0
    const isLast = idx === arr.length - 1
    const { type, values, verifications } = entry
    const currentlySelected = this.state.selectedCredentials[type]
    const isSelected =
      currentlySelected && currentlySelected.id === verifications[0].id
    const containsData = entry.values.length > 0

    const headerSection = isFirst ? (
      <HeaderSection
        containerStyle={{ paddingTop: '5%' }}
        title={`${type}:`}
        leftIcon={this.renderLeftIcon(type)}
      />
    ) : null

    return (
      <View>
        {headerSection}
        <ConsentAttributeCard
          containerStyle={{ paddingLeft: '20%' }}
          split={isLast}
          rightIcon={
            containsData ? this.renderRightIcon(!!isSelected, entry) : null
          }
          did={this.props.did}
          values={values}
          issuer={(verifications[0] && verifications[0].issuer) || {}}
        />
      </View>
    )
  }

  render() {
    return (
      <Container style={styles.container}>
        {this.renderFirstSection()}
        <View style={styles.claimsSection}>
          <ScrollView style={{ width: '100%' }}>
            {this.renderSelectionSections(this.props.availableCredentials)}
          </ScrollView>
        </View>
        <View style={styles.buttonSection}>{this.renderButtons()}</View>
      </Container>
    )
  }
}
