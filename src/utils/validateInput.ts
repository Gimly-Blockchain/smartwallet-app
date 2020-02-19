export type InputValidator<T> = (input: T) => boolean

const passesAll = <T>(iv: InputValidator<T>[]) => (value: T) =>
  iv.map(fn => fn(value)).reduce((p, c) => p && c, true)

const isStringLengthValid = (maxLen: number): InputValidator<string> => (
  input: string,
): boolean => input.length < maxLen && input.length >= 0

const isOnlyNumbers: InputValidator<string> = input =>
  /^\+?(0|[1-9]\d*)$/.test(input)

const isAddressFieldValid = isStringLengthValid(100)
const isNameFieldValid = isStringLengthValid(100)
const isPhoneNumberValid = passesAll([isStringLengthValid(100), isOnlyNumbers])
const isEmailAddressValid = isStringLengthValid(100)

export const inputFieldValidators: {
  [credType: string]: InputValidator<string>
} = {
  Email: isEmailAddressValid,
  Name: isNameFieldValid,
  'Postal Address': isAddressFieldValid,
  'Mobile Phone': isPhoneNumberValid,
}
