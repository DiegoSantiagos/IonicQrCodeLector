import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisAsisPage } from './mis-asis.page';

describe('MisAsisPage', () => {
  let component: MisAsisPage;
  let fixture: ComponentFixture<MisAsisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisAsisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
