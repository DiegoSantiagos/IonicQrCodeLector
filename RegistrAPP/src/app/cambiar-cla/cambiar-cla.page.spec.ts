import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarClaPage } from './cambiar-cla.page';

describe('CambiarClaPage', () => {
  let component: CambiarClaPage;
  let fixture: ComponentFixture<CambiarClaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarClaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
