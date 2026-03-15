// src/app/features/admin/portfolio/portfolio.routes.ts

import { Routes } from '@angular/router';

export const PORTFOLIO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./portfolio-list/portfolio-list.component').then(m => m.PortfolioListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./portfolio-form/portfolio-form.component').then(m => m.PortfolioFormComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./portfolio-form/portfolio-form.component').then(m => m.PortfolioFormComponent),
  },
];