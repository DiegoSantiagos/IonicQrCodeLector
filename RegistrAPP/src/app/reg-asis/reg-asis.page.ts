import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { ModalController, Platform } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AuthService } from '../services/auth.service';


interface Usuario {
  nombreUsuario: string;
  idUsuario?: number;
}

@Component({
  selector: 'app-reg-asis',
  templateUrl: './reg-asis.page.html',
  styleUrls: ['./reg-asis.page.scss'],
})
export class RegAsisPage implements OnInit {
  infoAlumno: string = '';
  scanResult: string = '';
  valor: string = '';
  mode: 'scan' | 'generate' = 'generate';
  userRole: string = '';

  constructor(private modalController: ModalController,
    private plataform: Platform,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser.role;

    if (this.userRole === 'profesor') {
      this.mode = 'generate';
    } else if (this.userRole === 'alumno') {
      this.mode = 'scan';
    }

    if (this.plataform.is('capacitor')) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }
  }


  async startScan() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        lensFacing: LensFacing.Back
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.scanResult = data?.barcode?.displayValue;
    }
  }


}

