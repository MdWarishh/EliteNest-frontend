// src/app/features/admin/testimonials/testimonials.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-testimonials', standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './testimonials.component.html', styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {
  items    = signal<any[]>([]);
  loading  = signal(true);
  saving   = signal(false);
  deleteId = signal<string | null>(null);
  deleting = signal(false);
  showForm = signal(false);
  editItem = signal<any | null>(null);
  error    = signal('');
  form = { clientName: '', clientDesignation: '', review: '', rating: 5, isActive: true, isFeatured: false };

  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.api.get<any>('/testimonials').subscribe({
      next: r => { this.items.set(r.data ?? []); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openCreate() {
    this.form = { clientName: '', clientDesignation: '', review: '', rating: 5, isActive: true, isFeatured: false };
    this.editItem.set(null); this.showForm.set(true);
  }

  openEdit(i: any) {
    this.form = { clientName: i.clientName, clientDesignation: i.clientDesignation ?? '', review: i.review, rating: i.rating, isActive: i.isActive, isFeatured: i.isFeatured };
    this.editItem.set(i); this.showForm.set(true);
  }

  onSubmit() {
    if (!this.form.clientName || !this.form.review) { this.error.set('Name and review are required'); return; }
    this.error.set(''); this.saving.set(true);
    const req = this.editItem()
      ? this.api.put<any>(`/testimonials/${this.editItem()._id}`, this.form)
      : this.api.post<any>('/testimonials', this.form);
    req.subscribe({
      next: () => { this.saving.set(false); this.showForm.set(false); this.load(); },
      error: (e) => { this.error.set(e?.error?.message ?? 'Error'); this.saving.set(false); }
    });
  }

  confirmDelete(id: string) { this.deleteId.set(id); }
  cancelDelete() { this.deleteId.set(null); }
  doDelete() {
    if (!this.deleteId()) return;
    this.deleting.set(true);
    this.api.delete<any>(`/testimonials/${this.deleteId()}`).subscribe({
      next: () => { this.deleting.set(false); this.deleteId.set(null); this.load(); },
      error: () => this.deleting.set(false)
    });
  }

  stars(n: number) { return Array(n).fill('★'); }
}