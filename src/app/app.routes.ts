import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { ViewUserProfileComponent } from './view-user-profile/view-user-profile.component';
import { ClassRecordComponent } from './class-record/class-record.component';
import { EditStudentRecordComponent } from './edit-student-record/edit-student-record.component';

export const routes: Routes = [
  { path: '', redirectTo: '/registration', pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent },
  { path: 'view-user-profile', component: ViewUserProfileComponent },
  { path: 'class-record', component: ClassRecordComponent },
  { path: 'edit-student-record', component: EditStudentRecordComponent },
];
