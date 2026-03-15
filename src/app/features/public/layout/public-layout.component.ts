// src/app/features/public/layout/public-layout.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FooterComponent],
  template: `
    <div class="public-page">
      <app-navbar />
      <main>
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
  styles: [`
    main { min-height: 100vh; }
  `]
})
export class PublicLayoutComponent {}
