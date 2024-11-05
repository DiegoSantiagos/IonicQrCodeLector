import { Component } from '@angular/core';

interface Usuario {
  nombreUsuario: string;
  idUsuario?: number;
}

interface Asignatura {
  nombre: string;
  siglas: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  usuario: Usuario = {
    nombreUsuario: 'Diego',
    idUsuario: 1,
  };

  asignaturas: Asignatura[] = [
    { nombre: 'Matemáticas', siglas: 'mdi112' },
    { nombre: 'Ciencias', siglas: 'sci233' },
  ];

  constructor() { }

}
