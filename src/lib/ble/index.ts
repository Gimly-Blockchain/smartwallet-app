import { Device, BleManager } from 'react-native-ble-plx';
import { JSONWebToken, JWTEncodable } from 'jolocom-lib/js/interactionTokens/JSONWebToken';
import { SendResponse } from 'src/lib/transportLayers'

export type BleSerialConnectionConfig = {
  serviceUUID: string,
  rxUUID: string,
  txUUID: string,
}

// a generator function to be passed in to the listen function as the callback
// This function will reduce together a token until delimiter and then call a callback function
// with the result
const waitForToken = (
  delimiter: string
) => (
  callback: (jwt: string) => void
) => function*(
  received: string
) {
  do {
    received += yield
  } while (!received.includes(delimiter, -1))
    callback(received.slice(0, received.indexOf(delimiter)))
}

// a higher order function to send data in ~200b blocks
const writeAll = (
  size: number
) => (
  write: (toWrite: string) => Promise<void>
) => async (
  toWrite: string
) => write(toWrite.slice(0, size))
  .then(async _ => {
    if (toWrite.length > size) await writeAll(size)(write)(toWrite.slice(size))
  })
  .catch(err => console.error(err.toString()))

export const openSerialConnection = (
  manager: BleManager
) => (
  d: Device,
  serialUUIDs: BleSerialConnectionConfig
) => (
  onRxDispatch: (send: SendResponse) => (e: string) => Promise<any>
) => d.isConnected().then(async connected => {
  if (!connected) throw new Error("Device not connected")

  const b = waitForToken('\n')(
    onRxDispatch(
      (token: JSONWebToken<JWTEncodable>) => writeAll(
        // ensure the mtu is rounded to the nearest 3 to have 0 padding in the base64 encoded packets
        // iOS uses a buffer implementation which requires correct padding, this lets us send blocks
        // on iOS properly
        d.mtu - (d.mtu % 3) - 3
      )(
        (toWrite: string) => d.writeCharacteristicWithResponseForService(
          serialUUIDs.serviceUUID,
          serialUUIDs.rxUUID,
          toWrite
        ).then(_ => { })
      )(
        Buffer.from(token.encode() + '\n', 'ascii').toString('base64')
      )
        .then(_ => d.cancelConnection())
        .then(d => true)
        .catch(err => false)
        // .finally(() => manager.destroy())
    )
  )('')

  b.next('')

  d.monitorCharacteristicForService(
    serialUUIDs.serviceUUID,
    serialUUIDs.txUUID,
    (err, characteristic) => {
      if (err) console.log(err)
      if (characteristic && characteristic.value)
        b.next(Buffer.from(characteristic.value, 'base64').toString('ascii'))
    })
})
