import * as React from 'react'
import { Block, CenteredText, Container } from '../../structure'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-material-ui'
import { JolocomTheme } from '../../../styles/jolocom-theme.android'

const styles = StyleSheet.create({
  mainContainerStyle: {
    paddingTop: 0,
    backgroundColor: '#05050d',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    flex: 1,
  },
  selectorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'stretch',
  },
  actionSelector: {
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ffdebc',
    margin: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#942F51',
  },
  title: {
    fontFamily: 'TTCommons',
    fontSize: 28,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 31,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffefdf',
  },
  subtitle: {
    opacity: 0.75,
    fontFamily: 'TTCommons',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 23,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffefdf',
  },
  buttonBlock: {
    flex: 0.1,
    backgroundColor: '#05050d',
  },
  buttonContainer: {
    height: 48,
    minWidth: 164,
    borderRadius: 4,
    backgroundColor: JolocomTheme.primaryColorPurple,
  },
  buttonText: {
    paddingVertical: 15,
    fontFamily: JolocomTheme.contentFontFamily,
    color: JolocomTheme.primaryColorWhite,
    fontSize: JolocomTheme.headerFontSize,
    fontWeight: '100',
    textAlign: 'center',
    minWidth: 158,
  },
})

interface InitActionProps {
  selectedItem: string
  selectOption: (key: string) => void
  handleButtonTap: () => void
}

const options = [
  {
    title: 'create new account',
    subtitle: 'if it is your first experience of Jolocom SmartWallet',
    key: 'create',
  },
  {
    title: 'recover your digital identity',
    subtitle: 'if it is your first experience of Jolocom SmartWallet',
    key: 'recover',
  },
]

const InitActionComponent = ({
  selectedItem,
  selectOption,
  handleButtonTap,
}: InitActionProps) => (
  <Container style={styles.mainContainerStyle}>
    <Block style={styles.selectorContainer}>
      {options.map(option => (
        <TouchableOpacity
          style={[
            styles.actionSelector,
            selectedItem === option.key && styles.selected,
          ]}
          onPress={() => selectOption(option.key)}
        >
          <CenteredText msg={option.title} style={styles.title} />
          <CenteredText msg={option.subtitle} style={styles.subtitle} />
        </TouchableOpacity>
      ))}
    </Block>
    <Block style={styles.buttonBlock}>
      <Button
        raised
        onPress={handleButtonTap}
        style={{
          container: styles.buttonContainer,
          text: styles.buttonText,
        }}
        upperCase={false}
        text={'Continue'}
      />
    </Block>
  </Container>
)
export default InitActionComponent
