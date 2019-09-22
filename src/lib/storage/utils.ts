import { groupBy } from 'ramda'
import { CredentialEntity, VerifiableCredentialEntity } from './entities'

interface ModifiedCredentialEntity {
  propertyName: string
  propertyValue: string[]
  verifiableCredential: VerifiableCredentialEntity
}

/**
 * Given an array of Credential Entities, will attempt to group them by
 * the credential they are part of, and return a sumarry, contain a key name
 * and an array of aggregated values
 * @param credentials - Credential Entities to group. If all claims are part of different
 * credentials, the array is returned unmodified
 */

export const groupAttributesByCredentialId = (
  credentials: CredentialEntity[],
): ModifiedCredentialEntity[] => {
  /** @dev We get a number of credential entities. Each contains one claim. We first
   * group all entities part of the same credential together (i.e. given name, family name)
   */
  const groupeByCredential = Object.values(
    groupBy(
      (credential: CredentialEntity) => credential.verifiableCredential.id,
      credentials,
    ),
  )

  return groupeByCredential.map<ModifiedCredentialEntity>(credentials => {
    return {
      ...credentials[0],
      propertyValue: credentials.map(cred => cred.propertyValue),
    }
  })
}
