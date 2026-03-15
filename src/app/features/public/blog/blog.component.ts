import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({ selector: 'app-blog', standalone: true, imports: [CommonModule, RouterModule],
  templateUrl: './blog.component.html', styleUrls: ['./blog.component.scss'] })
export class BlogComponent implements OnInit {
  blogs = signal<any[]>([]);
  loading = signal(true);
  total = signal(0);
  page = signal(1);
  pages = signal(1);
  activeCategory = signal('');

  categories = ['All', 'Design Tips', 'Trends', 'Project Stories', 'AI & Technology', 'Lifestyle'];

  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    const params: any = { page: String(this.page()), limit: '9' };
    if (this.activeCategory() && this.activeCategory() !== 'All') params.category = this.activeCategory();
    this.api.get<any>('/blogs', params).subscribe({
      next: r => { this.blogs.set(r.data ?? []); this.total.set(r.total ?? 0); this.pages.set(r.pages ?? 1); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  setCategory(cat: string) { this.activeCategory.set(cat === 'All' ? '' : cat); this.page.set(1); this.load(); }
  goPage(p: number) { if (p < 1 || p > this.pages()) return; this.page.set(p); this.load(); window.scrollTo(0,0); }
  getPageNumbers() { return Array.from({length: this.pages()}, (_, i) => i + 1); }
}
