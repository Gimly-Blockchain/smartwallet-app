import { navigationActions, genericActions } from 'src/actions/'
import { routeList } from 'src/routeList'
import * as loading from 'src/actions/registration/loadingStages'
import { setDid } from 'src/actions/account'
import { JolocomLib } from 'jolocom-lib'
const bip39 = require('bip39')
import { generateSecureRandomBytes } from 'src/lib/util'
import { AppError, ErrorCode } from 'src/lib/errors'
import { ThunkAction } from '../../store'

export const setLoadingMsg = (loadingMsg: string) => ({
  type: 'SET_LOADING_MSG',
  value: loadingMsg,
})

export const startRegistration = (): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  try {
    const randomPassword = await generateSecureRandomBytes(32)
    const entropy = await generateSecureRandomBytes(16)
    const encodedEntropy = entropy.toString('hex')
    await backendMiddleware.keyChainLib.savePassword(
      randomPassword.toString('base64'),
    )
    dispatch(
      navigationActions.navigatorReset({
        routeName: routeList.Loading,
      }),
    )
    dispatch(setLoadingMsg(loading.loadingStages[0]))
    return dispatch(createIdentity(encodedEntropy))
  } catch (err) {
    return dispatch(genericActions.showErrorScreen(err, routeList.Landing))
  }
}

export const finishRegistration = () =>
  navigationActions.navigatorReset({ routeName: routeList.Home })

export const createIdentity = (encodedEntropy: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const { encryptionLib, keyChainLib, storageLib, registry } = backendMiddleware

  try {
    const password = await keyChainLib.getPassword()
    const encEntropy = encryptionLib.encryptWithPass({
      data: encodedEntropy,
      pass: password,
    })
    const entropyData = { encryptedEntropy: encEntropy, timestamp: Date.now() }
    await storageLib.store.encryptedSeed(entropyData)
    const userVault = JolocomLib.KeyProvider.fromSeed(
      Buffer.from(encodedEntropy, 'hex'),
      password,
    )

    dispatch(setLoadingMsg(loading.loadingStages[1]))

    await JolocomLib.util.fuelKeyWithEther(
      userVault.getPublicKey({
        encryptionPass: password,
        derivationPath: JolocomLib.KeyTypes.ethereumKey,
      }),
    )

    dispatch(setLoadingMsg(loading.loadingStages[2]))
    const identityWallet = await registry.create(userVault, password)

    const personaData = {
      did: identityWallet.identity.did,
      controllingKeyPath: JolocomLib.KeyTypes.jolocomIdentityKey,
    }

    await storageLib.store.persona(personaData)
    dispatch(setDid(identityWallet.identity.did))
    dispatch(setLoadingMsg(loading.loadingStages[3]))
    await backendMiddleware.setIdentityWallet(userVault, password)

    return dispatch(
      navigationActions.navigatorReset({
        routeName: routeList.SeedPhrase,
        params: { mnemonic: bip39.entropyToMnemonic(encodedEntropy) },
      }),
    )
  } catch (error) {
    return dispatch(
      genericActions.showErrorScreen(
        new AppError(ErrorCode.RegistrationFailed, error),
        routeList.Landing,
      ),
    )
  }
}
