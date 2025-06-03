import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamenContestadoPage } from './examen-contestado.page';

describe('ExamenContestadoPage', () => {
  let component: ExamenContestadoPage;
  let fixture: ComponentFixture<ExamenContestadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamenContestadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
