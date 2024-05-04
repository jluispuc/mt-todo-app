import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private router: Router
  ){

  }
  canActivate() {
    const token = this.tokenService.isValidToken();
    if (!token){
      console.log("El token no es valido");
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
  
}
