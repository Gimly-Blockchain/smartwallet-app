import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { IssuerCard } from 'src/ui/documents/components/issuerCard'
import { DecoratedClaims } from 'src/reducers/account'
import { prepareLabel } from 'src/lib/util'
import { Typography, Colors } from 'src/styles'

interface Props {
  document: DecoratedClaims
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
  },
  sectionHeader: {
    ...Typography.sectionHeader,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  claimsContainer: {
    borderColor: Colors.lightGrey,
    borderTopWidth: 1,
  },
  claimCard: {
    backgroundColor: Colors.white,
    borderColor: Colors.lightGrey,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  claimCardTextContainer: {
    paddingHorizontal: 30,
  },
  claimCardTitle: {
    ...Typography.baseFontStyles,
    fontSize: Typography.textXS,
    color: Colors.blackMain040,
  },
  claimCardData: {
    ...Typography.standardText,
    color: Colors.blackMain,
  },
})

export const DocumentDetails: React.SFC<Props> = ({ document }) => {
  if (!document) return null

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Issued by</Text>
      {IssuerCard(document.issuer)}
      <Text style={styles.sectionHeader}>Details</Text>
      <View style={styles.claimsContainer}>
        {Object.keys(document.claimData).map(key => (
          <View key={key} style={styles.claimCard}>
            <View style={styles.claimCardTextContainer}>
              <Text style={styles.claimCardTitle}>{prepareLabel(key)}</Text>
              <Text style={styles.claimCardData}>
                {document.claimData[key]}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
