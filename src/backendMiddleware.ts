import { JolocomLib } from 'jolocom-lib'
import { IdentityWallet } from 'jolocom-lib/js/identityWallet/identityWallet'
import { EthereumLib, EthereumLibInterface } from 'src/lib/ethereum'
import { EncryptionLib, EncryptionLibInterface } from 'src/lib/crypto'
import { Storage } from 'src/lib/storage/storage'
import { KeyChain, KeyChainInterface } from 'src/lib/keychain'
import { ConnectionOptions } from 'typeorm/browser'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { IRegistry } from 'jolocom-lib/js/registries/types'
import { createJolocomRegistry } from 'jolocom-lib/js/registries/jolocomRegistry'

export class BackendMiddleware {
  identityWallet!: IdentityWallet
  ethereumLib: EthereumLibInterface
  storageLib: Storage
  encryptionLib: EncryptionLibInterface
  keyChainLib: KeyChainInterface
  registry: IRegistry

  constructor(config: {
    fuelingEndpoint: string
    typeOrmConfig: ConnectionOptions
  }) {
    this.ethereumLib = new EthereumLib(config.fuelingEndpoint)
    this.storageLib = new Storage(config.typeOrmConfig)
    this.encryptionLib = new EncryptionLib()
    this.keyChainLib = new KeyChain()
    this.registry = createJolocomRegistry()
  }

  async setIdentityWallet(
    userVault: SoftwareKeyProvider,
    pass: string,
  ): Promise<void> {
    const { jolocomIdentityKey } = JolocomLib.KeyTypes
    this.identityWallet = await this.registry.authenticate(userVault, {
      encryptionPass: pass,
      derivationPath: jolocomIdentityKey,
    })
  }
}
