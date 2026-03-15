// src/app/features/admin/categories/categories.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  items    = signal<any[]>([]);
  loading  = signal(true);
  saving   = signal(false);
  deleteId = signal<string | null>(null);
  deleting = signal(false);
  showForm = signal(false);
  editItem = signal<any | null>(null);
  error    = signal('');

  form = { name: '', description: '', icon: '', sortOrder: 0, isActive: true };

  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.api.get<any>('/categories/admin/all').subscribe({
      next: (res) => { this.items.set(res.data ?? []); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openCreate() {
    this.form = { name: '', description: '', icon: '', sortOrder: 0, isActive: true };
    this.editItem.set(null);
    this.showForm.set(true);
  }

  openEdit(item: any) {
    this.form = { name: item.name, description: item.description ?? '', icon: item.icon ?? '', sortOrder: item.sortOrder ?? 0, isActive: item.isActive };
    this.editItem.set(item);
    this.showForm.set(true);
  }

  onSubmit() {
    if (!this.form.name) { this.error.set('Name is required'); return; }
    this.error.set('');
    this.saving.set(true);

    const fd = new FormData();
    Object.entries(this.form).forEach(([k, v]) => fd.append(k, String(v)));

    const req = this.editItem()
      ? this.api.putForm<any>(`/categories/${this.editItem()._id}`, fd)
      : this.api.postForm<any>('/categories', fd);

    req.subscribe({
      next: () => { this.saving.set(false); this.showForm.set(false); this.load(); },
      error: (err) => { this.error.set(err?.error?.message ?? 'Error'); this.saving.set(false); }
    });
  }

  confirmDelete(id: string) { this.deleteId.set(id); }
  cancelDelete()             { this.deleteId.set(null); }
  doDelete() {
    if (!this.deleteId()) return;
    this.deleting.set(true);
    this.api.delete<any>(`/categories/${this.deleteId()}`).subscribe({
      next: () => { this.deleting.set(false); this.deleteId.set(null); this.load(); },
      error: () => this.deleting.set(false)
    });
  }
}