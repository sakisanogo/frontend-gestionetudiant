import { Component, OnInit } from '@angular/core';
import { Paiement } from '../../../models/paiement.model';
import { PaiementService } from '../../../services/paiement.service';

@Component({
  selector: 'app-paiement-list',
  templateUrl: './paiement-list.component.html',
  styleUrls: ['./paiement-list.component.scss']
})
export class PaiementListComponent implements OnInit {
  paiements: Paiement[] = [];
  selectedPaiement: Paiement | null = null;
  loading = false;
  error = '';

  constructor(private paiementService: PaiementService) { }

  ngOnInit(): void {
    this.loadPaiements();
  }

  loadPaiements(): void {
    this.loading = true;
    this.error = '';

    this.paiementService.getAllPaiements().subscribe({
      next: (data) => {
        this.paiements = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des paiements';
        this.loading = false;
        console.error('Erreur API paiements:', err);
      }
    });
  }

  viewDetail(paiement: Paiement): void {
    this.selectedPaiement = paiement;
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

  refresh(): void {
    this.loadPaiements();
  }
}