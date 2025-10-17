import { Component } from '@angular/core';
import { CreateEtudiantRequest } from '../../models/etudiant.model';

@Component({
  selector: 'app-etudiants-page',
  templateUrl: './etudiants-page.component.html',
  styleUrls: ['./etudiants-page.component.scss']
})
export class EtudiantsPageComponent {
  title = 'Gestion des Étudiants';

  constructor() { }

  onEtudiantCreated(newEtudiant: CreateEtudiantRequest): void {
    console.log('Nouvel étudiant créé:', newEtudiant);
    // La liste se rafraîchit automatiquement via le service
  }
}