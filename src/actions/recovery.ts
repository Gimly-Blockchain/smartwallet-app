import { ThunkAction } from '../store'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { navigationActions } from './index'
import { routeList } from '../routeList'
import settingKeys from '../ui/settings/settingKeys'

export const showSeedPhrase = (): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const encryptedSeed = await backendMiddleware.storageLib.get.encryptedSeed()
  if (!encryptedSeed) {
    throw new Error('Can not retrieve Seed from database')
  }
  // TODO create vault from encrypted Seed
  const pass = await backendMiddleware.keyChainLib.getPassword()
  const decrypt = backendMiddleware.encryptionLib.decryptWithPass({
    cipher: encryptedSeed,
    pass,
  })
  const vault = SoftwareKeyProvider.fromSeed(Buffer.from(decrypt, 'hex'), pass)
  const mnemonic = vault.getMnemonic(pass)
  return dispatch(
    navigationActions.navigate({
      routeName: routeList.SeedPhrase,
      params: { mnemonic },
    }),
  )
}

export const setSeedPhraseSaved = (): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  await backendMiddleware.storageLib.store.setting(
    settingKeys.seedPhraseSaved,
    true,
  )
  dispatch({
    type: 'SET_SEED_PHRASE_SAVED',
  })
  return dispatch(navigationActions.navigatorResetHome())
}
