import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambiarClaPage } from './cambiar-cla.page';

const routes: Routes = [
  {
    path: '',
    component: CambiarClaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambiarClaPageRoutingModule {}
