import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../services/asistencia.service';
import { AuthService } from '../services/auth.service';
import { AsignaturaService } from '../services/asignatura.service';

@Component({
  selector: 'app-mis-asis',
  templateUrl: './mis-asis.page.html',
  styleUrls: ['./mis-asis.page.scss'],
})
export class MisAsisPage implements OnInit {
  asistencias: any[] = [];
  asignaturas: any[] = [];
  currentUser: any;

  constructor(
    private asistenciaService: AsistenciaService,
    private authService: AuthService,
    private asignaturaService: AsignaturaService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.obtenerAsignaturasYAsistencias();
  }

  obtenerAsignaturasYAsistencias() {
    this.asignaturaService.getAsignaturasByStudentId(this.currentUser.id).subscribe(asignaturas => {
      this.asignaturas = asignaturas;
      this.asistenciaService.obtenerAsistencias().subscribe(asistencias => {
        this.asistencias = asignaturas.map(asignatura => {
          const asistencia = asistencias.find(a => a.codigo === asignatura.code && a.alumno === this.currentUser.name);
          return {
            ...asignatura,
            asistencias: asistencia ? 1 : 0 // Puedes ajustar esto para contar múltiples asistencias si es necesario
          };
        });
      });
    });
  }
}