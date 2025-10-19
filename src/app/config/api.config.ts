import { environment } from '../../environments/environment';

// Configuration centrale pour l'API
export class ApiConfig {
    // URL de base de notre API Spring Boot
    public static readonly BASE_URL = environment.apiUrl;

    // URLs pour l'authentification
    public static readonly AUTH_REGISTER = `${ApiConfig.BASE_URL}/auth/register`;
    public static readonly AUTH_LOGIN = `${ApiConfig.BASE_URL}/login`;
    public static readonly AUTH_LOGOUT = `${ApiConfig.BASE_URL}/logout`;

    // URLs pour les étudiants
    public static readonly ETUDIANTS_URL = `${ApiConfig.BASE_URL}/api/etudiants`;
    public static readonly PAIEMENTS_URL = `${ApiConfig.BASE_URL}/api/paiements`;

    // ✅ SUPPRIMER AUTH_CREDENTIALS - Plus nécessaire
}