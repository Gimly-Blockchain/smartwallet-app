import { buildTransform, Filter } from './filter'
import { DecoratedClaims } from 'src/reducers/account'

const expiredFilter: Filter<DecoratedClaims> = cred =>
  cred.expires ? cred.expires.valueOf() >= new Date().valueOf() : true

const issuerFilter = (issuerDid: string): Filter<DecoratedClaims> => cred =>
  cred.issuer === issuerDid

const typeFilter = (typ: string): Filter<DecoratedClaims> => cred =>
  cred.credentialType.includes(typ)

/**
 * @dev Some basic predefined filters, if required they can be removed
 * and the filtering / ordering construction functions can be exposed instead
 */

export const filters = {
  filterByExpired: buildTransform<DecoratedClaims>([expiredFilter]),
  filterByIssuer: (did: string) =>
    buildTransform<DecoratedClaims>([issuerFilter(did)]),
  filterByType: (typ: string) =>
    buildTransform<DecoratedClaims>([typeFilter(typ)]),
  documentFilter: (documentTypes: string[]) =>
    buildTransform<DecoratedClaims>(documentTypes.map(typeFilter)),
}
