import { environment } from '../../environments/environment';

// Configuration centrale pour l'API
export class ApiConfig {
    // URL de base de notre API Spring Boot
    public static readonly BASE_URL = environment.apiUrl;

    // URLs pour les étudiants
    public static readonly ETUDIANTS_URL = `${ApiConfig.BASE_URL}/etudiants`;
    public static readonly PAIEMENTS_URL = `${ApiConfig.BASE_URL}/paiements`;

    // Identifiants pour l'authentification
    public static readonly AUTH_CREDENTIALS = {
        username: 'admin',
        password: 'admin123'
    };
}