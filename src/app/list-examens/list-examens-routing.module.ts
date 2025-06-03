import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListExamensPage } from './list-examens.page';

const routes: Routes = [
  {
    path: '',
    component: ListExamensPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListExamensPageRoutingModule {}
