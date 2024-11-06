import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-cambiar-cla',
  templateUrl: './cambiar-cla.page.html',
  styleUrls: ['./cambiar-cla.page.scss'],
})
export class CambiarClaPage implements OnInit {
  claveActual: string;
  nuevaClave: string;
  confirmarClave: string;

  constructor(
    private toastController: ToastController,
    private authService: AuthService
  ) {
    this.claveActual = '';
    this.nuevaClave = '';
    this.confirmarClave = '';
  }


  ngOnInit() {
  }

  async cambiarClave() {
    const currentUser = this.authService.getCurrentUser();
    if (this.claveActual === currentUser.clave) {
      if (this.nuevaClave === '') {
        const toast = await this.toastController.create({
          message: 'Ingresar nueva clave',
          position: 'middle',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      } else if (this.nuevaClave === this.confirmarClave) {
        this.authService.changePassword(this.nuevaClave).subscribe(
          async () => {
            const toast = await this.toastController.create({
              message: 'Contraseña cambiada exitosamente',
              position: 'middle',
              duration: 2000,
              color: 'success'
            });
            toast.present();
          },
          async (error) => {
            const toast = await this.toastController.create({
              message: 'Error al cambiar la contraseña',
              position: 'middle',
              duration: 2000,
              color: 'danger'
            });
            toast.present();
          }
        );
      } else {
        const toast = await this.toastController.create({
          message: 'Las contraseñas no coinciden',
          position: 'middle',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    } else {
      const toast = await this.toastController.create({
        message: 'La contraseña actual es incorrecta',
        position: 'middle',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }


}