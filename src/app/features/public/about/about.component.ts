// src/app/features/public/about/about.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  team      = signal<any[]>([]);
  aboutData = signal<any>(null);

  values = [
    { icon: '◈', title: 'Craftsmanship', desc: 'Every detail matters. We obsess over quality in materials, finishes, and execution.' },
    { icon: '◉', title: 'Client-First',  desc: 'Your vision is our brief. We listen deeply before we design.' },
    { icon: '◇', title: 'Innovation',    desc: 'Blending timeless design principles with contemporary trends and technology.' },
    { icon: '✦', title: 'Integrity',     desc: 'Transparent pricing, honest timelines, and zero compromise on quality.' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    // About page content (hero image + story image + text)
    this.api.get<any>('/about').subscribe({
      next: r => this.aboutData.set(r.data ?? {})
    });

    // Team members
    this.api.get<any>('/team', { isActive: 'true' }).subscribe({
      next: r => this.team.set(r.data ?? [])
    });
  }
}