import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AsignaturaService {
    private apiUrl = 'https://totem-tunel.uri1000.win';

    constructor(private http: HttpClient) { }

    getAsignaturasByStudentId(studentId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/enrollments?studentId=${studentId}`).pipe(
            switchMap(enrollments => {
                const classIds = enrollments.map(enrollment => enrollment.classId);
                return this.http.get<any[]>(`${this.apiUrl}/classes?id=${classIds.join('&id=')}`);
            }),
            map(response => response)
        );
    }
}