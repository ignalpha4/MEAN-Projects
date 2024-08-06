import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const userAuthService = inject(AuthService);
  const router = inject(Router);
  let currentUser: any = null;

  userAuthService.getCurrentUser().subscribe((res:any)=>{

    if(res.success){

      currentUser = res.user;
      console.log(currentUser);

      if(!currentUser){
        alert('Please login first!');
        router.navigate(['/login']);
        return false;
      }

      const requiredRoles = route.data?.['roles'];

      if(requiredRoles && !requiredRoles.includes(currentUser.role)){
        alert("User not authorized");
        router.navigate(['/login']);
        return false;
      }

    }
    
    return true;
  });

  return true;

};
