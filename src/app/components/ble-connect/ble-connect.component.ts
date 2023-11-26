import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { BleService } from '../../data/ble.service';

@Component({
  selector: 'app-ble-connect',
  templateUrl: './ble-connect.component.html',
  styleUrls: ['./ble-connect.component.scss'],
})
export class BleConnectComponent implements OnInit, OnDestroy {
  private showButtons = true;
  private showSpinnerScan = false;
  private devicesArray: ScanResult[] = [];
  constructor(
    public bleService: BleService,
    public ngZone: NgZone
  ) { }

  ngOnInit(): void {
    console.log('We initialized the ble-connect component');
    if ( this.bleService.isInitialized == false ) {
      this.bleService.initializeBLE();
      this.bleService.getFoundDeviceSubject().subscribe(this.deviceFound.bind(this));
    }
  }

  ngOnDestroy(): void {
    console.log('We destroyed the ble-connect component');
  }

  scanDevices() {
    this.bleService.startScanProcess();
  }

  stopScan() {
    this.bleService.stopScanProcess();
  }

  deviceFound( device:ScanResult ) {
    console.log("Device found in ble-connect component", device.localName);
    this.ngZone.run(() => {
      this.devicesArray.push(device);
    });
  }
  
  deviceTapped( device:ScanResult ) {
    console.log("Device tapped in ble-connect component", device.localName);
    this.bleService.connectToDevice(device);
  }
}
