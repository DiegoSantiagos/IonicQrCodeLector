import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegAsisPageRoutingModule } from './reg-asis-routing.module';

import { RegAsisPage } from './reg-asis.page';
import { QRCodeModule } from 'angularx-qrcode';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegAsisPageRoutingModule,
    QRCodeModule
  ],
  declarations: [RegAsisPage, BarcodeScanningModalComponent]
})
export class RegAsisPageModule { }
