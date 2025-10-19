import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Etudiant, CreateEtudiantRequest } from '../models/etudiant.model';
import { ApiConfig } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {

  constructor(private http: HttpClient) { }

  getAllEtudiants(): Observable<Etudiant[]> {
    console.log('🔄 Tentative de récupération depuis:', ApiConfig.ETUDIANTS_URL);

    return this.http.get<Etudiant[]>(ApiConfig.ETUDIANTS_URL, {
      withCredentials: true
    }).pipe(
      tap(etudiants => {
        console.log('✅ Étudiants récupérés avec succès:', etudiants);
      }),
      catchError(error => {
        console.error('❌ Erreur récupération étudiants:', error);
        return throwError(() => new Error(`Erreur lors du chargement des étudiants: ${error.message}`));
      })
    );
  }

  createEtudiant(etudiant: CreateEtudiantRequest): Observable<Etudiant> {
    console.log('🔄 Création étudiant sur:', ApiConfig.ETUDIANTS_URL);

    return this.http.post<Etudiant>(ApiConfig.ETUDIANTS_URL, etudiant, {
      withCredentials: true
    }).pipe(
      tap(newEtudiant => {
        console.log('✅ Étudiant créé avec succès:', newEtudiant);
      }),
      catchError(error => {
        console.error('❌ Erreur création étudiant:', error);
        return throwError(() => new Error(`Erreur lors de la création: ${error.message}`));
      })
    );
  }

  deleteEtudiant(id: number): Observable<void> {
    const deleteUrl = `${ApiConfig.ETUDIANTS_URL}/${id}`;
    console.log('🔄 Suppression étudiant sur:', deleteUrl);

    return this.http.delete<void>(deleteUrl, {
      withCredentials: true
    }).pipe(
      tap(() => {
        console.log('✅ Étudiant supprimé:', id);
      }),
      catchError(error => {
        console.error('❌ Erreur suppression étudiant:', error);
        return throwError(() => new Error(`Erreur lors de la suppression: ${error.message}`));
      })
    );
  }

  // Méthode pour tester la connexion
  testConnection(): Observable<any> {
    return this.http.get(ApiConfig.ETUDIANTS_URL, {
      withCredentials: true
    }).pipe(
      tap(() => console.log('✅ Connexion API réussie')),
      catchError(error => {
        console.error('❌ Test connexion échoué:', error);
        return throwError(() => error);
      })
    );
  }
}