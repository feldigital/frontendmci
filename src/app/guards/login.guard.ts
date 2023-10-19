import { TokenService } from 'src/app/servicios/token.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {


  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {


    if (localStorage.getItem("lidersistema")) {
      return true;
    }
    else{this.router.navigate(['/login']);
    return false;}
   
  }
    /*
    if (this.tokenService.isLogged()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }*/

}