import { BleManager, Device, Service, Characteristic, Subscription } from 'react-native-ble-plx';
import { reject } from 'q';

// need a way to delay response without breaking connection

// open screen
// start scanning
// choose connection
// open connection
// read
// close screen (navigate to consent screen)
// write ?

type BleSerialConnectionConfig = {
    prefixUUID: string,
    suffixUUID: string,
}

// type Device = {}

type SerialConnection = {
    write: (toWrite: string) => Promise<any>,
    listen: (callback: (line: string) => void) => Subscription,
    close: () => Promise<{}>
}

export const openSerialConnection = (d: Device, uuid: BleSerialConnectionConfig = {
    prefixUUID: "6e40000",
    suffixUUID: "-b5a3-f393-e0a9-e50e24dcca9e"
}): Promise<SerialConnection> => d.isConnected().then(connected => connected
    ? {
        write: (toWrite: string) => d.writeCharacteristicWithResponseForService(
            uuid.prefixUUID + "1" + uuid.suffixUUID,
            uuid.prefixUUID + "3" + uuid.suffixUUID,
            toWrite),
        listen: (callback: (line: string) => void) => d.monitorCharacteristicForService(
            uuid.prefixUUID + "1" + uuid.suffixUUID,
            uuid.prefixUUID + "2" + uuid.suffixUUID,
            (error, characteristic) => {
                if (characteristic && characteristic.value) {
                    callback(characteristic.value)
                }
            }
        ),
        close: () => d.cancelConnection()
    }
    : reject("Device Not Connected"))

// two steps:
// 1. present a list of connections (narrowing by uuids)

// function for showing list of connections
// connection menu as a function which takes a selection and returns a serial port
//
// serial port as:
// 1. a function which takes a callback and calls it with every new recieve
// 2. a function to send

type ConnectionManager = {
    scanForDevices: (uuids: string[]) => Promise<(Device: ) => string>[],
    establishConnection: (device: Device) => Promise<SerialConnection>
}

