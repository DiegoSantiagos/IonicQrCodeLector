import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AsistenciaService {
    private apiUrl = 'http://totem-tunel.uri1000.win';

    constructor(private http: HttpClient) { }

    registrarAsistencia(asistenciaData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/asistencias`, asistenciaData);
    }

    obtenerAsistencias(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    enviarDatosDePrueba(): Observable<any> {
        const datosDePrueba = {
            id: 'test-id',
            classId: 1,
            studentId: 1,
            date: '2023-01-01',
            asistencia: 'presente',
            horaInicio: '08:00'
        };
        return this.http.post(`${this.apiUrl}/asistencias`, datosDePrueba);
    }
}
