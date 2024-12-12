import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisAsignaturaPage } from './mis-asignatura.page';
import { AuthService } from '../services/auth.service';
import { AsignaturaService } from '../services/asignatura.service';
import { of } from 'rxjs';

describe('MisAsignaturaPage', () => {
  let component: MisAsignaturaPage;
  let fixture: ComponentFixture<MisAsignaturaPage>;
  let authService: AuthService;
  let asignaturaService: AsignaturaService;

  beforeEach(async () => {
    const authServiceMock = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ id: '1' })
    };

    const asignaturaServiceMock = {
      getAsignaturasByStudentId: jasmine.createSpy('getAsignaturasByStudentId').and.returnValue(of([
        { name: 'Matemáticas', code: 'MAT101' },
        { name: 'Historia', code: 'HIS202' }
      ]))
    };

    await TestBed.configureTestingModule({
      declarations: [MisAsignaturaPage],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AsignaturaService, useValue: asignaturaServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MisAsignaturaPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    asignaturaService = TestBed.inject(AsignaturaService);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar las asignaturas en la plantilla', () => {
    const compiled = fixture.nativeElement;
    const asignaturaElements = compiled.querySelectorAll('ion-card-title');
    expect(asignaturaElements.length).toBe(2);
    expect(asignaturaElements[0].textContent).toContain('Matemáticas');
    expect(asignaturaElements[1].textContent).toContain('Historia');
  });
});