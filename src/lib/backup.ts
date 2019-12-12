import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import {
  IKeyDerivationArgs,
  KeyTypes,
} from 'jolocom-lib/js/vaultedKeyProvider/types'
import * as crypto from 'crypto'
import { ISignedCredentialAttrs } from 'jolocom-lib/js/credentials/signedCredential/types'
import { CredentialMetadataSummary } from './storage/storage'

export const BACKUP_SERVER_URI = 'https://backup.jolocom.io'

export interface BackupData {
  did: string
  credentials: ISignedCredentialAttrs[]
  credentialMetadata: CredentialMetadataSummary[]
}

export async function backupData(
  userData: BackupData,
  softwareKeyProvider: SoftwareKeyProvider,
  password: string,
): Promise<void> {
  const derivationArgs: IKeyDerivationArgs = {
    derivationPath: KeyTypes.jolocomIdentityKey,
    encryptionPass: password,
  }
  const auth = generateAuthenticationData(softwareKeyProvider, password)
  const data = await softwareKeyProvider.encryptHybrid(userData, derivationArgs)

  await fetch(BACKUP_SERVER_URI + '/store-backup', {
    method: 'POST',
    body: JSON.stringify({ auth, data }),
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function fetchBackup(
  softwareKeyProvider: SoftwareKeyProvider,
  password: string,
): Promise<BackupData | undefined> {
  const derivationArgs: IKeyDerivationArgs = {
    derivationPath: KeyTypes.jolocomIdentityKey,
    encryptionPass: password,
  }
  const auth = generateAuthenticationData(softwareKeyProvider, password)

  const response = await fetch(BACKUP_SERVER_URI + '/get-backup', {
    method: 'POST',
    body: JSON.stringify({ auth }),
    headers: { 'Content-Type': 'application/json' },
  })

  if (response.status === 404) return
  else if (response.status === 200) {
    const body = await response.json()
    return (await softwareKeyProvider.decryptHybrid(
      body,
      derivationArgs,
    )) as BackupData
  }
  throw new Error(`Unexpected Response (${response.status})`)
}

export async function deleteBackup(
  softwareKeyProvider: SoftwareKeyProvider,
  password: string,
): Promise<void> {
  const auth = generateAuthenticationData(softwareKeyProvider, password)
  const response = await fetch(BACKUP_SERVER_URI + '/delete-backup', {
    method: 'POST',
    body: JSON.stringify({ auth }),
    headers: { 'Content-Type': 'application/json' },
  })
  if (response.status === 200) return
  else console.warn(response.status, response.statusText)
}

function generateAuthenticationData(
  softwareKeyProvider: SoftwareKeyProvider,
  password: string,
) {
  const derivationArgs: IKeyDerivationArgs = {
    derivationPath: KeyTypes.jolocomIdentityKey,
    encryptionPass: password,
  }
  const date = new Date().toISOString()
  const dateHash = crypto
    .createHash('sha256')
    .update(date)
    .digest()
  const sig = softwareKeyProvider.sign(derivationArgs, dateHash)

  return {
    pubKey: softwareKeyProvider.getPublicKey(derivationArgs).toString('hex'),
    date,
    sig: sig.toString('hex'),
  }
}
