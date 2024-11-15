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

  loadSectionsAlumnos() {
    if (!this.currentUser || !this.currentUser.id) {
      console.error('Usuario no autenticado o sin ID');
      return;
    }

    this.http.get<any[]>('https://totem-tunel.uri1000.win/enrollments').subscribe(enrollments => {
      const studentEnrollments = enrollments.filter(e => e.studentId.toString() === this.currentUser.id);
      const assignmentIds = studentEnrollments.map(e => e.assignmentId.toString());
      console.log('Asignaturas inscritas por el alumno:', assignmentIds);

      this.http.get<any[]>('https://totem-tunel.uri1000.win/assignments').subscribe(assignments => {
        console.log('Asignaciones obtenidas:', assignments);
        const studentAssignments = assignments.filter(assignment => assignmentIds.includes(assignment.id.toString()));
        const classIds = studentAssignments.map(a => a.classId.toString());
        console.log('IDs de clases para las asignaturas del alumno:', classIds);

        this.http.get<any[]>('https://totem-tunel.uri1000.win/classes').subscribe(classes => {
          console.log('Clases obtenidas:', classes);
          const filteredClasses = classes.filter(cls => classIds.includes(cls.id.toString()));

          this.http.get<any[]>('https://totem-tunel.uri1000.win/sections').subscribe(sections => {
            console.log('Secciones obtenidas:', sections);
            this.assignments = filteredClasses.map(cls => {
              const classSections = sections.filter(section => studentAssignments.some(a => a.classId.toString() === cls.id.toString() && a.seccionid.toString() === section.id.toString()));
              return {
                ...cls,
                sections: classSections
              };
            });
            console.log('Asignaturas filtradas para el alumno con secciones:', this.assignments);
          }, error => {
            console.error('Error al obtener las secciones:', error);
          });
        }, error => {
          console.error('Error al obtener las clases:', error);
        });
      }, error => {
        console.error('Error al obtener las asignaciones:', error);
      });
    }, error => {
      console.error('Error al obtener las inscripciones:', error);
    });
  }

  loadEnrollments() {
    this.http.get<any[]>('https://totem-tunel.uri1000.win/enrollments').subscribe(enrollments => {
      this.enrollments = enrollments.filter(enrollment => enrollment.studentId.toString() === this.currentUser.id);
      console.log('Inscripciones:', this.enrollments);
    });
  }

  async registrarAsistencia(qrCode: string) {
    if (!qrCode) {
      this.showToast('Código QR no proporcionado.', 'warning');
      return;
    }
    // this.showToast('Registrando asistencia...', 'primary');
    const [userId, classId, date, hour, sectionId] = qrCode.split(',');
    console.log('Datos del QR:', { qrCode });
    this.mostrar = qrCode;


    if (!this.currentUser || !this.currentUser.id) {
      this.showToast('Usuario no autenticado o sin ID', 'danger');
      this.router.navigate(['/login']);
      return;
    }

    const studentAssignment = this.assignments.find(assignment =>
      assignment.id.toString() === classId &&
      assignment.sections.some((section: { id: string }) => section.id.toString() === sectionId)
    );

    if (!studentAssignment) {
      this.showToast('El alumno no pertenece a esta sección en esta materia', 'danger');
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

