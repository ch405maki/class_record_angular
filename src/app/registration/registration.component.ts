import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  user = {
    studentID: '',
    name: '',
    email: '',
    password: '',
    courses: [] as string[],
  };

  availableCourses = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Computer Science',
  ];

  selectedCourse?: string;

  constructor(private apiService: ApiService) {}

  addCourse() {
    if (this.selectedCourse && !this.user.courses.includes(this.selectedCourse)) {
      this.user.courses.push(this.selectedCourse);
      this.selectedCourse = '';
    }
  }

  removeCourse(course: string) {
    const index = this.user.courses.indexOf(course);
    if (index !== -1) {
      this.user.courses.splice(index, 1);
    }
  }

  submitForm() {
    if (this.user.studentID && this.user.name && this.user.email && this.user.password) {
      this.apiService.addUser(this.user).subscribe({
        next: (response) => {
          console.log('User added successfully:', response);
          Swal.fire('Registration successful!', '', 'success');
          this.resetForm();
        },
        error: (error) => {
          console.error('Error adding user:', error);
          Swal.fire('Registration failed', 'Please try again.', 'error');
        },
      });
    } else {
      Swal.fire('Error', 'All fields are required!', 'warning');
    }
  }

  resetForm() {
    this.user = { studentID: '', name: '', email: '', password: '', courses: [] };
    this.selectedCourse = '';
  }
}