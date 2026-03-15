// src/app/features/admin/contacts/contacts.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-contacts', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html', styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  items    = signal<any[]>([]);
  loading  = signal(true);
  selected = signal<any | null>(null);
  statuses = ['new', 'read', 'replied', 'converted'];

  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.api.get<any>('/contact').subscribe({
      next: r => { this.items.set(r.data ?? []); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  select(item: any) {
    this.selected.set(item);
    if (item.status === 'new') this.updateStatus(item._id, 'read');
  }

  updateStatus(id: string, status: string) {
    this.api.put<any>(`/contact/${id}/status`, { status }).subscribe(() => this.load());
  }

  statusColor(s: string) {
    const map: Record<string, string> = { new: 'badge--warning', read: 'badge--info', replied: 'badge--success', converted: 'badge--gold' };
    return map[s] ?? 'badge--info';
  }

  get newCount() { return this.items().filter(i => i.status === 'new').length; }
}