import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterUsersPage } from './register-users.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterUsersPageRoutingModule {}
