import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./Pages/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'login', loadComponent: () => import('./Pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./Pages/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'home', canActivate: [authGuard], loadComponent: () => import('./Pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./Pages/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'profile/:id', canActivate: [authGuard], loadComponent: () => import('./Pages/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'map', canActivate: [authGuard], loadComponent: () => import('./Pages/map/map.component').then(m => m.MapComponent) },
  { path: 'messages/:chatId', canActivate: [authGuard], loadComponent: () => import('./Pages/messages/messages.component').then(m => m.MessagesComponent) },
  { path: 'inbox', canActivate: [authGuard], loadComponent: () => import('./Pages/new-message/new-message.component').then(m => m.NewMessageComponent) },
  { path: 'questions', canActivate: [authGuard], loadComponent: () => import('./Pages/questions/questions.component').then(m => m.QuestionsComponent) },
  { path: 'request-stay/:localId', canActivate: [authGuard], loadComponent: () => import('./Pages/traveler/request-stay/request-stay.component').then(m => m.RequestStayComponent) },
  { path: 'my-requests', canActivate: [authGuard], loadComponent: () => import('./Pages/traveler/my-stay-requests/my-stay-requests.component').then(m => m.MyStayRequestsComponent) },
  { path: 'local-requests', canActivate: [authGuard], loadComponent: () => import('./Pages/traveler/local-requests/local-requests.component').then(m => m.LocalRequestsComponent) },
  { path: 'locals', canActivate: [authGuard], loadComponent: () => import('./Pages/locals/locals-list/locals-list.component').then(m => m.LocalsListComponent) },
  { path: 'verification', canActivate: [authGuard], loadComponent: () => import('./Pages/verification/verification.component').then(m => m.VerificationComponent) },
  { path: 'admin', canActivate: [authGuard, adminGuard], loadComponent: () => import('./Pages/admin/admin.component').then(m => m.AdminComponent) },
  { path: '**', redirectTo: '' }
];
