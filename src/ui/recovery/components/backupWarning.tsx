import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, Text, View } from 'react-native'
import { ThunkDispatch } from 'src/store'
import { navigationActions } from '../../../actions'
import { routeList } from '../../../routeList'
import { RootState } from '../../../reducers'
import { default as IonIcon } from 'react-native-vector-icons/Ionicons'
import strings from '../../../locales/strings'
import * as I18n from 'i18n-js'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

interface State {
  activeDocumentIndex: number
  showingValid: boolean
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1a107',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 17,
    color: 'white',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  arrow: {
    marginLeft: 5,
  },
})

export class BackupWarningComponent extends React.Component<Props, State> {
  public render(): JSX.Element | null {
    if (!this.props.seedPhraseSaved) {
      return (
        <View style={styles.container} onTouchEnd={this.props.openSettings}>
          <IonIcon
            style={styles.icon}
            size={25}
            name={'ios-flash'}
            color={'white'}
          />
          <Text style={styles.text}>
            {I18n.t(strings.ACCOUNT_IS_AT_RISK) + ' '}
          </Text>
          <Text style={[styles.text, styles.underline]}>
            {I18n.t(strings.MAKE_IT_SECURE)}
          </Text>
          <IonIcon
            style={styles.arrow}
            size={20}
            name={'ios-arrow-round-forward'}
            color={'white'}
          />
        </View>
      )
    }
    return null
  }
}

const mapStateToProps = ({
  settings: { seedPhraseSaved: seedPhraseSaved },
}: RootState) => ({ seedPhraseSaved })

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  openSettings: () =>
    dispatch(navigationActions.navigate({ routeName: routeList.Settings })),
})

export const BackupWarning = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BackupWarningComponent)
