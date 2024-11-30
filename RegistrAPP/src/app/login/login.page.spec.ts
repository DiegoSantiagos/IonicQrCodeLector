import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { LoginPage } from './login.page';
import { of } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authService: AuthService;
  let router: Router;
  let toastController: ToastController;

  beforeEach(async () => {
    const authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(of({ success: true }))
    };

    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        ToastController
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    toastController = TestBed.inject(ToastController);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar al método login en AuthService cuando se llama a login', () => {
    component.username = 'testuser';
    component.password = 'testpassword';
    component.login();
    expect(authService.login).toHaveBeenCalledWith('testuser', 'testpassword');
  });

  it('debería navegar a home en caso de inicio de sesión exitoso', () => {
    component.username = 'testuser';
    component.password = 'testpassword';
    component.login();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería mostrar un toast en caso de error de inicio de sesión', async () => {
    spyOn(authService, 'login').and.returnValue(of({ success: false, error: 'username' }));
    spyOn(toastController, 'create').and.returnValue(Promise.resolve({
      present: () => Promise.resolve()
    } as any));

    component.username = 'testuser';
    component.password = 'testpassword';
    await component.login();

    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Nombre de usuario incorrecto',
      position: 'middle',
      duration: 2000,
      color: 'danger'
    });
  });
});