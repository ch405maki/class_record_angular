import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  user = {
    studentID: '', // Add studentID
    name: '',
    email: '',
    password: '',
    courses: [] as string[], // Initialize courses as an empty array
  };

  newCourse = ''; // Input for new course

  constructor(private apiService: ApiService) {}

  // Add a course to the user's course list
  addCourse() {
    if (this.newCourse && !this.user.courses.includes(this.newCourse)) {
      this.user.courses.push(this.newCourse);
      this.newCourse = ''; // Clear the input after adding
    }
  }

  // Remove a course from the user's course list
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
          alert('Registration successful!');
          this.resetForm();
        },
        error: (error) => {
          console.error('Error adding user:', error);
          alert('Registration failed. Please try again.');
        },
      });
    } else {
      alert('All fields are required!');
    }
  }

  resetForm() {
    this.user = { studentID: '', name: '', email: '', password: '', courses: [] };
    this.newCourse = ''; // Clear the course input
  }
}
