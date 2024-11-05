import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Usuario {
  nombreUsuario: string;
  idUsuario?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:3000/usuarios'; // URL del json-server

  constructor(private http: HttpClient) { }

  getUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(this.apiUrl);
  }
}