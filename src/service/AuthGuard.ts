import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable()

export class AuthGuard implements CanActivate {
    constructor(private router: Router, private service: ApiService) {}
  
    canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean | UrlTree> | boolean | UrlTree {        
        if (this.service.userData) {
            return true;

        } else {
            return false;

        }

    }
    
}
