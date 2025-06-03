import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ExamenContestadoPage } from './examen-contestado/examen-contestado.page';
import { ExamenesPage } from './examenes/examenes.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'examenes',
    loadChildren: () => import('./examenes/examenes.module').then( m => m.ExamenesPageModule)
  },
  {
    path: 'examenes/:_id', component: ExamenesPage
  },

  {
    path: 'list-examens',
    loadChildren: () => import('./list-examens/list-examens.module').then( m => m.ListExamensPageModule)
  },
  {
    path: 'register-users',
    loadChildren: () => import('./register-users/register-users.module').then( m => m.RegisterUsersPageModule)
  },
  {
    path: 'results',
    loadChildren: () => import('./results/results.module').then( m => m.ResultsPageModule)
  },
  {
    path: 'examen-contestado',
    loadChildren: () => import('./examen-contestado/examen-contestado.module').then( m => m.ExamenContestadoPageModule)
  },
  { 
    path: 'examen-contestado/:_id', component: ExamenContestadoPage }
  ,
  {
    path: 'list-examens',
    loadChildren: () => import('./list-examens/list-examens.module').then( m => m.ListExamensPageModule)
  },  {
    path: 'buscador',
    loadChildren: () => import('./buscador/buscador.module').then( m => m.BuscadorPageModule)
  },


// Ruta con parámetro
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules,  useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
