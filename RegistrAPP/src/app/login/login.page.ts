import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


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
    private router: Router
  ) { }

  ngOnInit() {
  }


  login() {
    this.authService.login(this.username, this.password).subscribe(success => {
      if (success) {
        this.router.navigate(['/home']);
      } else {
        this.showToast('Invalid username or password');
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
