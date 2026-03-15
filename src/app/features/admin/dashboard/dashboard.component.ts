// src/app/features/admin/dashboard/dashboard.component.ts

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { forkJoin } from 'rxjs';

interface DashboardStats {
  portfolios: number;
  categories: number;
  contacts:   number;
  blogs:      number;
  services:   number;
  team:       number;
}

interface StatCard {
  label:    string;
  value:    number;
  icon:     string;
  route:    string;
  color:    string;
  change?:  string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats   = signal<DashboardStats | null>(null);
  loading = signal(true);

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit(): void {
    forkJoin({
      portfolio:    this.api.get<any>('/portfolio/admin/all?limit=1'),
      categories:   this.api.get<any>('/categories/admin/all'),
      contacts:     this.api.get<any>('/contact'),
      blogs:        this.api.get<any>('/blogs?limit=1'),
    }).subscribe({
      next: (res) => {
        this.stats.set({
          portfolios: res.portfolio?.total ?? 0,
          categories: res.categories?.data?.length ?? 0,
          contacts:   res.contacts?.total ?? 0,
          blogs:      res.blogs?.total ?? 0,
          services:   0,
          team:       0,
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Morning';
    if (h < 17) return 'Afternoon';
    return 'Evening';
  }

  get statCards(): StatCard[] {
    const s = this.stats();
    return [
      { label: 'Portfolio Items', value: s?.portfolios ?? 0, icon: '◈', route: '/admin/portfolio',    color: 'gold' },
      { label: 'Categories',      value: s?.categories ?? 0, icon: '⊞', route: '/admin/categories',   color: 'info' },
      { label: 'Contacts',        value: s?.contacts ?? 0,   icon: '◌', route: '/admin/contacts',     color: 'warning' },
      { label: 'Blog Posts',      value: s?.blogs ?? 0,      icon: '◉', route: '/admin/blogs',        color: 'success' },
    ];
  }

  get quickLinks() {
    return [
      { label: 'New Portfolio',  icon: '◈', route: '/admin/portfolio/new',    desc: 'Add a project' },
      { label: 'New Blog Post',  icon: '◉', route: '/admin/blogs/new',        desc: 'Write an article' },
      { label: 'View Contacts',  icon: '◌', route: '/admin/contacts',         desc: 'Check messages' },
      { label: 'Edit Home Page', icon: '⬕', route: '/admin/home-manager',     desc: 'Update hero section' },
    ];
  }
}