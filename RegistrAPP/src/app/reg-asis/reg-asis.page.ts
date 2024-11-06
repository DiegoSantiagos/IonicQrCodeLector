import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { AsistenciaService } from '../services/asistencia.service';

@Component({
  selector: 'app-reg-asis',
  templateUrl: './reg-asis.page.html',
  styleUrls: ['./reg-asis.page.scss'],
})
export class RegAsisPage implements OnInit {
  infoAlumno: string = '';
  scanResult: string = '';
  valorQr: string = '';
  mode: 'scan' | 'generate' = 'generate';
  userRole: string = '';
  currentUser: any;
  assignments: any[] = [];

  constructor(private modalController: ModalController,
    private plataform: Platform,
    private authService: AuthService,
    private http: HttpClient,
    private asistenciaService: AsistenciaService,
    private toastController: ToastController
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
    const currentHour = new Date().getHours(); // Obtener la hora actual (sin los minutos)

    console.log('Current User:', this.currentUser);
    console.log('Assignments:', this.assignments);

    if (this.assignments && this.assignments.length > 0 && this.currentUser && this.currentUser.id) {
      const assignment = this.assignments.find(a => a.professorId.toString() === this.currentUser.id);
      if (assignment) {
        this.http.get<any[]>(`https://totem-tunel.uri1000.win/classes?id=${assignment.classId}`).subscribe(
          classes => {
            if (classes.length > 0) {
              if (this.currentUser.id && assignment.classId && currentDate && currentHour) {
                this.valorQr = `${this.currentUser.id},${assignment.classId},${currentDate},${currentHour}`;
                console.log('QR Code generated:', this.valorQr, 'y los datos son los siguientes', this.currentUser.id, assignment.classId, currentDate, currentHour);
              } else {
                console.error('Uno de los valores está vacío:', {
                  userId: this.currentUser.id,
                  classId: assignment.classId,
                  currentDate,
                  currentHour
                });
              }
            } else {
              console.error('No se encontraron clases para el assignment:', assignment.classId);
            }
          },
          error => {
            console.error('Error al obtener las clases:', error);
          }
        );
      } else {
        console.error('No se encontró un assignment para el usuario actual.');
      }
    } else {
      console.error('Asignaciones o usuario actual no están definidos correctamente.');
    }
  }

  async startScan() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        lensFacing: 'back'
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.scanResult = data?.barcode?.displayValue;
      this.registrarAsistencia(this.scanResult);
    }
  }

  async registrarAsistencia(qrCode: string) {
    if (qrCode) {
      const [userId, classId, date, hour] = qrCode.split(',');

      const asistenciaData = {
        classId: parseInt(classId, 10),
        studentId: parseInt(userId, 10),
        date: date,
        asistencia: 'presente',
        horaInicio: hour,
        id: this.generateUniqueId()
      };

      this.http.post('http://totem-tunel.uri1000.win/asistencias', asistenciaData).subscribe(
        response => {
          this.showToast('Asistencia registrada exitosamente', 'success');
        },
        async error => {
          this.showToast('Error al registrar la asistencia: ' + error.message, 'danger');
        }
      );
    } else {
      this.showToast('Código QR inválido', 'warning');
    }
  }

  generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }


  marcarAusentes() {
    const currentDate = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    const assignment = this.assignments.find(a => a.professorId === this.currentUser.id);
    if (assignment) {
      this.http.get<any[]>(`https://totem-tunel.uri1000.win/enrollments?classId=${assignment.classId}`).subscribe(enrollments => {
        enrollments.forEach(enrollment => {
          this.http.get<any[]>(`https://totem-tunel.uri1000.win/asistencias?classId=${assignment.classId}&studentId=${enrollment.studentId}&date=${currentDate}`).subscribe(asistencias => {
            if (asistencias.length === 0) {
              const asistencia = {
                alumno: enrollment.studentId,
                classId: assignment.classId,
                date: currentDate,
                asistencia: 'ausente'
              };
              this.asistenciaService.registrarAsistencia(asistencia).subscribe(
                response => {
                  console.log('Asistencia ausente registrada:', response);
                },
                error => {
                  console.error('Error al registrar asistencia ausente:', error);
                }
              );
            }
          });
        });
      });
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

  confirmarAsistencia() {
    this.registrarAsistencia(this.scanResult);
  }

}

