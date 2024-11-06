import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recontra',
  templateUrl: './recontra.page.html',
  styleUrls: ['./recontra.page.scss'],
})
export class RecontraPage implements OnInit {
  username: string = '';
  newPassword: string = '';

  constructor(
    private toastController: ToastController,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
  }

  async recuperarContra() {
    if (this.username && this.newPassword) {
      this.authService.recuperarContra(this.username, this.newPassword).subscribe(response => {
        if (response.success) {
          this.showToast('Contraseña cambiada exitosamente', 'success');
        } else {
          if (response.error === 'username') {
            this.showToast('El usuario no existe', 'danger');
          } else if (response.error === 'update_failed') {
            this.showToast('Error al cambiar la contraseña', 'danger');
          } else {
            this.showToast('Error desconocido', 'danger');
          }
        }
      });
    } else {
      this.showToast('Por favor ingrese el nombre de usuario y la nueva contraseña', 'warning');
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      position: 'middle',
      duration: 2000,
      color
    });
    toast.present();
  }
}
