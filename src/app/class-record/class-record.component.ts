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
  users: any[] = [];              
  paginatedUsers: any[] = [];     
  currentPage = 1;                
  pageSize = 5;                  
  totalPages = 0;                 
  isEditModalOpen = false;        
  isViewModalOpen = false;        
  selectedUser: any = {};         
  newCourse = '';                 

  constructor(private apiService: ApiService) {
    this.fetchUsers();
  }

  fetchUsers() {
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.users = data.map(user => ({
          ...user,
          courses: Array.isArray(user.courses) ? user.courses : user.courses.split(',')  
        }));
        this.calculatePagination();
      },
      error: (err) => console.error('Error fetching users:', err),
    });
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.users.length / this.pageSize);
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }

  openViewModal(user: any) {
    this.selectedUser = { ...user };  
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedUser = {};  
  }

  openEditModal(user: any) {
    this.selectedUser = { ...user };  
    this.selectedUser.courses = Array.isArray(this.selectedUser.courses) ? this.selectedUser.courses : this.selectedUser.courses.split(',');
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedUser = {}; 
  }

  addCourse() {
    if (this.newCourse && !this.selectedUser.courses.includes(this.newCourse)) {
      this.selectedUser.courses.push(this.newCourse);
      this.newCourse = ''; 
    }
  }

  removeCourse(course: string) {
    const index = this.selectedUser.courses.indexOf(course);
    if (index !== -1) {
      this.selectedUser.courses.splice(index, 1);
    }
  }

  submitEditForm() {
    console.log('Submitting updated user data:', this.selectedUser);
  
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
