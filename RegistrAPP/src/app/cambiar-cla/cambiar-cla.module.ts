import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambiarClaPageRoutingModule } from './cambiar-cla-routing.module';

import { CambiarClaPage } from './cambiar-cla.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambiarClaPageRoutingModule
  ],
  declarations: [CambiarClaPage]
})
export class CambiarClaPageModule {}
