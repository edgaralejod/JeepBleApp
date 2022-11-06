import { Injectable } from '@angular/core';
import { BleClient, RequestBleDeviceOptions, ScanResult } from '@capacitor-community/bluetooth-le';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BleService {
  public isInitialized = false;
  readonly controllerServiceUUID = "0492fcec-7194-11eb-9439-0242ac130002".toUpperCase();
  private subject: Subject<any> = new Subject<any>();
  private bluetoothConnectedDevice?: ScanResult;
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
}
