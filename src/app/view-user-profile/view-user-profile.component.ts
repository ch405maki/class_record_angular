import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-user-profile.component.html',
  styleUrls: ['./view-user-profile.component.css'],
})
export class ViewUserProfileComponent {
  users: any[] = [];
  isEditModalOpen = false;  // Modal state
  selectedUser: any = {};   // To store the selected user's data for editing
  newCourse = '';           // For adding new courses

  constructor(private apiService: ApiService) {
    this.fetchUsers();
  }

  // Fetch users from the API
  fetchUsers() {
    this.apiService.getUsers().subscribe({
      next: (data) => {
        // Ensure courses is always an array (if it's a string, split it into an array)
        this.users = data.map(user => ({
          ...user,
          courses: Array.isArray(user.courses) ? user.courses : user.courses.split(',')  // Convert string to array if needed
        }));
      },
      error: (err) => console.error('Error fetching users:', err),
    });
  }

  // Open the edit modal and set the selected user for editing
  openEditModal(user: any) {
    this.selectedUser = { ...user };  // Copy user data to avoid direct mutation
    this.selectedUser.courses = Array.isArray(this.selectedUser.courses) ? this.selectedUser.courses : this.selectedUser.courses.split(',');
    this.isEditModalOpen = true;
  }

  // Close the edit modal
  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedUser = {};  // Clear selected user data
  }

  // Add a new course
  addCourse() {
    if (this.newCourse && !this.selectedUser.courses.includes(this.newCourse)) {
      this.selectedUser.courses.push(this.newCourse);
      this.newCourse = '';  // Clear input field
    }
  }

  // Remove a course
  removeCourse(course: string) {
    const index = this.selectedUser.courses.indexOf(course);
    if (index !== -1) {
      this.selectedUser.courses.splice(index, 1);
    }
  }

  // Submit the edited user profile
  submitEditForm() {
    console.log('Submitting updated user data:', this.selectedUser);
  
    // Ensure courses is an array before submitting (if it's a string, split it)
    if (typeof this.selectedUser.courses === 'string') {
      this.selectedUser.courses = this.selectedUser.courses.split(',');
    }
  
    // Now, since `selectedUser` contains `id`, you can use it in the request
    this.apiService.updateUser(this.selectedUser).subscribe({
      next: () => {
        alert('User updated successfully!');
        this.closeEditModal();
        this.fetchUsers();  // Refresh the list of users
      },
      error: (err) => {
        console.error('Error updating user:', err);
        alert('Failed to update user.');
      }
    });
  }
  
}
