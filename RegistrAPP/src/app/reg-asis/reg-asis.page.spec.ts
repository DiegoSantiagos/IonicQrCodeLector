import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ToastController, ModalController, Platform, NavController } from '@ionic/angular';
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
  let navController: NavController;

  beforeEach(async () => {
    const authServiceMock = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ id: '1' })
    };

    const asistenciaServiceMock = {
      registrarAsistencia: jasmine.createSpy('registrarAsistencia').and.returnValue(of({ success: true }))
    };

    const toastControllerMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
        present: () => Promise.resolve()
      }))
    };

    const modalControllerMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
        present: () => Promise.resolve(),
        onWillDismiss: () => Promise.resolve({ data: { barcode: { displayValue: 'test-qr-code' } } })
      }))
    };

    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    const navControllerMock = {
      navigateForward: jasmine.createSpy('navigateForward')
    };

    await TestBed.configureTestingModule({
      declarations: [RegAsisPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AsistenciaService, useValue: asistenciaServiceMock },
        { provide: ToastController, useValue: toastControllerMock },
        { provide: ModalController, useValue: modalControllerMock },
        { provide: Router, useValue: routerMock },
        { provide: NavController, useValue: navControllerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegAsisPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    asistenciaService = TestBed.inject(AsistenciaService);
    toastController = TestBed.inject(ToastController);
    modalController = TestBed.inject(ModalController);
    router = TestBed.inject(Router);
    navController = TestBed.inject(NavController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});