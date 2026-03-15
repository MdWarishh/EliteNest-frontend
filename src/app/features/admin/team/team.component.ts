// src/app/features/admin/team/team.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-team', standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './team.component.html', styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  items    = signal<any[]>([]);
  loading  = signal(true);
  saving   = signal(false);
  deleteId = signal<string | null>(null);
  deleting = signal(false);
  showForm = signal(false);
  editItem = signal<any | null>(null);
  error    = signal('');
  imageFile: File | null = null;
  imagePreview = signal('');

  form = { name: '', designation: '', bio: '', isActive: true, sortOrder: 0 };

  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.api.get<any>('/team').subscribe({
      next: r => { this.items.set(r.data ?? []); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openCreate() {
    this.form = { name: '', designation: '', bio: '', isActive: true, sortOrder: 0 };
    this.editItem.set(null); this.imagePreview.set(''); this.showForm.set(true);
  }

  openEdit(i: any) {
    this.form = { name: i.name, designation: i.designation, bio: i.bio ?? '', isActive: i.isActive, sortOrder: i.sortOrder ?? 0 };
    this.editItem.set(i); this.showForm.set(true);
  }

  onImageSelect(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    this.imageFile = f;
    const r = new FileReader();
    r.onload = () => this.imagePreview.set(r.result as string);
    r.readAsDataURL(f);
  }

  onSubmit() {
    if (!this.form.name) { this.error.set('Name is required'); return; }
    this.error.set(''); this.saving.set(true);
    const fd = new FormData();
    Object.entries(this.form).forEach(([k, v]) => fd.append(k, String(v)));
    if (this.imageFile) fd.append('avatar', this.imageFile);
    const req = this.editItem()
      ? this.api.putForm<any>(`/team/${this.editItem()._id}`, fd)
      : this.api.postForm<any>('/team', fd);
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
    this.api.delete<any>(`/team/${this.deleteId()}`).subscribe({
      next: () => { this.deleting.set(false); this.deleteId.set(null); this.load(); },
      error: () => this.deleting.set(false)
    });
  }
}