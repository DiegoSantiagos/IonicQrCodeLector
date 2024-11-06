import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisAsignaturaPage } from './mis-asignatura.page';

describe('MisAsignaturaPage', () => {
  let component: MisAsignaturaPage;
  let fixture: ComponentFixture<MisAsignaturaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisAsignaturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
