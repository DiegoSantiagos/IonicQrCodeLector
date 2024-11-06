import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AsignaturaService } from '../services/asignatura.service';
import { AsistenciaService } from '../services/asistencia.service';


@Component({
  selector: 'app-mis-asignatura',
  templateUrl: './mis-asignatura.page.html',
  styleUrls: ['./mis-asignatura.page.scss'],
})
export class MisAsignaturaPage implements OnInit {
  asignaturas: any[] = [];


  constructor(
    private authService: AuthService,
    private asignaturaService: AsignaturaService

  ) { }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.asignaturaService.getAsignaturasByStudentId(currentUser.id).subscribe(asignaturas => {
        this.asignaturas = asignaturas;
      });
    }
  }

}
