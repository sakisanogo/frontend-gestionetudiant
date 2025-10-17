import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Etudiant } from '../../../models/etudiant.model';
import { Paiement } from '../../../models/paiement.model';
import { PaiementService } from '../../../services/paiement.service';


@Component({
  selector: 'app-etudiant-details',
  templateUrl: './etudiant-details.component.html',
  styleUrls: ['./etudiant-details.component.scss']
})
export class EtudiantDetailsComponent {
  @Input() etudiant!: Etudiant;
  @Output() close = new EventEmitter<void>();

  paiements: Paiement[] = [];
  showPaiements = false;
  loading = false;
  totalPaiements = 0;

  constructor(private paiementService: PaiementService) { }

  onClose(): void {
    this.close.emit();
  }

  togglePaiements(): void {
    this.showPaiements = !this.showPaiements;
    if (this.showPaiements && this.etudiant.id) {
      this.loadPaiementsEtudiant();
    }
  }

  loadPaiementsEtudiant(): void {
    if (!this.etudiant.id) return;

    this.loading = true;
    this.paiementService.getPaiementsByEtudiant(this.etudiant.id).subscribe({
      next: (data) => {
        this.paiements = data;
        this.calculerTotalPaiements();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement paiements:', err);
        this.loading = false;
        this.paiements = [];
      }
    });
  }

  calculerTotalPaiements(): void {
    this.totalPaiements = this.paiements.reduce((total, paiement) => total + paiement.montant, 0);
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(montant);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}