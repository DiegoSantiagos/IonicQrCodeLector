import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AsistenciaService {
    private apiUrl = 'https://totem-tunel.uri1000.win';

    constructor(private http: HttpClient) { }

    registrarAsistencia(asistenciaData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/asistencias`, asistenciaData);
    }

    obtenerAsistencias(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/asistencias`);
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

    prepararYRegistrarAsistencia(qrCode: string): Observable<any> {
        const [userId, classId, date, hour] = qrCode.split(',');
        const asistenciaData = {
            id: this.generateUniqueId(),
            classId: parseInt(classId, 10),
            studentId: parseInt(userId, 10),
            date: date,
            asistencia: 'presente',
            horaInicio: hour
        };
        return this.registrarAsistencia(asistenciaData);
    }

    private generateUniqueId(): string {
        const lastId = localStorage.getItem('lastUniqueId') || '0';
        const newId = (parseInt(lastId, 10) + 1).toString();
        localStorage.setItem('lastUniqueId', newId);
        return newId;
    }
}