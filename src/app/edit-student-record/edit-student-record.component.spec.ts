import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStudentRecordComponent } from './edit-student-record.component';

describe('EditStudentRecordComponent', () => {
  let component: EditStudentRecordComponent;
  let fixture: ComponentFixture<EditStudentRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStudentRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStudentRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
