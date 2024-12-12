import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HomePage } from './home.page';
import { AuthService } from '../services/auth.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let authService: AuthService;
  let router: Router;
  let navController: NavController;

  beforeEach(async () => {
    const authServiceMock = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ id: '1', name: 'Test User', role: 'alumno' }),
      logout: jasmine.createSpy('logout')
    };

    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    const navControllerMock = {
      navigateForward: jasmine.createSpy('navigateForward')
    };

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NavController, useValue: navControllerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    navController = TestBed.inject(NavController);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});