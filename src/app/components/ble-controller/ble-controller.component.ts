import { Component, OnInit } from '@angular/core';
import { BleService } from '../../data/ble.service';
@Component({
  selector: 'app-ble-controller',
  templateUrl: './ble-controller.component.html',
  styleUrls: ['./ble-controller.component.scss'],
})
export class BleControllerComponent implements OnInit {

  constructor(
    public bleService: BleService,
  ) { }

  ngOnInit() {
    console.log('We initialized the ble-controller component');
  }

  ping() {
    console.log("Ping button pressed");
  }

  async readId() {
    console.log("Read ID button pressed");
    const readIdCmd = {
      command : 'rdid'
    };
    await this.bleService.bleTxProcess(JSON.stringify(readIdCmd));
    await this.bleService.bleRead();
  }

  readConfig() {
    console.log("Read Config button pressed");
  }
}
