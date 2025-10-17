import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CreatePaiementRequest } from '../../../models/paiement.model';
import { Etudiant } from '../../../models/etudiant.model';
import { PaiementService } from '../../../services/paiement.service';
import { EtudiantService } from '../../../services/etudiant.service';

@Component({
  selector: 'app-paiement-form',
  templateUrl: './paiement-form.component.html',
  styleUrls: ['./paiement-form.component.scss']
})
export class PaiementFormComponent implements OnInit {
  @Output() paiementCreated = new EventEmitter<void>(); // Changé ici

  paiement: CreatePaiementRequest = {
    montant: 0,
    motif: '',
    etudiantId: 0
  };

  etudiants: Etudiant[] = [];
  isSubmitting = false;
  showForm = false;
  error = '';

  constructor(
    private paiementService: PaiementService,
    private etudiantService: EtudiantService
  ) { }

  ngOnInit(): void {
    this.loadEtudiants();
  }

  loadEtudiants(): void {
    this.etudiantService.getAllEtudiants().subscribe({
      next: (data) => {
        this.etudiants = data;
        console.log('✅ Étudiants chargés:', this.etudiants);
      },
      error: (err) => {
        console.error('❌ Erreur chargement étudiants:', err);
        this.error = 'Erreur lors du chargement de la liste des étudiants';
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.isSubmitting = true;
      this.error = '';

      console.log('📝 Données du formulaire:', this.paiement);

      this.paiementService.createPaiement(this.paiement).subscribe({
        next: (newPaiement) => {

          this.paiementCreated.emit(); // Changé ici
          this.resetForm();
          this.isSubmitting = false;
          this.showForm = false;

        },
        error: (err) => {
          console.error('❌ Erreur création paiement:', err);
          this.error = this.getErrorMessage(err);
          this.isSubmitting = false;
        }
      });
    } else {
      this.error = 'Veuillez remplir tous les champs correctement';
    }
  }

  private getErrorMessage(error: any): string {
    if (error.status === 400) {
      return 'Données invalides. Vérifiez les informations saisies.';
    } else if (error.status === 401) {
      return 'Non autorisé. Veuillez vous reconnecter.';
    } else if (error.status === 500) {
      return 'Erreur serveur. Veuillez réessayer plus tard.';
    } else {
      return 'Erreur lors de la création du paiement';
    }
  }

  resetForm(): void {
    this.paiement = {
      montant: 0,
      motif: '',
      etudiantId: 0
    };
    this.error = '';
  }

  isFormValid(): boolean {
    return this.paiement.montant > 0 &&
      this.paiement.motif.trim().length > 0 &&
      this.paiement.etudiantId > 0;
  }

  // Helper pour afficher le nom de l'étudiant
  getEtudiantName(etudiantId: number): string {
    const etudiant = this.etudiants.find(e => e.id === etudiantId);
    return etudiant ? `${etudiant.prenom} ${etudiant.nom}` : 'Inconnu';
  }
}