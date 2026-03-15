// src/app/features/admin/blogs/blogs.routes.ts

import { Routes } from '@angular/router';

export const BLOG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./blog-list/blog-list.component').then(m => m.BlogListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./blog-form/blog-form.component').then(m => m.BlogFormComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./blog-form/blog-form.component').then(m => m.BlogFormComponent),
  },
];