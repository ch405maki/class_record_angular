import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-user-profile.component.html',
  styleUrls: ['./view-user-profile.component.css'],
})
export class ViewUserProfileComponent {
  users: any[] = [];

  constructor(private apiService: ApiService) {
    this.fetchUsers();
  }

  fetchUsers() {
    this.apiService.getUsers().subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('Error fetching users:', err),
    });
  }
}
  