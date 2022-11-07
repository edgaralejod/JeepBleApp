import { Injectable } from '@angular/core';
import { 
  BleClient, 
  RequestBleDeviceOptions, 
  ScanResult,
  textToDataView } from '@capacitor-community/bluetooth-le';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BleService {
  public isInitialized = false;
  readonly controllerServiceUUID = "0492fcec-7194-11eb-9439-0242ac130002".toUpperCase();
  private subject: Subject<any> = new Subject<any>();
  private bluetoothConnectedDevice?: ScanResult;
  private writeServiceUUID = "0492fcec-7194-11eb-9439-0242ac130003".toUpperCase();
  constructor(
  ) { 
    console.log("Constructor of ble.service.ts");
  }

  async initializeBLE() {
    //Await for ble.initialize and timeout after 5 seconds
    await BleClient.initialize().then(() => {
      this.isInitialized = true;
      console.log("BLE Initialized");
      }, (error) => {
        console.log(error);
      }
    );
  }

  stopScanProcess() {
    BleClient.stopLEScan();
  }

  startScanProcess() {
    const scanParameters: RequestBleDeviceOptions = {
      services : [this.controllerServiceUUID]
    };
    BleClient.requestLEScan(
      scanParameters, this.onScanFoundDevice.bind(this)
    );
  }

  onScanFoundDevice(result:ScanResult) {
    console.log('received new scan result', result);
    this.subject.next(result);
  }

  getBleObservable():Subject<any> {
    return this.subject;
  }

  async connectToDevice(scanResult:ScanResult) {
    const device = scanResult.device;
    try {
      await BleClient.connect(
        device.deviceId,
        this.onBluetoothDeviceConnected.bind(this)
      );
      this.bluetoothConnectedDevice = scanResult;
    } catch(error) {
      console.log(error);
    }
  }

  onBluetoothDeviceConnected(result:any) {
    console.log('Disconnected from device', result);
  }

  async bleTxProcess(txstring: string) {
    const maxPacketSize = 20;
    const noBytes = txstring.length;
    const noCycles: number = Math.floor(noBytes / maxPacketSize);
    const remainder = (noBytes % maxPacketSize);
    // console.log('Cycles: ' + noCycles);
    // console.log('Remainder: ' + remainder);
    for (let index = 0; index < noCycles; index++) {
      const substring = txstring.substring(index * maxPacketSize, (index * maxPacketSize) + maxPacketSize);
      // console.log('The substring is: ' + substring);
      await this.bleTxSubProcess(substring);
    }
    const remainderString = txstring.substring(noCycles * 80, txstring.length);
    // console.log('The remainder String: ' + remainderString);
    this.bleTxSubProcess(remainderString);
  }
  
  async bleTxSubProcess(txsubstring: string) {
    const bytes = textToDataView(txsubstring);
    await BleClient.write(
      this.bluetoothConnectedDevice.device.deviceId,
      this.controllerServiceUUID,
      this.writeServiceUUID,
      bytes
    ).then( (result) => 
    {
      console.log('Write result: ' + result);
    }
    ).catch( (error) => 
    {
        console.log('Write error: ' + error);
    });
  }

}
