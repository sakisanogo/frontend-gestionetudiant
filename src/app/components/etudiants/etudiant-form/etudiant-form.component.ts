import { Component, EventEmitter, Output } from '@angular/core';
import { CreateEtudiantRequest } from '../../../models/etudiant.model';
import { EtudiantService } from '../../../services/etudiant.service';

@Component({
  selector: 'app-etudiant-form',
  templateUrl: './etudiant-form.component.html',
  styleUrls: ['./etudiant-form.component.scss']
})
export class EtudiantFormComponent {
  @Output() etudiantCreated = new EventEmitter<CreateEtudiantRequest>();

  etudiant: CreateEtudiantRequest = {
    nom: '',
    prenom: '',
    matricule: ''
  };

  isSubmitting = false;
  showForm = false;
  error = '';

  constructor(private etudiantService: EtudiantService) { }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  onSubmit(): void {
    // Réinitialise l'erreur avant validation
    this.error = '';

    // Validation des champs vides
    if (!this.isFormValid()) {
      this.error = 'Tous les champs sont obligatoires';
      return;
    }

    // Validation avec regex
    if (!this.isFormDataValid()) {
      return; // Les messages d'erreur spécifiques sont déjà définis dans isFormDataValid
    }

    this.isSubmitting = true;

    this.etudiantService.createEtudiant(this.etudiant).subscribe({
      next: (newEtudiant) => {
        this.etudiantCreated.emit(this.etudiant);
        this.resetForm();
        this.isSubmitting = false;
        this.showForm = false;
        alert(`✅ Étudiant créé avec succès!\n${newEtudiant.prenom} ${newEtudiant.nom} - ${newEtudiant.matricule}`);
      },
      error: (err) => {
        this.error = 'Les données d\'un champ existe dans la base dte données';
        this.isSubmitting = false;
        console.error('Erreur création étudiant:', err);
        alert('❌ Impossible de créer l\'étudiant. Vérification des doublons');
      }
    });
  }

  resetForm(): void {
    this.etudiant = {
      nom: '',
      prenom: '',
      matricule: ''
    };
    this.error = '';
  }

  // Validation basique (champs non vides)
  isFormValid(): boolean {
    return this.etudiant.nom.trim().length > 0 &&
      this.etudiant.prenom.trim().length > 0 &&
      this.etudiant.matricule.trim().length > 0;
  }

  // Validation avec regex
  isFormDataValid(): boolean {
    // Regex pour noms et prénoms (lettres, espaces, tirets, apostrophes)
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;

    // Regex pour matricule (lettres majuscules et chiffres)
    const matriculeRegex = /^[A-Z0-9]+$/;

    const isNomValid = nameRegex.test(this.etudiant.nom.trim());
    const isPrenomValid = nameRegex.test(this.etudiant.prenom.trim());
    const isMatriculeValid = matriculeRegex.test(this.etudiant.matricule.trim());

    // Messages d'erreur spécifiques
    if (!isNomValid) {
      this.error = 'Le nom contient des caractères non autorisés.';
      return false;
    }

    if (!isPrenomValid) {
      this.error = 'Le prénom contient des caractères non autorisés.';
      return false;
    }

    if (!isMatriculeValid) {
      this.error = 'Le matricule contient des caractères non autorisés.';
      return false;
    }

    return true;
  }

  // Méthodes de vérification des caractères (laissées vides)
  verifierCaractere(event: KeyboardEvent): void {
    // Laissé vide pour permettre toute saisie
    // La validation se fera au moment de l'enregistrement
  }

  verifierChiffres(event: KeyboardEvent): void {
    // Laissé vide pour permettre toute saisie
    // La validation se fera au moment de l'enregistrement
  }
}

// setx NODE_OPTIONS "--openssl-legacy-provider"
