import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  
  const userAuthService = inject(AuthService);
  const router = inject(Router);

  return userAuthService.getcurrentuser().pipe(
    map((res:any) => {
      const currentUser = res.user.role;
      const requiredRoles = route.data?.['roles'];

      if (!currentUser) {
        alert('please login');
        router.navigate(['/login']);
        return false;
      }

      if (requiredRoles && !requiredRoles.includes(currentUser)) {
        alert("not authorized");
        return false;
      }
      return true;
    }),
  );
};