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
  @Output() paiementCreated = new EventEmitter<void>();

  paiement: CreatePaiementRequest = {
    montant: 0,
    motif: '',
    etudiantId: 0
  };

  // Liste des motifs prédéfinis
  motifs = [
    'Frais de scolarité',
    'Frais d\'inscription',
    'Frais de bibliothèque',
    'Frais de cantine',
    'Frais de transport',
    'Frais divers',
    'Autre'
  ];

  etudiants: Etudiant[] = [];
  isSubmitting = false;
  showForm = false;
  error = '';

  // ✅ Constante pour le montant maximum
  readonly MONTANT_MAXIMAL = 1000000;

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
    // ✅ Validation avec regex et montant maximum avant envoi
    if (this.isFormValid() && this.isFormDataValid()) {
      this.isSubmitting = true;
      this.error = '';

      console.log('📝 Données du formulaire:', this.paiement);

      this.paiementService.createPaiement(this.paiement).subscribe({
        next: (newPaiement) => {
          this.paiementCreated.emit();
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
      this.error = this.getValidationErrorMessage();
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

  // ✅ NOUVELLE MÉTHODE : Message d'erreur de validation
  private getValidationErrorMessage(): string {
    if (!this.isFormValid()) {
      return 'Veuillez remplir tous les champs correctement';
    }

    if (!this.isMontantValid()) {
      return `Le montant ne peut pas dépasser ${this.MONTANT_MAXIMAL.toLocaleString()} FCFA`;
    }

    if (!this.isMotifValid()) {
      return 'Le motif contient des caractères non autorisés. Seules les lettres, chiffres, espaces, tirets et apostrophes sont acceptés.';
    }

    return 'Données invalides';
  }

  resetForm(): void {
    this.paiement = {
      montant: 0,
      motif: '',
      etudiantId: 0
    };
    this.error = '';
  }

  // Validation basique (champs non vides)
  isFormValid(): boolean {
    return this.paiement.montant > 0 &&
      this.paiement.motif.trim().length > 0 &&
      this.paiement.etudiantId > 0;
  }

  // ✅ NOUVELLES MÉTHODES : Validation avec regex et montant maximum
  isFormDataValid(): boolean {
    return this.isMotifValid() && this.isMontantValid();
  }

  isMotifValid(): boolean {
    if (!this.paiement.motif.trim()) return true; // Laisser passer si vide

    // Regex pour motif (lettres, chiffres, espaces, tirets, apostrophes, ponctuation basique)
    const motifRegex = /^[a-zA-ZÀ-ÿ0-9\s\-']+$/;
    return motifRegex.test(this.paiement.motif.trim());
  }

  // ✅ MÉTHODE MODIFIÉE : Validation du montant avec limite
  isMontantValid(): boolean {
    return this.paiement.montant > 0 &&
      this.paiement.montant <= this.MONTANT_MAXIMAL;
  }

  // Helper pour afficher le nom de l'étudiant
  getEtudiantName(etudiantId: number): string {
    const etudiant = this.etudiants.find(e => e.id === etudiantId);
    return etudiant ? `${etudiant.prenom} ${etudiant.nom}` : 'Inconnu';
  }

  // ✅ MÉTHODE SIMPLIFIÉE : Nettoyage seulement des caractères invalides
  onMontantInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Supprimer les caractères non numériques sauf le point décimal
    value = value.replace(/[^0-9.]/g, '');

    // S'assurer qu'il n'y a qu'un seul point décimal
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limiter à 2 décimales
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }

    input.value = value;
    this.paiement.montant = parseFloat(value) || 0;
  }

  // ✅ MÉTHODES DE SAISIE (laissées vides pour permettre toute saisie)
  verifierCaractere(event: KeyboardEvent): void {
    // Laissé vide pour permettre toute saisie
    // La validation se fera au moment de l'enregistrement
  }

  verifierChiffres(event: KeyboardEvent): void {
    // Laissé vide pour permettre toute saisie
    // La validation se fera au moment de l'enregistrement
  }
}