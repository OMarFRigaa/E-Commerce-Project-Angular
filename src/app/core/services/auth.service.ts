import { Injectable, signal } from "@angular/core";
import { User, LoginRequest, RegisterRequest } from "../models/user.model";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { delay, tap } from "rxjs/operators";
import { Router } from "@angular/router";

// Mock data
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    username: "Admin",
    isAdmin: true,
    imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    gender: "male",
  },
  {
    id: "2",
    email: "user@example.com",
    username: "User",
    isAdmin: false,
    imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
    gender: "female",
  },
];

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn = signal(false);
  isAdmin = signal(false);

  constructor(private router: Router) {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isLoggedIn.set(true);
      this.isAdmin.set(user.isAdmin);
    }
  }

  login(loginRequest: LoginRequest): Observable<User> {
    // In a real app, you would make an HTTP request to your backend
    const user = MOCK_USERS.find((u) => u.email === loginRequest.email);

    if (user && loginRequest.password === "password") {
      // Simplified for demo
      return of(user).pipe(
        delay(500), // Simulate network delay
        tap((user) => {
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.isLoggedIn.set(true);
          this.isAdmin.set(user.isAdmin);
        })
      );
    }

    return throwError(() => new Error("Invalid email or password"));
  }

  register(registerRequest: RegisterRequest): Observable<User> {
    // Check if email already exists
    if (MOCK_USERS.some((u) => u.email === registerRequest.email)) {
      return throwError(() => new Error("Email already in use"));
    }

    // In a real app, you would make an HTTP request to your backend
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      email: registerRequest.email,
      username: registerRequest.username,
      isAdmin: false,
      imageUrl:
        registerRequest.imageUrl ||
        "https://randomuser.me/api/portraits/lego/1.jpg",
      gender: registerRequest.gender,
    };

    // Simulate adding to database
    MOCK_USERS.push(newUser);

    return of(newUser).pipe(
      delay(500), // Simulate network delay
      tap((user) => {
        localStorage.setItem("currentUser", JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isLoggedIn.set(true);
        this.isAdmin.set(user.isAdmin);
      })
    );
  }

  logout(): void {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    this.isLoggedIn.set(false);
    this.isAdmin.set(false);
    this.router.navigate(["/"]);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateUserProfile(updates: Partial<User>): Observable<User> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      return throwError(() => new Error("User not logged in"));
    }

    // Update the user object
    const updatedUser: User = { ...currentUser, ...updates };

    // Update in mock database
    const index = MOCK_USERS.findIndex((u) => u.id === currentUser.id);
    if (index !== -1) {
      MOCK_USERS[index] = updatedUser;
    }

    // Update local storage and subject
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    this.currentUserSubject.next(updatedUser);

    return of(updatedUser).pipe(delay(500)); // Simulate network delay
  }
}
