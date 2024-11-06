import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisAsignaturaPageRoutingModule } from './mis-asignatura-routing.module';

import { MisAsignaturaPage } from './mis-asignatura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisAsignaturaPageRoutingModule
  ],
  declarations: [MisAsignaturaPage]
})
export class MisAsignaturaPageModule {}
