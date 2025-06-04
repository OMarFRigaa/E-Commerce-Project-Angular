import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2 class="auth-title">Login</h2>
        
        @if (errorMessage) {
          <div class="alert alert-danger">{{ errorMessage }}</div>
        }
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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
              </div>
            }
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary btn-block" 
              [disabled]="loginForm.invalid || isLoading"
            >
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </form>
        
        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/auth/register">Register</a></p>
        </div>
        
        <div class="auth-demo">
          <h4>Demo Accounts:</h4>
          <div class="demo-accounts">
            <div class="demo-account" (click)="fillDemoAccount('admin&#64;example.com')">
              <strong>Admin:</strong> admin&#64;example.com / password
            </div>
            <div class="demo-account" (click)="fillDemoAccount('user&#64;example.com')">
              <strong>User:</strong> user&#64;example.com / password
            </div>
          </div>
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
    
    .auth-demo {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }
    
    .auth-demo h4 {
      font-size: 1rem;
      margin-bottom: 0.75rem;
      color: #555;
    }
    
    .demo-accounts {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .demo-account {
      background-color: #f8f9fa;
      padding: 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .demo-account:hover {
      background-color: #e9ecef;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to login. Please try again.';
      }
    });
  }

  fillDemoAccount(email: string): void {
    this.loginForm.patchValue({
      email,
      password: 'password'
    });
  }
}