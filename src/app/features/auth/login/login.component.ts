// src/app/features/auth/login/login.component.ts

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  year = new Date().getFullYear();
  email    = '';
  password = '';
  error    = signal('');
  loading  = signal(false);
  showPass = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error.set('Please enter email and password');
      return;
    }

    this.error.set('');
    this.loading.set(true);

    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: (err) => {
        this.error.set(err?.error?.message || 'Invalid credentials');
        this.loading.set(false);
      }
    });
  }
}