import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    const authServiceMock = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ id: '1', name: 'Test User', role: 'alumno' }),
      logout: jasmine.createSpy('logout')
    };

    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener el usuario actual al inicializar', () => {
    component.ngOnInit();
    expect(authService.getCurrentUser).toHaveBeenCalled();
    expect(component.currentUser).toEqual({ id: '1', name: 'Test User', role: 'alumno' });
  });

  it('debería navegar al login si el usuario no está autenticado', () => {
    (authService.getCurrentUser as jasmine.Spy).and.returnValue(null);
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería llamar a logout y navegar al login', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});