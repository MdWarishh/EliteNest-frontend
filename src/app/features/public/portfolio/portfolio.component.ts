// src/app/features/public/portfolio/portfolio.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  items      = signal<any[]>([]);
  categories = signal<any[]>([]);
  loading    = signal(true);
  total      = signal(0);
  page       = signal(1);
  activeCategory = signal('');
  limit = 9;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<any>('/categories').subscribe(r => this.categories.set(r.data ?? []));
    this.load();
  }

  load() {
    this.loading.set(true);
    const params: Record<string, string> = {
      page: String(this.page()),
      limit: String(this.limit),
      isActive: 'true',
      ...(this.activeCategory() && { category: this.activeCategory() })
    };
    this.api.get<any>('/portfolio', params).subscribe({
      next: (r: any) => {
        this.items.set(r.data ?? []);
        this.total.set(r.total ?? 0);
        this.loading.set(false);
        console.log('Items:', r.data); // debug - baad mein hata dena
      },
      error: () => this.loading.set(false)
    });
  }

  filterBy(catId: string) { this.activeCategory.set(catId); this.page.set(1); this.load(); }
  get totalPages() { return Math.ceil(this.total() / this.limit); }
  prevPage() { if (this.page() > 1) { this.page.update(p => p - 1); this.load(); } }
  nextPage() { if (this.page() < this.totalPages) { this.page.update(p => p + 1); this.load(); } }
}