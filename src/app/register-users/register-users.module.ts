import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterUsersPageRoutingModule } from './register-users-routing.module';

import { RegisterUsersPage } from './register-users.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterUsersPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegisterUsersPage]
})
export class RegisterUsersPageModule {}
