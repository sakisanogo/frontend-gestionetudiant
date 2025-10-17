import { Component, OnInit } from '@angular/core';
import { Etudiant } from '../../../models/etudiant.model';
import { EtudiantService } from '../../../services/etudiant.service';

@Component({
  selector: 'app-etudiant-list',
  templateUrl: './etudiant-list.component.html',
  styleUrls: ['./etudiant-list.component.scss']
})
export class EtudiantListComponent implements OnInit {
  etudiants: Etudiant[] = [];
  selectedEtudiant: Etudiant | null = null;
  loading = false;
  error = '';

  constructor(private etudiantService: EtudiantService) { }

  ngOnInit(): void {
    this.loadEtudiants();
  }

  loadEtudiants(): void {
    this.loading = true;
    this.error = '';

    this.etudiantService.getAllEtudiants().subscribe({
      next: (data) => {
        this.etudiants = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des étudiants';
        this.loading = false;
        console.error('Erreur API:', err);
      }
    });
  }

  deleteEtudiant(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      this.etudiantService.deleteEtudiant(id).subscribe({
        next: () => {
          this.etudiants = this.etudiants.filter(e => e.id !== id);
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
          alert('Erreur lors de la suppression de l\'étudiant');
        }
      });
    }
  }

  viewDetail(etudiant: Etudiant): void {
    this.selectedEtudiant = etudiant;
  }

  refresh(): void {
    this.loadEtudiants();
  }
}