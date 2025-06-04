import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  if (!authService.isLoggedIn()) {
    // Redirect to the login page
    router.navigate(['/auth/login']);
  } else {
    // Redirect to home if logged in but not admin
    router.navigate(['/']);
  }
  
  return false;
};