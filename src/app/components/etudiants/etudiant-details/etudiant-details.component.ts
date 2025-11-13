import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Etudiant } from '../../../models/etudiant.model';
import { Paiement } from '../../../models/paiement.model';
import { PaiementService } from '../../../services/paiement.service';

@Component({
  selector: 'app-etudiant-details',
  templateUrl: './etudiant-details.component.html',
  styleUrls: ['./etudiant-details.component.scss']
})
export class EtudiantDetailsComponent implements OnInit {
  @Input() etudiant!: Etudiant;
  @Output() close = new EventEmitter<void>();

  paiements: Paiement[] = [];
  showPaiements = false;
  loading = false;
  totalPaiements = 0;
  hasPaiements = false; // Nouvelle propriété pour suivre l'état

  constructor(private paiementService: PaiementService) { }

  ngOnInit(): void {
    // Vérifier si l'étudiant a des paiements dès l'initialisation
    this.checkIfHasPaiements();
  }

  onClose(): void {
    this.close.emit();
  }

  // Vérifier via l'API si l'étudiant a des paiements
  checkIfHasPaiements(): void {
    if (!this.etudiant.id) return;

    this.paiementService.getPaiementsByEtudiant(this.etudiant.id).subscribe({
      next: (data) => {
        this.hasPaiements = data && data.length > 0;
        // Précharger les paiements si besoin
        if (this.hasPaiements) {
          this.paiements = data;
          this.calculerTotalPaiements();
        }
      },
      error: (err) => {
        console.error('Erreur vérification paiements:', err);
        this.hasPaiements = false;
      }
    });
  }

  togglePaiements(): void {
    this.showPaiements = !this.showPaiements;
    // Charger les paiements seulement si on les affiche et qu'ils ne sont pas déjà chargés
    if (this.showPaiements && this.hasPaiements && this.paiements.length === 0) {
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
        this.hasPaiements = false; // Mettre à jour l'état en cas d'erreur
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