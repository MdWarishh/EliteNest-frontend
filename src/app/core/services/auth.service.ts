// src/app/core/services/auth.service.ts

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  admin: AdminUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'en_admin_token';
  private readonly USER_KEY  = 'en_admin_user';

  // Angular signals for reactive state
  private _admin = signal<AdminUser | null>(this.loadUser());
  private _loading = signal(false);

  readonly admin   = this._admin.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isLoggedIn = computed(() => !!this._admin());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    this._loading.set(true);
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap({
          next: (res) => {
            localStorage.setItem(this.TOKEN_KEY, res.token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(res.admin));
            this._admin.set(res.admin);
            this._loading.set(false);
          },
          error: () => this._loading.set(false),
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._admin.set(null);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private loadUser(): AdminUser | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}