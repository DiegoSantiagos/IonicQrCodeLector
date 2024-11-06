import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisAsisPageRoutingModule } from './mis-asis-routing.module';

import { MisAsisPage } from './mis-asis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisAsisPageRoutingModule
  ],
  declarations: [MisAsisPage]
})
export class MisAsisPageModule {}
