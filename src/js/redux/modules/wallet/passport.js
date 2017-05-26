import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import {listOfCountries as options} from '../../../lib/list-of-countries'
import {
  setPhysicalAddressField,
  checkForNonValidFields,
  submitChanges,
  genderList,
  changeFieldValue
} from '../../../lib/passport-util'

const actions = module.exports = makeActions('wallet/passport', {
  save: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.validate())
        const {passport, showErrors} = getState().toJS().wallet.passport
        const {webId} = getState().toJS().wallet.identity
        if (!showErrors) {
          dispatch(actions.save.buildAction(params,
          () => submitChanges({backend, services, passport, webId})
          )).then(() => dispatch(router.pushRoute('/wallet/identity')))
        }
      }
    }
  },
  validate: {
    expectedParams: []
  },
  cancel: {
    expectedParams: [],
    creator: params => {
      return dispatch => {
        dispatch(router.pushRoute('/wallet/identity'))
      }
    }
  },
  showPhysicalAddress: {
    expectedParams: ['value']
  },
  retrievePassportInformation: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, {services, backend}) => {
        dispatch(actions.retrievePassportInformation.buildAction(params,
          () => backend.solid.getUserInformation()
        ))
      }
    }
  },
  goToSelectBirthCountry: {
    expectedParams: ['field'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/passport/select-birth-country'))
      }
    }
  },
  goToSelectCountry: {
    expectedParams: ['field'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/passport/select-country'))
      }
    }
  },
  changePassportField: {
    expectedParams: ['field', 'value']
  },
  changePhysicalAddressField: {
    expectedParams: ['field', 'value']
  }
})

const initialState = module.exports.initialState = Immutable.fromJS({
  loaded: false,
  showErrors: false,
  focussedGroup: null,
  foccusedField: null,
  passport: {
    locations: {title: '', streetWithNumber: '', zip: '', city: ''},
    number: {value: '', valid: false},
    expirationDate: {value: '', valid: false},
    firstName: {value: '', valid: false},
    lastName: {value: '', valid: false},
    gender: {value: '', valid: false, options: genderList},
    birthDate: {value: '', valid: false},
    birthPlace: {value: '', valid: false},
    birthCountry: {value: '', valid: false, options},
    showAddress: false,
    physicalAddress: {
      streetWithNumber: {value: '', valid: false},
      zip: {value: '', valid: false},
      city: {value: '', valid: false},
      state: {value: '', valid: false},
      country: {value: '', valid: false, options}
    }
  }
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.cancel.id:
      return initialState

    case actions.changePassportField.id:
      return changeFieldValue(state, action)

    case actions.save.id:
      return state.merge({
        loaded: false,
        showErrors: false
      })

    case actions.save.id_fail:
      return state.merge({
        showErrors: true,
        loaded: true
      })

    case actions.save.id_success:
      return state.merge({
        loaded: true,
        showErrors: false
      })

    case actions.retrievePassportInformation.id:
      return state.merge({
        loaded: false
      })

    case actions.retrievePassportInformation.id_fail:
      return state.merge({
        loaded: true,
        showErrors: true
      })

    case actions.retrievePassportInformation.id_success:
      return state.merge({
        loaded: true,
        showErrors: false
      })

    case actions.showPhysicalAddress.id:
      return state.mergeIn(['passport'], {
        showAddress: !state.getIn(['passport', 'showAddress'])
      })

    case actions.changePhysicalAddressField.id:
      return setPhysicalAddressField(state, action)

    case actions.validate.id:
      return checkForNonValidFields(state)

    default:
      return state
  }
}
