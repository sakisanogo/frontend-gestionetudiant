import { Component, OnInit } from '@angular/core';
import { EtudiantService } from '../../services/etudiant.service';
import { PaiementService } from '../../services/paiement.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = 'Tableau de Bord';
  totalEtudiants = 0;
  totalPaiements = 0;
  montantTotal = 0;
  loading = true;

  constructor(
    private etudiantService: EtudiantService,
    private paiementService: PaiementService
  ) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    // Charger les étudiants
    this.etudiantService.getAllEtudiants().subscribe({
      next: (etudiants) => {
        this.totalEtudiants = etudiants.length;
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Erreur chargement étudiants:', error);
        this.checkLoadingComplete();
      }
    });

    // Charger les paiements
    this.paiementService.getAllPaiements().subscribe({
      next: (paiements) => {
        this.totalPaiements = paiements.length;
        this.montantTotal = paiements.reduce((total, p) => total + p.montant, 0);
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Erreur chargement paiements:', error);
        this.checkLoadingComplete();
      }
    });
  }

  private checkLoadingComplete(): void {
    // Cette méthode s'assure que le loading s'arrête même si une requête échoue
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  formatMontant(montant: number): string {
    return this.paiementService.formatMontant(montant);
  }
}