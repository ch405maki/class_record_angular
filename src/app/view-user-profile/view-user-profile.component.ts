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
  isEditModalOpen = false; 
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
      },
      error: (err) => console.error('Error fetching users:', err),
    });
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
        alert('User updated successfully!');
        this.closeEditModal();
        this.fetchUsers(); 
      },
      error: (err) => {
        console.error('Error updating user:', err);
        alert('Failed to update user.');
      }
    });
  }
  
}
