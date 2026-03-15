// src/app/features/admin/blogs/blog-list/blog-list.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

export interface Blog {
  _id: string; title: string; slug: string;
  author: string; category: string;
  isPublished: boolean; isFeatured: boolean;
  viewCount: number; readTime: number;
  createdAt: string;
  featuredImage?: { url: string };
}

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ConfirmModalComponent],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  items    = signal<Blog[]>([]);
  loading  = signal(true);
  total    = signal(0);
  page     = signal(1);
  deleteId = signal<string | null>(null);
  deleting = signal(false);
  limit    = 10;

  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.api.get<any>('/blogs', { page: String(this.page()), limit: String(this.limit) }).subscribe({
      next: (res) => { this.items.set(res.data ?? []); this.total.set(res.total ?? 0); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  confirmDelete(id: string) { this.deleteId.set(id); }
  cancelDelete()             { this.deleteId.set(null); }

  doDelete() {
    if (!this.deleteId()) return;
    this.deleting.set(true);
    this.api.delete<any>(`/blogs/${this.deleteId()}`).subscribe({
      next: () => { this.deleting.set(false); this.deleteId.set(null); this.load(); },
      error: () => this.deleting.set(false)
    });
  }

  get totalPages() { return Math.ceil(this.total() / this.limit); }
  prevPage() { if (this.page() > 1) { this.page.update(p => p - 1); this.load(); } }
  nextPage() { if (this.page() < this.totalPages) { this.page.update(p => p + 1); this.load(); } }
}