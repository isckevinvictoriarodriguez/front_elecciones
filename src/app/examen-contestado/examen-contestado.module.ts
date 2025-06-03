import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExamenContestadoPageRoutingModule } from './examen-contestado-routing.module';

import { ExamenContestadoPage } from './examen-contestado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExamenContestadoPageRoutingModule
  ],
  declarations: [ExamenContestadoPage]
})
export class ExamenContestadoPageModule {}
