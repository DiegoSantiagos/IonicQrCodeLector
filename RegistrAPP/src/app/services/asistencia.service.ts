import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AsistenciaService {
    private apiUrl = 'http://totem-tunel.uri1000.win/asistencias';

    constructor(private http: HttpClient) { }

    registrarAsistencia(asistencia: any): Observable<any> {
        return this.http.post(this.apiUrl, asistencia);
    }

    obtenerAsistencias(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }
}