import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecontraPage } from './recontra.page';

describe('RecontraPage', () => {
  let component: RecontraPage;
  let fixture: ComponentFixture<RecontraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecontraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
