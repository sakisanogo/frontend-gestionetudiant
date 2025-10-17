import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Paiement } from '../../../models/paiement.model';

@Component({
  selector: 'app-paiement-details',
  templateUrl: './paiement-details.component.html',
  styleUrls: ['./paiement-details.component.scss']
})
export class PaiementDetailsComponent {
  @Input() paiement!: Paiement;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(montant);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  printReceipt(): void {
    window.print();
  }
}