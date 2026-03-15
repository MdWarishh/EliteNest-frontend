// src/app/features/public/public.routes.ts
import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout.component';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'portfolio',
        loadComponent: () =>
          import('./portfolio/portfolio.component').then(
            (m) => m.PortfolioComponent,
          ),
      },
      {
        path: 'portfolio/:id',
        loadComponent: () =>
          import('./portfolio-detail/portfolio-detail.component').then(
            (m) => m.PortfolioDetailComponent,
          ),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./services/services.component').then(
            (m) => m.ServicesComponent,
          ),
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./blog/blog.component').then((m) => m.BlogComponent),
      },
      {
        path: 'blog/:slug',
        loadComponent: () =>
          import('./blog/blog-detail.component').then(
            (m) => m.BlogDetailComponent,
          ),
      },
      {
        path: 'ai',
        loadComponent: () =>
          import('./ai/ai.component').then((m) => m.AiComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./contact/contact.component').then((m) => m.ContactComponent),
      },
    ],
  },
];
