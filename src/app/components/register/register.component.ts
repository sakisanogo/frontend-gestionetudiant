import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    registerForm: FormGroup;
    loading = false;
    errorMessage = '';
    successMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        });
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            // Vérifier que les mots de passe correspondent
            if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
                this.errorMessage = 'Les mots de passe ne correspondent pas';
                return;
            }

            this.loading = true;
            this.errorMessage = '';
            this.successMessage = '';

            const registerData: RegisterRequest = {
                username: this.registerForm.value.username,
                password: this.registerForm.value.password
            };

            this.authService.register(registerData).subscribe({
                next: (response) => {
                    this.loading = false;
                    this.successMessage = `Compte créé avec succès ! Bienvenue ${response.username}`;
                    this.registerForm.reset();

                    // Redirection automatique après 2 secondes
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 2000);
                },
                error: (error) => {
                    this.loading = false;
                    this.errorMessage = error.error?.message || 'Erreur lors de l\'inscription. Le nom d\'utilisateur est peut-être déjà utilisé.';
                    console.error('❌ Erreur inscription:', error);
                }
            });
        }
    }
}