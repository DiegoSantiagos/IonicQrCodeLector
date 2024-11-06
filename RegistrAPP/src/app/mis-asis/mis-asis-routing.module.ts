import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisAsisPage } from './mis-asis.page';

const routes: Routes = [
  {
    path: '',
    component: MisAsisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisAsisPageRoutingModule {}
