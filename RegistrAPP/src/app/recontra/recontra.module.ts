import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecontraPageRoutingModule } from './recontra-routing.module';

import { RecontraPage } from './recontra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecontraPageRoutingModule
  ],
  declarations: [RecontraPage]
})
export class RecontraPageModule {}
