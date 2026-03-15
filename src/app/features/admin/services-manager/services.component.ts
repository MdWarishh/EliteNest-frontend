// src/app/features/admin/services-manager/services.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-services', standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './services.component.html', styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  items    = signal<any[]>([]);
  loading  = signal(true);
  saving   = signal(false);
  deleteId = signal<string | null>(null);
  deleting = signal(false);
  showForm = signal(false);
  editItem = signal<any | null>(null);
  error    = signal('');
  form = { title: '', shortDescription: '', description: '', icon: '', features: '', isActive: true, isFeatured: false, sortOrder: 0 };

  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.api.get<any>('/services').subscribe({
      next: r => { this.items.set(r.data ?? []); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openCreate() {
    this.form = { title: '', shortDescription: '', description: '', icon: '', features: '', isActive: true, isFeatured: false, sortOrder: 0 };
    this.editItem.set(null); this.showForm.set(true);
  }

  openEdit(i: any) {
    this.form = { title: i.title, shortDescription: i.shortDescription ?? '', description: i.description ?? '', icon: i.icon ?? '', features: i.features?.join(', ') ?? '', isActive: i.isActive, isFeatured: i.isFeatured, sortOrder: i.sortOrder ?? 0 };
    this.editItem.set(i); this.showForm.set(true);
  }

  onSubmit() {
    if (!this.form.title) { this.error.set('Title is required'); return; }
    this.error.set(''); this.saving.set(true);
    const payload = { ...this.form, features: this.form.features.split(',').map((f: string) => f.trim()).filter(Boolean) };
    const req = this.editItem()
      ? this.api.put<any>(`/services/${this.editItem()._id}`, payload)
      : this.api.post<any>('/services', payload);
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
    this.api.delete<any>(`/services/${this.deleteId()}`).subscribe({
      next: () => { this.deleting.set(false); this.deleteId.set(null); this.load(); },
      error: () => this.deleting.set(false)
    });
  }
}