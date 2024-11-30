import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { IonicModule, ToastController, ModalController, Platform } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RegAsisPage } from './reg-asis.page';
import { AuthService } from '../services/auth.service';
import { AsistenciaService } from '../services/asistencia.service';
import { of } from 'rxjs';

describe('RegAsisPage', () => {
  let component: RegAsisPage;
  let fixture: ComponentFixture<RegAsisPage>;
  let authService: AuthService;
  let asistenciaService: AsistenciaService;
  let toastController: ToastController;
  let modalController: ModalController;
  let router: Router;

  beforeEach(async () => {
    const authServiceMock = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ id: '1', role: 'alumno' })
    };

    const asistenciaServiceMock = {
      registrarAsistencia: jasmine.createSpy('registrarAsistencia').and.returnValue(of({ success: true })),
      obtenerAsistencias: jasmine.createSpy('obtenerAsistencias').and.returnValue(of([])),
      enviarDatosDePrueba: jasmine.createSpy('enviarDatosDePrueba').and.returnValue(of({ success: true }))
    };

    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [RegAsisPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AsistenciaService, useValue: asistenciaServiceMock },
        { provide: Router, useValue: routerMock },
        ToastController,
        ModalController,
        Platform
      ]
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(RegAsisPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    asistenciaService = TestBed.inject(AsistenciaService);
    toastController = TestBed.inject(ToastController);
    modalController = TestBed.inject(ModalController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería generar el código QR correctamente', () => {
    component.selectedClassId = 1;
    component.selectedSectionId = 1;
    component.currentUser = { id: '1' };
    const currentDate = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();
    component.generateQRCode();
    expect(component.valorQr).toBe(`1,1,${currentDate},${currentHour},1`);
  });

  it('debería mostrar un toast cuando no se selecciona una clase o sección', async () => {
    spyOn(toastController, 'create').and.returnValue(Promise.resolve({
      present: () => Promise.resolve()
    } as any));

    component.generateQRCode();
    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Debe seleccionar una materia y una sección.',
      position: 'middle',
      duration: 2000,
      color: 'warning'
    });
  });

  it('debería llamar a registrarAsistencia con el resultado del escaneo', () => {
    component.scanResult = '1,1,2024-11-15,12,1';
    component.registrarAsistencia(component.scanResult);
    expect(asistenciaService.registrarAsistencia).toHaveBeenCalled();
  });

  it('debería navegar a login si el usuario no está autenticado', () => {
    component.currentUser = null;
    component.registrarAsistencia('1,1,2024-11-15,12,1');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});