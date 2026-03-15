// src/app/features/admin/layout/sidebar/sidebar.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class AdminSidebarComponent {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  constructor(public auth: AuthService) {}

  navItems: NavItem[] = [
    { label: 'Dashboard',    icon: '⬡', route: '/admin/dashboard' },
    { label: 'Portfolio',    icon: '◈', route: '/admin/portfolio' },
    { label: 'Categories',   icon: '⊞', route: '/admin/categories' },
    { label: 'Services',     icon: '◇', route: '/admin/services' },
    { label: 'Blog',         icon: '◉', route: '/admin/blogs' },
    { label: 'Team',         icon: '◎', route: '/admin/team' },
    { label: 'Testimonials', icon: '❝', route: '/admin/testimonials' },
    { label: 'Contacts',     icon: '◌', route: '/admin/contacts' },
    { label: 'Home Manager', icon: '⬕', route: '/admin/home-manager' },
    { label: 'About Manager', icon: '⬕', route: '/admin/about-manager' },
    { label: 'Theme',         icon: '🎨', route: '/admin/theme' },
  ];
}
