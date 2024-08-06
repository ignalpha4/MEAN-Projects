import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userAuthService = inject(AuthService);
  const router = inject(Router);

  const currentUser =  userAuthService.getCurrentUser();
  const requiredRoles = route.data?.['roles'];


  if(!currentUser){
    alert('Login is required');
    router.navigate(['/login']);
    return false;
  }

  if(requiredRoles && !requiredRoles.includes(currentUser.role)){
    alert("User not authorized");
    router.navigate(['/login']);
    return false;
  }

  return true;
};
