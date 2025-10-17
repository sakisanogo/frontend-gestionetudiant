export interface Paiement {
    id?: number;
    montant: number;
    datePaiement: string;
    numeroRecu: string;
    motif: string;
    etudiantId: number;
    etudiantNom?: string;
    etudiantPrenom?: string;
    etudiantMatricule?: string;
}

export interface CreatePaiementRequest {
    montant: number;
    motif: string;
    etudiantId: number;
}