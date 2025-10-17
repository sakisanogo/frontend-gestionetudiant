// Interface pour les réponses de l'API
export interface ApiResponse<T> {
    data?: T;           // Les données retournées
    message?: string;   // Message d'information
    success: boolean;   // Si l'opération a réussi
}

// Interface pour les erreurs
export interface ErrorResponse {
    error: string;      // Type d'erreur
    message: string;    // Message d'erreur
    statusCode: number; // Code HTTP
}