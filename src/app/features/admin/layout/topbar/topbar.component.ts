// src/app/features/admin/layout/topbar/topbar.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AdminUser } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class AdminTopbarComponent {
  @Input() admin: AdminUser | null = null;
  @Output() toggleSidebar = new EventEmitter<void>();

  pageTitle$ = this.router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    map(() => this.getTitleFromUrl(this.router.url))
  );

  constructor(private router: Router) {}

  getTitleFromUrl(url: string): string {
    const segment = url.split('/').pop() || 'dashboard';
    const titles: Record<string, string> = {
      dashboard:    'Dashboard',
      portfolio:    'Portfolio',
      categories:   'Categories',
      services:     'Services',
      blogs:        'Blog Posts',
      team:         'Team',
      testimonials: 'Testimonials',
      contacts:     'Contacts',
      'home-manager': 'Home Manager',
    };
    return titles[segment] ?? 'EliteNest Admin';
  }

  get currentTitle(): string {
    return this.getTitleFromUrl(this.router.url);
  }

  get currentTime(): string {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'short', month: 'short', day: 'numeric'
    });
  }
}