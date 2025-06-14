import {HttpEvent, HttpHandler, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {Injectable} from '@angular/core';

export const appHttpInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

@Injectable()
export class AppHttpInterceptor {
  constructor(private authService: AuthService) {

  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!request.url.includes('/auth/login')) {
      let newRequest = request.clone({
        headers : request.headers.set('Authorization','Bearer '+this.authService.accessToken)
      });
      return next.handle(newRequest);
    } else return next.handle(request);

  }
}
