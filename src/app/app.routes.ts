// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public website
  {
    path: '',
    loadChildren: () =>
      import('./features/public/public.routes').then(m => m.PUBLIC_ROUTES),
  },

  // Auth (guest only)
  {
    path: 'admin/login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },

  // Admin (protected)
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'portfolio',
        loadChildren: () =>
          import('./features/admin/portfolio/portfolio.routes').then(m => m.PORTFOLIO_ROUTES),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/admin/categories/categories.component').then(m => m.CategoriesComponent),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./features/admin/services-manager/services.component').then(m => m.ServicesComponent),
      },
      {
        path: 'blogs',
        loadChildren: () =>
          import('./features/admin/blogs/blogs.routes').then(m => m.BLOG_ROUTES),
      },
      {
        path: 'team',
        loadComponent: () =>
          import('./features/admin/team/team.component').then(m => m.TeamComponent),
      },
      {
        path: 'testimonials',
        loadComponent: () =>
          import('./features/admin/testimonials/testimonials.component').then(m => m.TestimonialsComponent),
      },
      {
        path: 'contacts',
        loadComponent: () =>
          import('./features/admin/contacts/contacts.component').then(m => m.ContactsComponent),
      },
      {
        path: 'home-manager',
        loadComponent: () =>
          import('./features/admin/home-manager/home-manager.component').then(m => m.HomeManagerComponent),
      },
      {
        path: 'about-manager',
        loadComponent: () =>
          import('./features/admin/about-manager/about-manager.component').then(m => m.AboutManagerComponent),
      },
      {
        path: 'theme',
        loadComponent: () =>
          import('./features/admin/theme-customizer/theme-customizer.component').then(m => m.ThemeCustomizerComponent),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
