import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
  }


  login() {
    if (!this.username) {
      this.showToast('Por favor ingrese el nombre de usuario');
      return;
    }

    if (!this.password) {
      this.showToast('Por favor ingrese la contraseña');
      return;
    }

    this.authService.login(this.username, this.password).subscribe(response => {
      if (response.success) {
        this.router.navigate(['/home']);
      } else {
        if (response.error === 'username') {
          this.showToast('Nombre de usuario incorrecto');
        } else if (response.error === 'password') {
          this.showToast('Contraseña incorrecta');
        } else {
          this.showToast('Error desconocido');
        }
      }
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      position: 'middle',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }
}
