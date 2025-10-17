import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { EtudiantListComponent } from './components/etudiants/etudiant-list/etudiant-list.component';
import { EtudiantFormComponent } from './components/etudiants/etudiant-form/etudiant-form.component';
import { EtudiantDetailsComponent } from './components/etudiants/etudiant-details/etudiant-details.component';
import { PaiementListComponent } from './components/paiements/paiement-list/paiement-list.component';
import { PaiementFormComponent } from './components/paiements/paiement-form/paiement-form.component';
import { PaiementDetailsComponent } from './components/paiements/paiement-details/paiement-details.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { LoadingSpinnerComponent } from './components/shared/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from './components/shared/error-message/error-message.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EtudiantsPageComponent } from './pages/etudiants-page/etudiants-page.component';
import { PaiementsPageComponent } from './pages/paiements-page/paiements-page.component';

// ✅ COMPOSANTS AUTHENTIFICATION AJOUTÉS
import { LoginComponent } from './components/login/login.component';

// Services
import { EtudiantService } from './services/etudiant.service';
import { PaiementService } from './services/paiement.service';

// ✅ SERVICES AUTHENTIFICATION AJOUTÉS
import { AuthService } from './services/auth.service';

// ✅ GUARDS AJOUTÉS
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    EtudiantListComponent,
    EtudiantFormComponent,
    EtudiantDetailsComponent,
    PaiementListComponent,
    PaiementFormComponent,
    PaiementDetailsComponent,
    HeaderComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    DashboardComponent,
    EtudiantsPageComponent,
    PaiementsPageComponent,
    LoginComponent // ✅ AJOUT - Composant de connexion
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    EtudiantService,
    PaiementService,
    AuthService, // ✅ AJOUT - Service d'authentification
    AuthGuard // ✅ AJOUT - Garde de route
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }