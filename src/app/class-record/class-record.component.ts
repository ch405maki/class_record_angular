import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-class-record',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './class-record.component.html',
  styleUrls: ['./class-record.component.css']
})
export class ClassRecordComponent {
  users: any[] = [];              // All users fetched from the API
  paginatedUsers: any[] = [];     // Users for the current page
  currentPage = 1;                // Current page number
  pageSize = 5;                   // Number of users per page
  totalPages = 0;                 // Total number of pages
  isEditModalOpen = false;        // Modal state for editing
  isViewModalOpen = false;        // Modal state for viewing
  selectedUser: any = {};         // To store the selected user's data
  newCourse = '';                 // For adding new courses

  constructor(private apiService: ApiService) {
    this.fetchUsers();
  }

  // Fetch users from the API
  fetchUsers() {
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.users = data.map(user => ({
          ...user,
          courses: Array.isArray(user.courses) ? user.courses : user.courses.split(',')  // Convert string to array if needed
        }));
        this.calculatePagination();
      },
      error: (err) => console.error('Error fetching users:', err),
    });
  }

  // Calculate pagination details
  calculatePagination() {
    this.totalPages = Math.ceil(this.users.length / this.pageSize);
    this.updatePaginatedUsers();
  }

  // Update the list of users to show on the current page
  updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  // Go to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  // Go to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }

  // Open the view modal and set the selected user for viewing
  openViewModal(user: any) {
    this.selectedUser = { ...user };  // Copy user data to avoid direct mutation
    this.isViewModalOpen = true;
  }

  // Close the view modal
  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedUser = {};  // Clear selected user data
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
  
    this.apiService.updateUser(this.selectedUser).subscribe({
      next: () => {
        Swal.fire('User updated successfully!', '', 'success');
        this.closeEditModal();
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Error updating user:', err);
        Swal.fire('Failed to update user.', 'Please try again.', 'error');
      }
    });
  }
}
