import React from 'react'
import { connect } from 'react-redux'
import { NavigationScreenProps } from 'react-navigation'
import { View, StyleSheet, ScrollView } from 'react-native'
import { ClaimInterface } from 'cred-types-jolocom-core'
import { RootState } from 'src/reducers/'
import I18n from 'src/locales/i18n'
import { DocumentCard } from '../components/documentCard'
import { DocumentDetails as DocumentDetailsComponent } from '../components/documentDetails'
import strings from '../../../locales/strings'
import { JolocomTheme } from 'src/styles/jolocom-theme.ios'

interface Props
  extends ReturnType<typeof mapStateToProps>,
    NavigationScreenProps {}

interface State {}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: JolocomTheme.primaryColorGrey,
  },
  documentCardContainer: {
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export class DocumentDetailsContainer extends React.Component<Props, State> {
  public static navigationOptions = ({
    navigation,
    navigationOptions,
  }: NavigationScreenProps) => ({
    ...navigationOptions,
    // FIXME needs to be changed to this on update to react-navigation
    // headerTitle: navigation.getParam('headerTitle', ''),
    headerTitle: navigation.state.params && navigation.state.params.headerTitle,
  })

  public componentWillMount() {
    const { document } = this.props
    // FIXME use filter from src/lib/filterDecoratedClaims
    const isExpired = document.expires
      ? document.expires.valueOf() < new Date().valueOf()
      : true

    let headerTitle = (document.claimData as ClaimInterface).type
    if (isExpired) headerTitle = `[${I18n.t(strings.EXPIRED)}] ${headerTitle}`
    this.props.navigation.setParams({ headerTitle })
  }

  public render(): JSX.Element {
    const { document } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.documentCardContainer}>
          <DocumentCard document={document} />
        </View>
        <ScrollView>
          <DocumentDetailsComponent document={document} />
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  document: state.documents.selectedDocument,
})

export const DocumentDetails = connect(mapStateToProps)(
  DocumentDetailsContainer,
)
