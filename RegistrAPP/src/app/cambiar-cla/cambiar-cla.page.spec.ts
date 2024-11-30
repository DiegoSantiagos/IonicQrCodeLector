import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import { CambiarClaPage } from './cambiar-cla.page';

describe('CambiarClaPage', () => {
  let component: CambiarClaPage;
  let fixture: ComponentFixture<CambiarClaPage>;
  let authService: AuthService;
  let toastController: ToastController;

  beforeEach(async () => {
    const authServiceMock = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ id: '1', clave: '12345' }),
      changePassword: jasmine.createSpy('changePassword').and.returnValue(of({ success: true }))
    };

    const toastControllerMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
        present: () => Promise.resolve()
      }))
    };

    await TestBed.configureTestingModule({
      declarations: [CambiarClaPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastController, useValue: toastControllerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CambiarClaPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    toastController = TestBed.inject(ToastController);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar un toast cuando la contraseña actual es incorrecta', async () => {
    component.claveActual = 'wrongPassword';
    component.nuevaClave = 'newPassword';
    component.confirmarClave = 'newPassword';

    await component.cambiarClave();

    expect(toastController.create).toHaveBeenCalledWith({
      message: 'La contraseña actual es incorrecta',
      position: 'middle',
      duration: 2000,
      color: 'danger'
    });
  });

  it('debería mostrar un toast cuando la nueva contraseña está vacía', async () => {
    component.claveActual = '12345';
    component.nuevaClave = '';
    component.confirmarClave = '';

    await component.cambiarClave();

    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Ingresar nueva clave',
      position: 'middle',
      duration: 2000,
      color: 'danger'
    });
  });

  it('debería mostrar un toast cuando la nueva contraseña y la confirmación no coinciden', async () => {
    component.claveActual = '12345';
    component.nuevaClave = 'newPassword';
    component.confirmarClave = 'differentPassword';

    await component.cambiarClave();

    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Las contraseñas no coinciden',
      position: 'middle',
      duration: 2000,
      color: 'danger'
    });
  });

  it('debería cambiar la contraseña exitosamente', async () => {
    component.claveActual = '12345';
    component.nuevaClave = 'newPassword';
    component.confirmarClave = 'newPassword';

    await component.cambiarClave();

    expect(authService.changePassword).toHaveBeenCalledWith('newPassword');
    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Contraseña cambiada exitosamente',
      position: 'middle',
      duration: 2000,
      color: 'success'
    });
  });

  it('debería mostrar un toast cuando hay un error al cambiar la contraseña', async () => {
    (authService.changePassword as jasmine.Spy).and.returnValue(throwError('error'));
    component.claveActual = '12345';
    component.nuevaClave = 'newPassword';
    component.confirmarClave = 'newPassword';

    await component.cambiarClave();

    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Error al cambiar la contraseña',
      position: 'middle',
      duration: 2000,
      color: 'danger'
    });
  });
});