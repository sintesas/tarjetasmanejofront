import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRolModalComponent } from './select-rol-modal.component';

describe('SelectRolModalComponent', () => {
  let component: SelectRolModalComponent;
  let fixture: ComponentFixture<SelectRolModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectRolModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectRolModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
