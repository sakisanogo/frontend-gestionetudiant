import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EtudiantsPageComponent } from './pages/etudiants-page/etudiants-page.component';
import { PaiementsPageComponent } from './pages/paiements-page/paiements-page.component';
import { LoginComponent } from '../app/components/login/login.component';
import { RegisterComponent } from '../app/components/register/register.component'; // ✅ AJOUT
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }, // Page de connexion publique
  { path: 'register', component: RegisterComponent }, // ✅ AJOUT - Page d'inscription publique
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard] // Protection par authentification
  },
  {
    path: 'etudiants',
    component: EtudiantsPageComponent,
    canActivate: [AuthGuard] // Protection par authentification
  },
  {
    path: 'paiements',
    component: PaiementsPageComponent,
    canActivate: [AuthGuard] // Protection par authentification
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }