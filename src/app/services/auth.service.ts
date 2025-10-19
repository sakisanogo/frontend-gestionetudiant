import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiConfig } from '../config/api.config';

export interface AuthRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(private http: HttpClient) { }

  // ✅ CONNEXION AVEC SPRING SECURITY
  login(authRequest: AuthRequest): Observable<any> {
    // Spring Security utilise FormData pour le login
    const formData = new FormData();
    formData.append('username', authRequest.username);
    formData.append('password', authRequest.password);

    return this.http.post(`${ApiConfig.BASE_URL}/login`, formData, {
      observe: 'response',
      withCredentials: true // Important pour les cookies de session
    }).pipe(
      tap((response: any) => {
        // Stocker les infos utilisateur
        const userInfo = {
          username: authRequest.username,
          authenticated: true
        };
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        this.isAuthenticated.next(true);
        console.log('✅ Connexion réussie avec Spring Security');
      }),
      catchError(error => {
        console.error('❌ Erreur de connexion:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  // ✅ INSCRIPTION - NOUVEAU ENDPOINT
  register(registerData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${ApiConfig.BASE_URL}/api/auth/register`,
      registerData
    ).pipe(
      tap(user => {
        console.log('✅ Utilisateur inscrit avec succès:', user);
      }),
      catchError(error => {
        console.error('❌ Erreur inscription:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    // Appeler le logout Spring Security
    this.http.post(`${ApiConfig.BASE_URL}/logout`, {}, {
      withCredentials: true
    }).subscribe();

    localStorage.removeItem('currentUser');
    this.isAuthenticated.next(false);
    console.log('🚪 Déconnexion effectuée');
  }

  // ✅ SUPPRIMER getAuthHeaders() - Plus nécessaire avec les cookies
  getCurrentUser(): any {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  private hasToken(): boolean {
    return !!this.getCurrentUser();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated.value;
  }
}