import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://totem-tunel.uri1000.win/users'; // Reemplaza 192.168.1.x con la dirección IP de tu computadora

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}?name=${username}&clave=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          // Almacenar el usuario en el almacenamiento local
          localStorage.setItem('currentUser', JSON.stringify(users[0]));
          return true;
        } else {
          return false;
        }
      })
    );
  }

  logout(): void {
    // Eliminar el usuario del almacenamiento local
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): any {
    // Obtener el usuario del almacenamiento local
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }
}