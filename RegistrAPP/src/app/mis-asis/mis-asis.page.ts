import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AsignaturaService } from '../services/asignatura.service';
import { AsistenciaService } from '../services/asistencia.service';

@Component({
  selector: 'app-mis-asis',
  templateUrl: './mis-asis.page.html',
  styleUrls: ['./mis-asis.page.scss'],
})
export class MisAsisPage implements OnInit {
  currentUser: any;
  asignaturas: any[] = [];
  asistencias: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private asignaturaService: AsignaturaService,
    private asistenciaService: AsistenciaService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    console.log('Current User:', this.currentUser);
    if (!this.currentUser || !this.currentUser.id) {
      console.error('Usuario no autenticado o sin ID');
      this.router.navigate(['/login']);
      return;
    }
    this.loadAsignaturas();
    this.loadAsistencias();
  }

  loadAsignaturas() {
    this.asignaturaService.getAsignaturasByStudentId(this.currentUser.id).subscribe(data => {
      this.asignaturas = data;
      console.log('Asignaturas:', this.asignaturas);
    });
  }

  loadAsistencias() {
    this.asistenciaService.obtenerAsistencias().subscribe(data => {
      console.log('Todas las asistencias:', data);
      this.asistencias = data.filter(a => a.studentId === this.currentUser.id && a.asistencia === 'presente');
      console.log('Asistencias del estudiante:', this.asistencias);
    });
  }

  countAsistencias(classId: number): number {
    let count = 0;
    console.log(`Iniciando conteo de asistencias para classId: ${classId}`);
    for (const asistencia of this.asistencias) {
      console.log(`Revisando asistencia:`, asistencia);
      if (Number(asistencia.classId) === classId) {
        console.log(`Coincide classId: ${asistencia.classId}`);
        if (asistencia.studentId === this.currentUser.id) {
          console.log(`Coincide studentId: ${asistencia.studentId}`);
          count++;
        }
      }
    }
    console.log(`Total de asistencias para classId ${classId}:`, count);
    return count;
  }
}