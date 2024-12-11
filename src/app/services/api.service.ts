import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Add a user
  addUser(user: { name: string; email: string; password: string }): Observable<any> {
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
}
