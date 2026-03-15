// home.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

import { HeroComponent }                from './components/hero/hero.component';
import { StatsBarComponent }            from './components/stats-bar/stats-bar.component';
import { AboutTeaserComponent }         from './components/about-teaser/about-teaser.component';
import { ServicesSectionComponent }     from './components/services-section/services-section.component';
import { PortfolioSectionComponent }    from './components/portfolio-section/portfolio-section.component';
import { TestimonialsSectionComponent } from './components/testimonials-section/testimonials-section.component';
import { CtaBannerComponent }           from './components/cta-banner/cta-banner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    StatsBarComponent,
    AboutTeaserComponent,
    ServicesSectionComponent,
    PortfolioSectionComponent,
    TestimonialsSectionComponent,
    CtaBannerComponent
  ],
  templateUrl: './home.component.html',
  styleUrls  : ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  homeData     = signal<any>(null);
  portfolio    = signal<any[]>([]);
  services     = signal<any[]>([]);
  testimonials = signal<any[]>([]);

  private defaultStats = {
    projectsCompleted: 250,
    happyClients     : 200,
    yearsExperience  : 12,
    citiesCovered    : 8
  };

  get stats() {
    return this.homeData()?.stats ?? this.defaultStats;
  }

  // ── BUG FIX: hero ko alag signal mein nikalo ──────────
  // Pehle template mein homeData()?.hero pass ho raha tha
  // Problem: pehli render pe homeData() = null → hero child ko null milta
  // Phir data aata hai → homeData signal update hoti hai → Angular
  // homeData()?.hero = new object reference detect karta hai → ngOnChanges fire hota hai ✅
  // Ye actually theek hai — lekin ensure karo ki template mein
  // [heroData]="homeData()?.hero ?? null" likha ho, shorthand nahi

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<any>('/home').subscribe({
      next: r => this.homeData.set(r.data ?? {})
    });

    this.api.get<any>('/portfolio', { isFeatured: 'true', limit: '6' }).subscribe({
      next: r => this.portfolio.set(r.data ?? [])
    });

    this.api.get<any>('/services', { isActive: 'true', limit: '6' }).subscribe({
      next: r => this.services.set(r.data ?? [])
    });

    this.api.get<any>('/testimonials', { isActive: 'true', limit: '6' }).subscribe({
      next: r => this.testimonials.set(r.data ?? [])
    });
  }
}