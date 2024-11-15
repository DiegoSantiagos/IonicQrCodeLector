import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
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
                const sectionIds = enrollments.map(enrollment => enrollment.seccionid);
                return forkJoin([
                    this.http.get<any[]>(`${this.apiUrl}/classes?id=${classIds.join('&id=')}`),
                    this.http.get<any[]>(`${this.apiUrl}/sections?id=${sectionIds.join('&id=')}`)
                ]);
            }),
            map(([classes, sections]) => {
                return classes.map(cl => {
                    const section = sections.find(sec => sec.id === cl.id);
                    return { ...cl, seccion: section ? section.code : '' };
                });
            })
        );
    }
}