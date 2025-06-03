import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListExamensPageRoutingModule } from './list-examens-routing.module';

import { ListExamensPage } from './list-examens.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListExamensPageRoutingModule
  ],
  declarations: [ListExamensPage]
})
export class ListExamensPageModule {}
