import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2 class="auth-title">Create Account</h2>
        
        @if (errorMessage) {
          <div class="alert alert-danger">{{ errorMessage }}</div>
        }
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              class="form-control" 
              placeholder="Enter your email"
            />
            @if (email?.invalid && (email?.dirty || email?.touched)) {
              <div class="form-error">
                @if (email?.errors?.['required']) {
                  <span>Email is required</span>
                }
                @if (email?.errors?.['email']) {
                  <span>Please enter a valid email</span>
                }
              </div>
            }
          </div>
          
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username" 
              class="form-control" 
              placeholder="Enter your username"
            />
            @if (username?.invalid && (username?.dirty || username?.touched)) {
              <div class="form-error">
                @if (username?.errors?.['required']) {
                  <span>Username is required</span>
                }
              </div>
            }
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              class="form-control" 
              placeholder="Enter your password"
            />
            @if (password?.invalid && (password?.dirty || password?.touched)) {
              <div class="form-error">
                @if (password?.errors?.['required']) {
                  <span>Password is required</span>
                }
                @if (password?.errors?.['minlength']) {
                  <span>Password must be at least 6 characters</span>
                }
              </div>
            }
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              formControlName="confirmPassword" 
              class="form-control" 
              placeholder="Confirm your password"
            />
            @if (confirmPassword?.invalid && (confirmPassword?.dirty || confirmPassword?.touched)) {
              <div class="form-error">
                @if (confirmPassword?.errors?.['required']) {
                  <span>Please confirm your password</span>
                }
              </div>
            }
            @if (registerForm.errors?.['passwordMismatch'] && confirmPassword?.touched) {
              <div class="form-error">
                <span>Passwords do not match</span>
              </div>
            }
          </div>
          
          <div class="form-group">
            <label for="gender">Gender</label>
            <select id="gender" formControlName="gender" class="form-control">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="imageUrl">Profile Image URL (optional)</label>
            <input 
              type="text" 
              id="imageUrl" 
              formControlName="imageUrl" 
              class="form-control" 
              placeholder="Enter image URL"
            />
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary btn-block" 
              [disabled]="registerForm.invalid || isLoading"
            >
              {{ isLoading ? 'Creating Account...' : 'Register' }}
            </button>
          </div>
        </form>
        
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/auth/login">Login</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 2rem 1rem;
    }
    
    .auth-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      width: 100%;
      max-width: 400px;
    }
    
    .auth-title {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
      font-size: 1.75rem;
    }
    
    .form-group {
      margin-bottom: 1.25rem;
    }
    
    .form-error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .form-actions {
      margin-top: 1.5rem;
    }
    
    .btn-block {
      width: 100%;
      padding: 0.75rem;
    }
    
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }
    
    .auth-footer a {
      color: #3366CC;
      text-decoration: none;
      font-weight: 500;
    }
    
    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      gender: [''],
      imageUrl: ['']
    }, { validators: this.passwordMatchValidator });

    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  get email() { return this.registerForm.get('email'); }
  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to create account. Please try again.';
      }
    });
  }
}