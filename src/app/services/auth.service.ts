import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiConfig } from '../config/api.config';

export interface AuthRequest {
  username: string;
  password: string;
}

export interface UserDto {
  id: number;
  username: string;
  roles: string[];
  enabled: boolean;
}

export interface CreateUserDto {
  username: string;
  password: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(private http: HttpClient) { }

  login(authRequest: AuthRequest): Observable<any> {
    // Utiliser une requête plus simple et fiable
    const headers = this.createAuthHeaders(authRequest.username, authRequest.password);

    return this.http.get(`${ApiConfig.BASE_URL}/api/etudiants`, { headers }).pipe(
      tap(() => {
        localStorage.setItem('currentUser', JSON.stringify(authRequest));
        this.isAuthenticated.next(true);
        console.log('✅ Connexion réussie');
      }),
      catchError(error => {
        console.error('❌ Erreur de connexion:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  // Alternative si l'endpoint /etudiants ne fonctionne pas
  loginAlternative(authRequest: AuthRequest): Observable<any> {
    const headers = this.createAuthHeaders(authRequest.username, authRequest.password);

    return this.http.get(`${ApiConfig.BASE_URL}/api/auth/test`, { headers, responseType: 'text' }).pipe(
      tap(() => {
        localStorage.setItem('currentUser', JSON.stringify(authRequest));
        this.isAuthenticated.next(true);
        console.log('✅ Connexion réussie (alternative)');
      }),
      catchError(error => {
        console.error('❌ Erreur de connexion alternative:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  register(createUserDto: CreateUserDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${ApiConfig.BASE_URL}/api/auth/register`, createUserDto).pipe(
      tap(user => {
        console.log('✅ Utilisateur créé:', user);
      }),
      catchError(error => {
        console.error('❌ Erreur inscription:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.isAuthenticated.next(false);
    console.log('🚪 Déconnexion effectuée');
  }

  // CORRECTION PRINCIPALE : Méthode simplifiée et sécurisée
  getAuthHeaders(): HttpHeaders {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.username && currentUser.password) {
      return this.createAuthHeaders(currentUser.username, currentUser.password);
    }
    // Retourne des headers vides mais valides
    return new HttpHeaders();
  }

  // Méthode utilitaire pour créer les headers d'authentification
  private createAuthHeaders(username: string, password: string): HttpHeaders {
    const authString = btoa(`${username}:${password}`);
    return new HttpHeaders({
      'Authorization': `Basic ${authString}`
    });
  }

  getCurrentUser(): AuthRequest | null {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Vérifier que l'utilisateur a les propriétés requises
        if (user && user.username && user.password) {
          return user;
        }
        return null;
      } catch (e) {
        console.error('❌ Erreur parsing user data');
        this.logout();
        return null;
      }
    }
    return null;
  }

  private hasToken(): boolean {
    return !!this.getCurrentUser();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated.value;
  }

  hasRole(role: string): boolean {
    return true;
  }
}