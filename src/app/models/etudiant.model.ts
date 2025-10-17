export interface Etudiant {
    id?: number;
    nom: string;
    prenom: string;
    matricule: string;
}

export interface CreateEtudiantRequest {
    nom: string;
    prenom: string;
    matricule: string;
}