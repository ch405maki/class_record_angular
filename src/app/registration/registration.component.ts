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
    name: '',
    email: '',
    password: '',
  };

  // Inject the ApiService
  constructor(private apiService: ApiService) {}

  // Handle form submission
  submitForm() {
    if (this.user.name && this.user.email && this.user.password) {
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

  // Reset the form
  resetForm() {
    this.user = { name: '', email: '', password: '' };
  }
}
