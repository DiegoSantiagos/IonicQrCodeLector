import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://totem-tunel.uri1000.win/users'; // Reemplaza 192.168.1.x con la dirección IP de tu computadora

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<{ success: boolean, error?: string }> {
    return this.http.get<any[]>(`${this.apiUrl}?name=${username}`).pipe(
      map(users => {
        if (users.length === 0) {
          return { success: false, error: 'username' };
        }
        const user = users[0];
        if (user.clave !== password) {
          return { success: false, error: 'password' };
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true };
      }),
      catchError(() => of({ success: false, error: 'unknown' }))
    );
  }

  changePassword(username: string, newPassword: string): Observable<{ success: boolean, error?: string }> {
    return this.http.get<any[]>(`${this.apiUrl}?name=${username}`).pipe(
      switchMap(users => {
        if (users.length === 0) {
          return of({ success: false, error: 'username' });
        }
        const user = users[0];
        user.clave = newPassword;
        return this.http.put(`${this.apiUrl}/${user.id}`, user).pipe(
          map(() => ({ success: true })),
          catchError(() => of({ success: false, error: 'update_failed' }))
        );
      }),
      catchError(() => of({ success: false, error: 'unknown' }))
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