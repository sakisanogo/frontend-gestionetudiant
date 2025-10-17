import { Component, OnInit } from '@angular/core';
import { PaiementService } from '../../services/paiement.service';
import { EtudiantService } from '../../services/etudiant.service';

@Component({
  selector: 'app-paiements-page',
  templateUrl: './paiements-page.component.html',
  styleUrls: ['./paiements-page.component.scss']
})
export class PaiementsPageComponent implements OnInit {
  title = 'Gestion des Paiements';
  totalPaiements = 0;
  loading = false;

  constructor(
    private paiementService: PaiementService,
    private etudiantService: EtudiantService
  ) { }

  ngOnInit(): void {
    this.loadStats();
  }

  /**
   * Charger les statistiques des paiements
   */
  loadStats(): void {
    this.loading = true;
    this.paiementService.getAllPaiements().subscribe({
      next: (paiements) => {
        this.totalPaiements = paiements?.length || 0;
        this.loading = false;
        console.log(`📊 Statistiques: ${this.totalPaiements} paiements`);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des statistiques:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Gérer la création d'un nouveau paiement
   */
  onPaiementCreated(): void { // Changé ici
    console.log('🔄 Nouveau paiement créé, rechargement des données...');

    // Recharger les statistiques
    this.loadStats();

    // Recharger la liste des paiements
    setTimeout(() => {
      window.dispatchEvent(new Event('paiementUpdated'));
    }, 1000);
  }

  /**
   * Rafraîchir la page manuellement
   */
  onRefresh(): void {
    this.loadStats();
  }

  /**
   * Formater un montant pour l'affichage
   */
  formatMontant(montant: number): string {
    return this.paiementService.formatMontant(montant);
  }
}