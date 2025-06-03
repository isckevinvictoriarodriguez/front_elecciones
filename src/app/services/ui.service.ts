import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(private alertController: AlertController,
              private toastController: ToastController) { }

  async alertaInfo(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['ACEPTAR']
    });

    await alert.present();
  }

  async toastInfo(message: string) {
    const toast = await this.toastController.create({
      message ,
      duration: 2000
    });
    toast.present();
  }

  /* FOTOS */
  obtenerTipoExtension(base64: string): string {
    const match = base64.match(/data:(.*?);base64,/);
    if (match && match[1]) {
      const tipoMime = match[1];
      switch (tipoMime) {
        case 'image/png':
          return 'png';
        case 'image/jpeg':
          return 'jpeg';
        case 'image/gif':
          return 'gif';
        case 'image/jpg':
          // console.log("CASO mime jpg");
          
          return 'jpg';
        default:
          return '';
      }
    }
    return '';
  }
}
