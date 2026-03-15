import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({ selector: 'app-services', standalone: true, imports: [CommonModule, RouterModule],
  templateUrl: './services.component.html', styleUrls: ['./services.component.scss'] })
export class ServicesComponent implements OnInit {
  services = signal<any[]>([]);
  loading  = signal(true);

  process = [
    { num: '01', title: 'Consultation',   desc: 'We listen to your vision, understand your lifestyle and assess your space in detail.' },
    { num: '02', title: 'Concept Design', desc: 'Mood boards, detailed layouts and 3D visualisations tailored to your personality.' },
    { num: '03', title: 'Execution',      desc: 'Skilled craftsmen bring the design to life with precision, using premium materials.' },
    { num: '04', title: 'Handover',       desc: 'Final walkthrough, styling, accessorising — every detail perfectly in place.' },
  ];

  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.get<any>('/services').subscribe({
      next: r => { this.services.set((r.data ?? []).filter((s:any) => s.isActive !== false)); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
