import React from 'react'
import { StyleSheet, Text, ScrollView, View } from 'react-native'
import { DecoratedClaims } from 'src/reducers/account'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { prepareLabel } from 'src/lib/util'
import { CredentialTopCard } from './credentialTopCard'
import I18n from 'src/locales/i18n'
import en from '../../../locales/en'

interface Props {
  credentialToRender: DecoratedClaims
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: JolocomTheme.secondaryColorGrey,
  },
  topSection: {
    padding: 30,
  },
  issuerSection: {},
  issuerContainer: {
    flexDirection: 'row',
    backgroundColor: JolocomTheme.primaryColorWhite,
    paddingVertical: 18,
    paddingLeft: 15,
    paddingRight: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ececec',
  },
  issuerIcon: {
    backgroundColor: JolocomTheme.primaryColorGrey,
    width: 42,
    height: 42,
  },
  issuerTextContainer: {
    marginLeft: 16,
  },
  issuerText: {
    fontSize: 17,
    color: JolocomTheme.primaryColorPurple,
    fontFamily: JolocomTheme.contentFontFamily,
  },
  sectionHeader: {
    fontSize: 17,
    fontFamily: JolocomTheme.contentFontFamily,
    color: 'rgba(0, 0, 0, 0.4)',
    marginBottom: 10,
    paddingLeft: 16,
    alignSelf: 'flex-start',
  },
  claimsSection: {
    marginTop: 30,
    flex: 1,
  },
  claimsList: {
    borderTopWidth: 1,
    borderColor: '#ececec',
  },
  claimCard: {
    backgroundColor: JolocomTheme.primaryColorWhite,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ececec',
  },
  claimCardTextContainer: {
    paddingHorizontal: 30,
  },
  claimCardTitle: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 17,
    fontFamily: JolocomTheme.contentFontFamily,
  },
})

const renderIssuerCard = (issuer: string): JSX.Element => (
  <View style={styles.issuerContainer}>
    {/* TODO: Add support for icon */}
    <View style={styles.issuerTextContainer}>
      <Text
        style={JolocomTheme.textStyles.light.textDisplayField}
        numberOfLines={1}
      >
        {I18n.t(en.NAME_OF_ISSUER)}
      </Text>
      <Text style={styles.issuerText} numberOfLines={1}>
        {issuer}
      </Text>
    </View>
  </View>
)

const renderClaims = (toRender: DecoratedClaims): JSX.Element[] => {
  const { claimData } = toRender
  return Object.keys(claimData).map(field => (
    <View key={claimData[field]} style={styles.claimCard}>
      <View style={styles.claimCardTextContainer}>
        <Text style={styles.claimCardTitle}>{prepareLabel(field)}</Text>
        <Text style={JolocomTheme.textStyles.light.textDisplayField}>
          {claimData[field]}
        </Text>
      </View>
    </View>
  ))
}

export const CredentialDialogComponent: React.SFC<Props> = (
  props: Props,
): JSX.Element => {
  const { credentialToRender } = props
  const { expires, credentialType, issuer } = credentialToRender

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <CredentialTopCard
          credentialName={credentialType}
          expiryDate={expires}
        />
      </View>

      <View style={styles.issuerSection}>
        <Text style={styles.sectionHeader}>Issued by </Text>
        {renderIssuerCard(issuer)}
      </View>

      <View style={styles.claimsSection}>
        <Text style={styles.sectionHeader}>
          {I18n.t(en.DOCUMENT_DETAILS_CLAIMS)}
        </Text>
        <ScrollView style={styles.claimsList}>
          {renderClaims(credentialToRender)}
        </ScrollView>
      </View>
    </View>
  )
}
