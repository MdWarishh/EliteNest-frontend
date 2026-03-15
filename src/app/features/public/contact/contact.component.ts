// src/app/features/public/contact/contact.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  sending  = signal(false);
  sent     = signal(false);
  error    = signal('');

  projectTypes = ['Residential', 'Commercial', 'Modular Kitchen', 'Office', 'Retail', 'Other'];
  budgets      = ['Under ₹5 Lakhs', '₹5–10 Lakhs', '₹10–20 Lakhs', '₹20–50 Lakhs', '₹50 Lakhs+'];

  form = {
    name: '', email: '', phone: '',
    projectType: '', budget: '', location: '',
    message: '', source: 'Website Contact Form'
  };

  constructor(private api: ApiService) {}

  onSubmit() {
    if (!this.form.name || !this.form.email || !this.form.message) {
      this.error.set('Please fill in name, email and message.');
      return;
    }
    this.error.set('');
    this.sending.set(true);
    this.api.post<any>('/contact', this.form).subscribe({
      next: () => { this.sending.set(false); this.sent.set(true); },
      error: (e) => { this.error.set(e?.error?.message ?? 'Something went wrong. Please try again.'); this.sending.set(false); }
    });
  }
}
