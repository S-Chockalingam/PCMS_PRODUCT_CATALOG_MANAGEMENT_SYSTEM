import { CanActivateFn } from '@angular/router';

export const guardGuard: CanActivateFn = (route, state) => {

  const token = localStorage.getItem("token");

  return true;
  
};
