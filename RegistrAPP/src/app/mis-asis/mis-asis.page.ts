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
      this.asistencias = data.filter(a => a.studentId === this.currentUser.id);
      console.log('Asistencias del estudiante:', this.asistencias);
    });
  }

  countAsistencias(classId: number, seccion: string): number {
    const filteredAsistencias = this.asistencias.filter(a => a.classId === classId && a.seccion.toString() === seccion && a.studentId === this.currentUser.id);
    console.log(`Asistencias for classId ${classId} and seccion ${seccion}:`, filteredAsistencias);
    return filteredAsistencias.length;
  }
}