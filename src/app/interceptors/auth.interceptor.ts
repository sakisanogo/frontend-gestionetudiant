import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // ✅ SPRING SECURITY GÈRE L'AUTH AVEC DES COOKIES
    // Pas besoin d'ajouter des headers d'authentification manuellement
    // Les cookies sont envoyés automatiquement par le navigateur

    // On peut simplement passer la requête telle quelle
    return next.handle(req);
  }


}