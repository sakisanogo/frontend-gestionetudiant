import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AuthRequest } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    credentials: AuthRequest = {
        username: '',
        password: ''
    };
    loading = false;
    errorMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onSubmit(): void {
        this.loading = true;
        this.errorMessage = '';

        this.authService.login(this.credentials).subscribe({
            next: () => {
                console.log('✅ Connexion réussie');
                this.router.navigate(['/dashboard']);
            },
            error: (error) => {
                console.error('❌ Erreur de connexion:', error);
                this.errorMessage = this.getErrorMessage(error);
                this.loading = false;
            }
        });
    }

    // Méthode alternative si la première échoue
    onAlternativeLogin(): void {
        this.loading = true;
        this.errorMessage = '';

        this.authService.loginAlternative(this.credentials).subscribe({
            next: () => {
                console.log('✅ Connexion réussie (méthode alternative)');
                this.router.navigate(['/dashboard']);
            },
            error: (error) => {
                console.error('❌ Erreur de connexion alternative:', error);
                this.errorMessage = this.getErrorMessage(error);
                this.loading = false;
            }
        });
    }

    // Message d'erreur personnalisé selon le type d'erreur
    private getErrorMessage(error: any): string {
        if (error.status === 0) {
            return 'Erreur de connexion au serveur. Vérifiez que le serveur est démarré.';
        } else if (error.status === 401) {
            return 'Identifiants incorrects. Veuillez réessayer.';
        } else if (error.status === 404) {
            return 'Endpoint non trouvé. Utilisez la méthode alternative.';
        } else {
            return 'Erreur de connexion. Veuillez réessayer.';
        }
    }

    // Remplir avec des identifiants de test (facultatif)
    fillTestCredentials(role: 'admin' | 'user'): void {
        if (role === 'admin') {
            this.credentials = { username: 'admin', password: 'admin123' };
        } else {
            this.credentials = { username: 'user', password: 'user123' };
        }
    }
}