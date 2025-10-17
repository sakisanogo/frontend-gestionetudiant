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
    if (this.isFormValid()) {
      this.isSubmitting = true;
      this.error = '';

      this.etudiantService.createEtudiant(this.etudiant).subscribe({
        next: (newEtudiant) => {
          // ✅ Succès - étudiant créé dans la base de données
          this.etudiantCreated.emit(this.etudiant);
          this.resetForm();
          this.isSubmitting = false;
          this.showForm = false;

          // Message de succès
          alert(`✅ Étudiant créé avec succès!\n${newEtudiant.prenom} ${newEtudiant.nom} - ${newEtudiant.matricule}`);
        },
        error: (err) => {
          // ❌ Erreur - backend non accessible
          this.error = 'Erreur: Le serveur backend n\'est pas accessible';
          this.isSubmitting = false;
          console.error('Erreur création étudiant:', err);

          // Message d'erreur clair
          alert('❌ Impossible de créer l\'étudiant. Vérifiez que le serveur Spring Boot est démarré sur le port 8082.');
        }
      });
    }
  }

  resetForm(): void {
    this.etudiant = {
      nom: '',
      prenom: '',
      matricule: ''
    };
    this.error = '';
  }

  isFormValid(): boolean {
    return this.etudiant.nom.trim().length > 0 &&
      this.etudiant.prenom.trim().length > 0 &&
      this.etudiant.matricule.trim().length > 0;
  }
}