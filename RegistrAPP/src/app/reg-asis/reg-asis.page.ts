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
  mostrar: any;

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
        id: this.generateUniqueId(),
        classId: parseInt(classId, 10),
        studentId: parseInt(userId, 10),
        date: date,
        asistencia: 'presente',
        horaInicio: hour
      };

      console.log('Datos de asistencia a enviar:', asistenciaData);

      // Formatear asistenciaData en una cadena legible
      const formattedAsistenciaData = `
        ID del Estu:
        ${asistenciaData.studentId}
        ID de la Clase:
        ${asistenciaData.classId}
        Fecha:
        ${asistenciaData.date}
        Hora de Inicio:
        ${asistenciaData.horaInicio}
        Asistencia:
        ${asistenciaData.asistencia}
        ID:
        ${asistenciaData.id}
      `;

      // Asignar la cadena formateada a scanResult
      this.mostrar = formattedAsistenciaData;

      this.showToast('Enviando datos de asistencia al servidor...', 'success');
      this.asistenciaService.registrarAsistencia(asistenciaData).subscribe(
        response => {
          console.log('Respuesta del servidor:', response);
          this.showToast('Asistencia registrada exitosamente', 'success');
        },
        async error => {
          let errorMessage = 'Error al registrar la asistencia';
          if (error.status === 0) {
            errorMessage = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet o la URL del servidor.';
          } else if (error.status === 401) {
            errorMessage = 'No autorizado. Por favor, verifica tus credenciales.';
          } else if (error.status === 403) {
            errorMessage = 'Prohibido. No tienes permiso para realizar esta acción.';
          } else if (error.status === 404) {
            errorMessage = 'Recurso no encontrado. Por favor, verifica la URL.';
          } else if (error.status === 500) {
            errorMessage = 'Error interno del servidor. Por favor, intenta nuevamente más tarde.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          this.showToast(errorMessage, 'danger');
        }
      );
    } else {
      this.showToast('Código QR inválido', 'warning');
    }
  }



  generateUniqueId() {
    const lastId = localStorage.getItem('lastUniqueId') || '0';
    const newId = (parseInt(lastId, 10) + 1).toString();
    localStorage.setItem('lastUniqueId', newId);
    return newId;
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

  enviarDatosDePrueba() {
    this.asistenciaService.enviarDatosDePrueba().subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        this.showToast('Datos de prueba enviados exitosamente', 'success');
      },
      error => {
        console.error('Error al enviar datos de prueba:', error);
        this.showToast('Error al enviar datos de prueba', 'danger');
      }
    );
  }

}

