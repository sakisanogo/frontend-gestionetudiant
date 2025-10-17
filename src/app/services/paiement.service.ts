import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Paiement, CreatePaiementRequest } from '../models/paiement.model';
import { ApiConfig } from '../config/api.config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Génère un numéro de reçu unique
  generateNumeroRecu(): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `RECU-${timestamp}-${random}`;
  }

  // Créer un nouveau paiement - CORRIGÉ
  createPaiement(paiement: CreatePaiementRequest): Observable<Paiement> {
    // Préparer les données exactement comme l'API les attend
    const paiementData = {
      montant: Number(paiement.montant),
      motif: paiement.motif.trim(),
      etudiantId: Number(paiement.etudiantId),
      numeroRecu: this.generateNumeroRecu(),
      datePaiement: new Date().toISOString()
    };

    console.log('📤 Données envoyées à l\'API:', paiementData);

    return this.http.post<Paiement>(ApiConfig.PAIEMENTS_URL, paiementData, {
      headers: this.getHeaders()
    }).pipe(
      tap(newPaiement => {
        console.log('✅ Paiement créé avec succès:', newPaiement);
      }),
      catchError(error => {
        console.error('❌ Erreur API - Création paiement:', error);
        console.error('📋 Détails de l\'erreur:', error.error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer tous les paiements
  getAllPaiements(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(ApiConfig.PAIEMENTS_URL, {
      headers: this.getHeaders()
    }).pipe(
      tap(paiements => {
        console.log('✅ Paiements récupérés:', paiements?.length || 0);
      }),
      catchError(error => {
        console.error('❌ Erreur API - Chargement des paiements:', error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer les paiements d'un étudiant spécifique
  getPaiementsByEtudiant(etudiantId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${ApiConfig.PAIEMENTS_URL}/etudiant/${etudiantId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(paiements => {
        console.log(`✅ Paiements de l'étudiant ${etudiantId}:`, paiements?.length || 0);
      }),
      catchError(error => {
        console.error(`❌ Erreur API - Paiements étudiant ${etudiantId}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Formater le montant
  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(montant);
  }

  // Formater la date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}