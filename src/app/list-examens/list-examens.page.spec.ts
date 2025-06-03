import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListExamensPage } from './list-examens.page';

describe('ListExamensPage', () => {
  let component: ListExamensPage;
  let fixture: ComponentFixture<ListExamensPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExamensPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
