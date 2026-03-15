// src/app/features/public/layout/navbar/navbar.component.ts
import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  scrolled  = signal(false);
  menuOpen  = signal(false);

  navLinks = [
    { label: 'Home',      route: '/' },
    { label: 'Portfolio', route: '/portfolio' },
    { label: 'Services',  route: '/services' },
    { label: 'Blog',      route: '/blog' },
    { label: 'AI Studio', route: '/ai' },
    { label: 'About',     route: '/about' },
    { label: 'Contact',   route: '/contact' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 60);
  }

  toggleMenu() { this.menuOpen.update(v => !v); }
  closeMenu()  { this.menuOpen.set(false); }
}
