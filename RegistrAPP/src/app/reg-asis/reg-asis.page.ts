import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { ModalController, Platform } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

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
  currentUser: any;
  assignments: any[] = [];

  constructor(private modalController: ModalController,
    private plataform: Platform,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || !this.currentUser.id) {
      console.error('Usuario no autenticado o sin ID');
      return;
    }
    this.userRole = this.currentUser.role;

    if (this.userRole === 'profesor') {
      this.mode = 'generate';
      this.loadAssignments();
    } else if (this.userRole === 'alumno') {
      this.mode = 'scan';
    }

    if (this.plataform.is('capacitor')) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }
  }

  loadAssignments() {
    this.http.get<any[]>('https://totem-tunel.uri1000.win/assignments').subscribe(assignments => {
      this.assignments = assignments;
      this.generateQRCode();
    });
  }


  generateQRCode() {
    const currentDate = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    const assignment = this.assignments.find(a => a.professorId === this.currentUser.id);
    if (assignment) {
      this.http.get<any[]>(`https://totem-tunel.uri1000.win/classes?id=${assignment.classId}`).subscribe(classes => {
        if (classes.length > 0) {
          const classCode = classes[0].code;
          this.valor = `${this.currentUser.name}-${classCode}-${currentDate}`;
        }
      });
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

