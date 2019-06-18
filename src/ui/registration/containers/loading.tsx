import * as React from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as loading from 'src/actions/registration/loadingStages'
import { RootState } from 'src/reducers/'
import { Container, CenteredText, Block } from 'src/ui/structure/'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import I18n from 'src/locales/i18n'
import { ThunkDispatch } from 'src/store'
import strings from '../../../locales/strings'
const loaders = require('react-native-indicator')

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

export interface State {}

const styles = StyleSheet.create({
  label: {
    alignSelf: 'flex-start',
    marginBottom: '10%',
  },
  loadingMsg: {
    alignSelf: 'flex-end',
    marginBottom: '-10%',
  },
  container: {
    backgroundColor: JolocomTheme.primaryColorBlack,
    height: '100%',
  },
  dotsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  dotActive: {
    marginRight: 8,
    marginLeft: 8,
    color: JolocomTheme.primaryColorSand,
  },
  dotInactive: {
    marginRight: 5,
    marginLeft: 5,
    color: JolocomTheme.primaryColorGrey,
  },
  text: {
    color: JolocomTheme.primaryColorSand,
    fontSize: 20,
    fontFamily: JolocomTheme.contentFontFamily,
  },
  smallText: {
    color: JolocomTheme.primaryColorSand,
    fontSize: 14,
    fontFamily: JolocomTheme.contentFontFamily,
  },
})

// TODO SFC
export class LoadingContainer extends React.Component<Props, State> {
  render() {
    return (
      <Container style={styles.container}>
        <Block style={styles.label}>
          <CenteredText
            style={styles.text}
            msg={I18n.t(strings.GIVE_US_A_FEW_MOMENTS)}
          />
          <CenteredText
            style={styles.text}
            msg={I18n.t(strings.TO_SET_UP_YOUR_IDENTITY)}
          />
        </Block>
        <Block>
          <loaders.RippleLoader
            size={80}
            strokeWidth={4}
            color={JolocomTheme.spinnerColor}
          />
        </Block>
        <Block style={styles.loadingMsg}>
          <View style={styles.dotsContainer}>
            {[0, 1, 2, 3].map((prop, key) => {
              const stageNumber = loading.loadingStages.indexOf(
                this.props.loadingMsg,
              )
              return (
                <Icon
                  name="circle"
                  size={prop <= stageNumber ? 15 : 10}
                  style={
                    prop <= stageNumber ? styles.dotActive : styles.dotInactive
                  }
                  key={prop}
                />
              )
            })}
          </View>
          <View>
            <CenteredText
              style={styles.smallText}
              msg={this.props.loadingMsg}
            />
          </View>
        </Block>
      </Container>
    )
  }
}

const mapStateToProps = ({
  registration: {
    loading: { loadingMsg },
  },
}: RootState) => ({
  loadingMsg,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({})

export const Loading = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoadingContainer)
