import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService {
  constructor(public service: ApiService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    
    if(this.service.userData !== null){
      const cloned = req.clone({ headers: req.headers.set('authorization', this.service.userData.token)});

      console.log('lalalalla');
      return next.handle(cloned);


    } else {
      const cloned = req.clone({ headers: req.headers.set('authorization', '')});

      console.log('kakakaka');

      return next.handle(cloned);
    }     

  }

}