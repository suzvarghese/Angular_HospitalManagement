import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

// Usage in routes: canActivate: [authGuard], data: { role: 'Doctor' }
// or data: { role: 'Pharmacist' }, etc. -- works for any role, not just Doctor.
export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole: string | undefined = route.data['role'];
  if (requiredRole && !authService.hasRole(requiredRole)) {
    // Logged in, but not resolved as this specific role -- send back to login.
    router.navigate(['/login']);
    return false;
  }

  return true;
};