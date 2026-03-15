// src/app/features/admin/portfolio/portfolio-list/portfolio-list.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

export interface Portfolio {
  _id: string;
  title: string;
  slug: string;
  category?: { name: string };
  thumbnail?: { url: string };
  isFeatured: boolean;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  projectDetails?: { style?: string; year?: number };
}

@Component({
  selector: 'app-portfolio-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ConfirmModalComponent],
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.scss']
})
export class PortfolioListComponent implements OnInit {
  items       = signal<Portfolio[]>([]);
  loading     = signal(true);
  total       = signal(0);
  page        = signal(1);
  search      = '';
  deleteId    = signal<string | null>(null);
  deleting    = signal(false);
  limit       = 10;

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    const params: Record<string, string> = {
      page: String(this.page()),
      limit: String(this.limit),
      ...(this.search && { search: this.search })
    };
    this.api.get<any>('/portfolio/admin/all', params).subscribe({
      next: (res) => {
        this.items.set(res.data ?? []);
        this.total.set(res.total ?? 0);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch() { this.page.set(1); this.load(); }

  toggleFeatured(id: string) {
    this.api.patch<any>(`/portfolio/${id}/toggle-featured`).subscribe(() => this.load());
  }

  confirmDelete(id: string) { this.deleteId.set(id); }
  cancelDelete()            { this.deleteId.set(null); }

  doDelete() {
    if (!this.deleteId()) return;
    this.deleting.set(true);
    this.api.delete<any>(`/portfolio/${this.deleteId()}`).subscribe({
      next: () => {
        this.deleting.set(false);
        this.deleteId.set(null);
        this.load();
      },
      error: () => this.deleting.set(false)
    });
  }

  get totalPages() { return Math.ceil(this.total() / this.limit); }
  prevPage() { if (this.page() > 1) { this.page.update(p => p - 1); this.load(); } }
  nextPage() { if (this.page() < this.totalPages) { this.page.update(p => p + 1); this.load(); } }
}