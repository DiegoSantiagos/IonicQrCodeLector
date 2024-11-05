import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegAsisPage } from './reg-asis.page';

const routes: Routes = [
  {
    path: '',
    component: RegAsisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegAsisPageRoutingModule {}
