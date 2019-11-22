import React from 'react'
import { Text, View } from 'react-native'
import { styles } from './styles'
import strings from '../../../locales/strings'
import { DropdownIcon } from '../../../resources'
import ModalDropdown from 'react-native-modal-dropdown'
import { Inputs } from '../containers/errorReporting'
import I18n from 'src/locales/i18n'

interface PositionStyle {
  left?: number
  right?: number
  width?: number
  top?: number
}

interface Props {
  currentInput: Inputs
  pickedIssue: string | undefined
  onIssuePick: (issue: string) => void
  setInput: (input: Inputs) => void
}

export const ChooseIssueSection = (props: Props) => {
  const { currentInput, pickedIssue, onIssuePick, setInput } = props

  const issueList = [
    I18n.t(strings.NO_INTERNET_CONNECTION),
    I18n.t(strings.CRASH),
    I18n.t(strings.CANT_LOGIN),
    I18n.t(strings.BACKUP_IS_EMPTY),
    I18n.t(strings.CANT_REACH_SOME_ELEMENTS),
    I18n.t(strings.IM_JUST_ANNOYING),
    I18n.t(strings.OTHER_REASON),
  ]

  return (
    <View style={styles.sectionWrapper}>
      <Text style={styles.sectionTitle}>
        {I18n.t(strings.CHOOSE_THE_ISSUE)}
      </Text>
      <View style={{ marginTop: 20 }}>
        <View style={styles.pickerIconWrapper}>
          <DropdownIcon
            style={{
              zIndex: 2,
              transform:
                currentInput === Inputs.Dropdown
                  ? [{ rotate: '180deg' }]
                  : [{ rotate: '360deg' }],
            }}
          />
        </View>
        <ModalDropdown
          options={issueList}
          style={{
            ...styles.pickerWrapper,
            ...(currentInput === Inputs.Dropdown
              ? styles.highlightBorder
              : styles.defaultBorder),
          }}
          textStyle={{
            ...styles.inputText,
            ...(!pickedIssue ? styles.unselectedText : styles.defaultText),
          }}
          defaultValue={I18n.t(strings.CHOOSE_RELATED)}
          renderSeparator={() => null}
          dropdownTextHighlightStyle={styles.selectedText}
          dropdownStyle={styles.pickerDropDown}
          dropdownTextStyle={{
            ...styles.inputText,
            ...styles.pickerDropdownText,
          }}
          adjustFrame={(position: PositionStyle) => ({
            left: 20,
            right: 20,
            top: position.top && position.top + 15,
            height: 'auto',
          })}
          onSelect={(_index, value) => {
            onIssuePick(value)
          }}
          onDropdownWillShow={() => {
            setInput(Inputs.Dropdown)
            return true
          }}
          onDropdownWillHide={() => {
            setInput(Inputs.None)
            return true
          }}
        />
      </View>
    </View>
  )
}
