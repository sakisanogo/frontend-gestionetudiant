import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Etudiant, CreateEtudiantRequest } from '../models/etudiant.model';
import { ApiConfig } from '../config/api.config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAllEtudiants(): Observable<Etudiant[]> {
    const headers = this.authService.getAuthHeaders();

    return this.http.get<Etudiant[]>(ApiConfig.ETUDIANTS_URL, { headers }).pipe(
      tap(etudiants => {
        console.log('✅ Étudiants récupérés:', etudiants);
      }),
      catchError(error => {
        console.error('❌ Erreur récupération étudiants:', error);
        // Propager l'erreur pour que le component puisse la gérer
        return throwError(() => error);
      })
    );
  }

  createEtudiant(etudiant: CreateEtudiantRequest): Observable<Etudiant> {
    const headers = this.authService.getAuthHeaders();

    return this.http.post<Etudiant>(ApiConfig.ETUDIANTS_URL, etudiant, { headers }).pipe(
      tap(newEtudiant => {
        console.log('✅ Étudiant créé avec succès:', newEtudiant);
      }),
      catchError(error => {
        console.error('❌ Erreur création étudiant:', error);
        return throwError(() => error);
      })
    );
  }

  deleteEtudiant(id: number): Observable<void> {
    const headers = this.authService.getAuthHeaders();

    return this.http.delete<void>(`${ApiConfig.ETUDIANTS_URL}/${id}`, { headers }).pipe(
      tap(() => {
        console.log('✅ Étudiant supprimé:', id);
      }),
      catchError(error => {
        console.error('❌ Erreur suppression étudiant:', error);
        return throwError(() => error);
      })
    );
  }
}