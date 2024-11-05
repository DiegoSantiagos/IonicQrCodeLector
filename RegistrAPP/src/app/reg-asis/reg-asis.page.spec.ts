import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegAsisPage } from './reg-asis.page';

describe('RegAsisPage', () => {
  let component: RegAsisPage;
  let fixture: ComponentFixture<RegAsisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegAsisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
