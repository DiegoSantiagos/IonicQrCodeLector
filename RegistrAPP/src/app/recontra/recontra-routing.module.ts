import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecontraPage } from './recontra.page';

const routes: Routes = [
  {
    path: '',
    component: RecontraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecontraPageRoutingModule {}
