// src/app/features/admin/layout/admin-layout.component.ts

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AdminSidebarComponent } from './sidebar/sidebar.component';
import { AdminTopbarComponent } from './topbar/topbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminSidebarComponent, AdminTopbarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  sidebarCollapsed = signal(false);

  constructor(public auth: AuthService) {}

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }
}