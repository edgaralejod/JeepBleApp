import { Component } from '@angular/core';
import { BleService } from '../data/ble.service';
import { AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements AfterViewInit{

  constructor(

  ) {

  }
  async ngAfterViewInit() {

  }
  async scanDevices(){
    console.log("Pressed a button");
  }
}
