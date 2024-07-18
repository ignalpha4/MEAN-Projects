import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userAuthService = inject(AuthService);
  const router = inject(Router);

  return userAuthService.getCurrentUser().pipe(
    map((res) => {
      const currentUser = res.user.role;
      const requiredRoles = route.data?.['roles'];

      if (!currentUser) {
        alert('Login is required');
        router.navigate(['/login']);
        return false;
      }

      if (requiredRoles && !requiredRoles.includes(currentUser)) {
        alert("User not authorized");
        return false;
      }
      return true;
    }),
  );
};
