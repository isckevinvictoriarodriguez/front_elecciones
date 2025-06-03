import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private router: Router, private navCtrl: NavController) {}
  // openPage(page: string) {
  //   if (page === 'home') {
  //     this.router.navigate(['/home']);
  //   } else if (page === 'about') {
  //     this.router.navigate(['/about']);
  //   } else if (page === 'settings') {
  //     this.router.navigate(['/settings']);
  //   }
  // }

   //navegacion a home
   irAExamen() {
    this.navCtrl.navigateRoot('/examenes');
  }

  irAHome() {
    this.navCtrl.navigateRoot('/home');
  }

  Usersadd() {
    this.navCtrl.navigateRoot('/register-users');
  }

  IraResultados() {
    this.navCtrl.navigateRoot('/results');
  }

  irExamens() {
    this.navCtrl.navigateRoot('/list-examens');
  }




  shouldShowSidebar(): boolean {
    // Comprobar si la página actual es la de login
    return this.router.url !== '/login'; // Aquí '/login' es la ruta de tu página de login
  }
}
