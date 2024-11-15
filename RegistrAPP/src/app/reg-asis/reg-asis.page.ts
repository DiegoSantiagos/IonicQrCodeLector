import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { AsistenciaService } from '../services/asistencia.service';
import { Router } from '@angular/router';

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
  selectedClassId: number | null = null;
  selectedSectionId: number | null = null;
  assignments: any[] = [];
  sections: any[] = [];
  mostrar: any;
  enrollments: any[] = [];

  constructor(private modalController: ModalController,
    private plataform: Platform,
    private authService: AuthService,
    private http: HttpClient,
    private asistenciaService: AsistenciaService,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || !this.currentUser.id) {
      console.error('Usuario no autenticado o sin ID');
      this.router.navigate(['/login']);
      return;
    }
    this.userRole = this.currentUser.role;
    if (this.userRole === 'profesor') {
      this.mode = 'generate';
      this.loadAssignments();
      this.loadSections();
    } else if (this.userRole === 'alumno') {
      this.mode = 'scan';
      this.loadSectionsAlumnos();
      this.loadEnrollments();
    }

    if (this.plataform.is('capacitor')) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }
  }

  loadAssignments() {
    if (!this.currentUser || !this.currentUser.id) {
      console.error('Usuario no autenticado o sin ID');
      return;
    }

    this.http.get<any[]>('https://totem-tunel.uri1000.win/assignments').subscribe(assignments => {
      console.log('Todas las asignaciones:', assignments);
      const professorAssignments = assignments.filter(a => a.professorId.toString() === this.currentUser.id);
      console.log('Asignaciones del profesor:', professorAssignments);
      const classIds = professorAssignments.map(a => a.classId);

      this.http.get<any[]>('https://totem-tunel.uri1000.win/classes').subscribe(classes => {
        console.log('Todas las clases:', classes);
        const uniqueAssignments: any[] = [];
        const seenClassNames = new Set();

        professorAssignments.forEach(assignment => {
          const classInfo = classes.find(cls => Number(cls.id) === assignment.classId);
          if (classInfo) {
            console.log(`Clase encontrada para classId ${assignment.classId}:`, classInfo);
            const className = classInfo.name;

            if (!seenClassNames.has(className)) {
              seenClassNames.add(className);
              uniqueAssignments.push({
                ...assignment,
                className: className
              });
            }
          } else {
            console.warn(`No se encontró clase para classId ${assignment.classId}`);
          }
        });

        this.sections = classes.filter(cls => classIds.includes(Number(cls.id)));
        this.assignments = uniqueAssignments;
        console.log('Asignaciones únicas con nombres de materias:', this.assignments);
      });
    });
  }

  loadSections() {
    if (!this.currentUser || !this.currentUser.id) {
      console.error('Usuario no autenticado o sin ID');
      return;
    }

    this.http.get<any[]>('https://totem-tunel.uri1000.win/assignments').subscribe(assignments => {
      const professorAssignments = assignments.filter(a => a.professorId.toString() === this.currentUser.id);
      const sectionIds = professorAssignments.map(a => a.seccionid);

      this.http.get<any[]>('https://totem-tunel.uri1000.win/sections').subscribe(sections => {
        this.sections = sections.filter(section => sectionIds.includes(section.id));
        console.log('Secciones filtradas:', this.sections);
      });
    });
  }

  loadSectionsAlumnos() {
    if (!this.currentUser || !this.currentUser.id) {
      console.error('Usuario no autenticado o sin ID');
      return;
    }

    this.http.get<any[]>('https://totem-tunel.uri1000.win/enrollments').subscribe(enrollments => {
      const studentEnrollments = enrollments.filter(e => e.studentId.toString() === this.currentUser.id);
      const assignmentIds = studentEnrollments.map(e => e.assignmentId);
      console.log('Asignaturas inscritas por el alumno:', assignmentIds);

      this.http.get<any[]>('https://totem-tunel.uri1000.win/assignments').subscribe(assignments => {
        const studentAssignments = assignments.filter(assignment => assignmentIds.includes(assignment.id));
        const classIds = studentAssignments.map(a => a.classId);

        this.http.get<any[]>('https://totem-tunel.uri1000.win/classes').subscribe(classes => {
          this.assignments = classes.filter(cls => classIds.includes(cls.id));
          console.log('Asignaturas filtradas para el alumno:', this.assignments);
        });
      });
    });
  }

  // generateQRCode() {
  //   const currentDate = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
  //   const currentHour = new Date().getHours(); // Obtener la hora actual (sin los minutos)

  //   console.log('Current User:', this.currentUser);
  //   console.log('Assignments:', this.assignments);

  //   if (this.assignments && this.assignments.length > 0 && this.currentUser && this.currentUser.id) {
  //     const assignment = this.assignments.find(a => a.professorId.toString() === this.currentUser.id);
  //     if (assignment) {
  //       this.http.get<any[]>(`https://totem-tunel.uri1000.win/classes?id=${assignment.classId}`).subscribe(
  //         classes => {
  //           if (classes.length > 0) {
  //             if (this.currentUser.id && assignment.classId && currentDate && currentHour) {
  //               this.valorQr = `${this.currentUser.id},${assignment.classId},${currentDate},${currentHour}`;
  //               console.log('QR Code generated:', this.valorQr, 'y los datos son los siguientes', this.currentUser.id, assignment.classId, currentDate, currentHour);
  //             } else {
  //               console.error('Uno de los valores está vacío:', {
  //                 userId: this.currentUser.id,
  //                 classId: assignment.classId,
  //                 currentDate,
  //                 currentHour
  //               });
  //             }
  //           } else {
  //             console.error('No se encontraron clases para el assignment:', assignment.classId);
  //           }
  //         },
  //         error => {
  //           console.error('Error al obtener las clases:', error);
  //         }
  //       );
  //     } else {
  //       console.error('No se encontró un assignment para el usuario actual.');
  //     }
  //   } else {
  //     console.error('Asignaciones o usuario actual no están definidos correctamente.');
  //   }
  // }

  generateQRCode() {
    const currentDate = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();

    if (this.selectedClassId && this.selectedSectionId && this.currentUser && this.currentUser.id) {
      this.valorQr = `${this.currentUser.id},${this.selectedClassId},${currentDate},${currentHour},${this.selectedSectionId}`;
      console.log('QR Code generated:', this.valorQr);
    } else {
      console.error('Debe seleccionar una materia y una sección.');
      this.showToast('Debe seleccionar una materia y una sección.', 'warning');
    }
  }

  loadEnrollments() {

    this.http.get<any[]>('https://totem-tunel.uri1000.win/enrollments').subscribe(enrollments => {
      this.enrollments = enrollments.filter(enrollment => enrollment.studentId.toString() === this.currentUser.id);
      console.log('Inscripciones:', this.enrollments);
    });
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
    if (!qrCode) {
      this.showToast('Código QR no proporcionado.', 'warning');
      return;
    }

    const [userId, classId, date, hour, sectionId] = qrCode.split(',');

    if (!this.currentUser || !this.currentUser.id) {
      this.showToast('Usuario no autenticado o sin ID', 'danger');
      this.router.navigate(['/login']);
      return;
    }

    // Verificar si el alumno está inscrito en la clase y sección correspondientes
    const studentId = this.currentUser.id;
    const studentEnrollment = this.enrollments.find(enrollment =>
      enrollment.studentId.toString() === studentId &&
      enrollment.classId.toString() === classId &&
      enrollment.sectionId.toString() === sectionId
    );

    if (!studentEnrollment) {
      this.showToast('El alumno no está inscrito en esta clase o sección.', 'danger');
      return;
    }

    console.log('Enviando datos de asistencia al servidor...');
    this.asistenciaService.prepararYRegistrarAsistencia(qrCode).subscribe(
      response => {
        this.showToast('Asistencia registrada con éxito.', 'success');
        console.log('Asistencia registrada:', response);
      },
      error => {
        let errorMessage = 'Error al registrar la asistencia';
        console.error('Error al registrar la asistencia:', error);

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

