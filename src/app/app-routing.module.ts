import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EtudiantsPageComponent } from './pages/etudiants-page/etudiants-page.component';
import { PaiementsPageComponent } from './pages/paiements-page/paiements-page.component';
import { LoginComponent } from '../app/components/login/login.component'; // ✅ AJOUT
import { AuthGuard } from './guards/auth.guard'; // ✅ AJOUT

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }, // ✅ AJOUT - Page de connexion publique
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard] // ✅ AJOUT - Protection par authentification
  },
  {
    path: 'etudiants',
    component: EtudiantsPageComponent,
    canActivate: [AuthGuard] // ✅ AJOUT - Protection par authentification
  },
  {
    path: 'paiements',
    component: PaiementsPageComponent,
    canActivate: [AuthGuard] // ✅ AJOUT - Protection par authentification
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }