import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExamenContestadoPage } from './examen-contestado.page';

const routes: Routes = [
  {
    path: '',
    component: ExamenContestadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamenContestadoPageRoutingModule {}
