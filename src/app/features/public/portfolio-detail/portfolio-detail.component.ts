import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({ selector: 'app-portfolio-detail', standalone: true, imports: [CommonModule, RouterModule],
  templateUrl: './portfolio-detail.component.html', styleUrls: ['./portfolio-detail.component.scss'] })
export class PortfolioDetailComponent implements OnInit {
  project  = signal<any>(null);
  loading  = signal(true);
  lightbox = signal<string>('');
  activeImg = signal(0);

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('id')!; // route param naam 'id' hi hai
    this.api.get<any>(`/portfolio/${slug}`).subscribe({
      next: r => { this.project.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openLightbox(url: string) { this.lightbox.set(url); document.body.style.overflow = 'hidden'; }
  closeLightbox() { this.lightbox.set(''); document.body.style.overflow = ''; }
  allImages() {
    const p = this.project();
    if (!p) return [];
    const imgs: string[] = [];
    if (p.thumbnail?.url) imgs.push(p.thumbnail.url);
    (p.images ?? []).forEach((i: any) => imgs.push(i.url));
    return imgs;
  }
}