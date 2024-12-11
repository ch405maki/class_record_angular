import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';  // Ensure this is the correct endpoint for your API

  constructor(private http: HttpClient) {}

  // Add a user
  addUser(user: { studentID: string; name: string; email: string; password: string; courses: string[] }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  // Fetch all users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  // Fetch a user by ID
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  // Update a user (if required)
  updateUser(user: { id: string; studentID: string; name: string; email: string; password: string; courses: string[] }): Observable<any> {
    const userData = { ...user, courses: user.courses.join(',') };
  
    // Now you can safely use `user.id` in the PUT request URL
    return this.http.put(`${this.apiUrl}/users/${user.id}`, userData);
  }
  
}
