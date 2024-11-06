import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisAsignaturaPage } from './mis-asignatura.page';

const routes: Routes = [
  {
    path: '',
    component: MisAsignaturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisAsignaturaPageRoutingModule {}
