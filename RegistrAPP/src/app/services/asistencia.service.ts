import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

interface AsistenciaData {
    id: string;
    classId: number;
    studentId: number;
    date: string;
    asistencia: string;
    horaInicio: string;
    seccion: number;
}

interface ErrorResponse {
    error: any;
}

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

    prepararYRegistrarAsistencia(qrCode: string): Observable<AsistenciaData | ErrorResponse> {
        const [userId, classId, date, hour, seccion] = qrCode.split(',');
        const asistenciaData: AsistenciaData = {
            id: this.generateUniqueId(),
            classId: parseInt(classId, 10),
            studentId: parseInt(userId, 10),
            date: date,
            asistencia: 'presente',
            horaInicio: hour,
            seccion: parseInt(seccion, 10),
        };

        // Verificar si el alumno está inscrito en la clase y sección correspondientes
        return this.obtenerInscripciones().pipe(
            map(inscripciones => {
                const inscripcionValida = inscripciones.find(inscripcion =>
                    inscripcion.studentId === asistenciaData.studentId &&
                    inscripcion.classId === asistenciaData.classId &&
                    inscripcion.seccionId === asistenciaData.seccion
                );

                if (!inscripcionValida) {
                    throw new Error('El alumno no está inscrito en esta clase o sección.');
                }

                return asistenciaData;
            }),
            catchError(error => {
                return of({ error: error.message });
            }),
            switchMap(result => {
                if ('error' in result) {
                    return of(result);
                }
                return this.registrarAsistencia(result as AsistenciaData).pipe(
                    map(() => result as AsistenciaData),
                    catchError(error => of({ error: error.message }))
                );
            })
        );
    }

    private obtenerInscripciones(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/enrollments`);
    }

    private generateUniqueId(): string {
        const lastId = localStorage.getItem('lastUniqueId') || '0';
        const newId = (parseInt(lastId, 10) + 1).toString();
        localStorage.setItem('lastUniqueId', newId);
        return newId;
    }
}