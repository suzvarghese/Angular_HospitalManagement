import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

// Usage in routes: canActivate: [authGuard], data: { role: 'Doctor' }
export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data['role'];
  if (requiredRole === 'Doctor' && !authService.isDoctor()) {
    // Logged in, but not resolved as a doctor (or logged in as a
    // different role entirely) -- send back to login.
    router.navigate(['/login']);
    return false;
  }

  return true;
};
