// src/app/features/admin/about-manager/about-manager.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector   : 'app-about-manager',
  standalone : true,
  imports    : [CommonModule, FormsModule],
  templateUrl: './about-manager.component.html',
  styleUrls  : ['./about-manager.component.scss']
})
export class AboutManagerComponent implements OnInit {

  loading = signal(true);
  saving  = signal(false);
  saved   = signal(false);
  error   = signal('');

  // Hero image
  heroFile    : File | null = null;
  heroPreview  = signal('');
  existingHero = signal('');

  // Story image
  storyFile    : File | null = null;
  storyPreview  = signal('');
  existingStory = signal('');

  form = {
    heroSubtitle  : '',
    storyHeading  : '',
    storyHeadingEm: '',
    storyPara1    : '',
    storyPara2    : '',
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<any>('/about').subscribe({
      next: r => {
        const d = r.data ?? {};
        this.form = {
          heroSubtitle  : d.heroSubtitle   ?? '',
          storyHeading  : d.storyHeading   ?? '',
          storyHeadingEm: d.storyHeadingEm ?? '',
          storyPara1    : d.storyPara1     ?? '',
          storyPara2    : d.storyPara2     ?? '',
        };
        if (d.heroImage?.url)  this.existingHero.set(d.heroImage.url);
        if (d.storyImage?.url) this.existingStory.set(d.storyImage.url);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  pickFile(type: 'hero' | 'story', e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'hero') {
        this.heroFile = f;
        this.heroPreview.set(reader.result as string);
      } else {
        this.storyFile = f;
        this.storyPreview.set(reader.result as string);
      }
    };
    reader.readAsDataURL(f);
    (e.target as HTMLInputElement).value = '';
  }

  onSave() {
    this.saving.set(true);
    this.error.set('');

    const fd = new FormData();
    fd.append('textFields', JSON.stringify(this.form));
    if (this.heroFile)  fd.append('heroImage',  this.heroFile);
    if (this.storyFile) fd.append('storyImage', this.storyFile);

    this.api.putForm<any>('/about', fd).subscribe({
      next: r => {
        const d = r.data;
        if (d?.heroImage?.url)  { this.existingHero.set(d.heroImage.url);   this.heroFile  = null; this.heroPreview.set('');  }
        if (d?.storyImage?.url) { this.existingStory.set(d.storyImage.url); this.storyFile = null; this.storyPreview.set(''); }
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 3000);
      },
      error: e => {
        this.error.set(e?.error?.message ?? 'Error saving');
        this.saving.set(false);
      }
    });
  }
}