import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { BleConnectComponent } from '../components/ble-connect/ble-connect.component';
import { BleControllerComponent } from '../components/ble-controller/ble-controller.component';
import { Tab3PageRoutingModule } from './tab3-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab3PageRoutingModule
  ],
  declarations: [
    Tab3Page,
    BleConnectComponent,
    BleControllerComponent
  ]
})
export class Tab3PageModule {}
