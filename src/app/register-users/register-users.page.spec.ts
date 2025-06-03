import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterUsersPage } from './register-users.page';

describe('RegisterUsersPage', () => {
  let component: RegisterUsersPage;
  let fixture: ComponentFixture<RegisterUsersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
