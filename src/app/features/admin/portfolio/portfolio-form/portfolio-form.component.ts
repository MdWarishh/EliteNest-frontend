// src/app/features/admin/portfolio/portfolio-form/portfolio-form.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-portfolio-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './portfolio-form.component.html',
  styleUrls: ['./portfolio-form.component.scss']
})
export class PortfolioFormComponent implements OnInit {
  isEdit    = signal(false);
  loading   = signal(false);
  saving    = signal(false);
  error     = signal('');
  categories = signal<any[]>([]);

  // Image upload
  thumbnailFile: File | null = null;
  thumbnailPreview = signal('');
  existingThumbnail = signal('');

  galleryFiles: File[] = [];
  galleryPreviews = signal<string[]>([]);
  existingImages = signal<any[]>([]);

  form = {
    title: '', category: '', tags: '',
    shortDescription: '',
    projectDetails: {
      location: '', area: '', duration: '',
      year: new Date().getFullYear(), style: '', budget: ''
    },
    isFeatured: false, isActive: true,
  };

  private id: string | null = null;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.api.get<any>('/categories').subscribe(res => this.categories.set(res.data ?? []));
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit.set(true);
      this.loading.set(true);
      this.api.get<any>(`/portfolio/${this.id}`).subscribe({
        next: (res) => {
          const p = res.data;
          if (p) {
            this.form.title    = p.title;
            this.form.category = p.category?._id ?? '';
            this.form.tags     = p.tags?.join(', ') ?? '';
            this.form.shortDescription = p.shortDescription ?? '';
            this.form.isFeatured = p.isFeatured;
            this.form.isActive   = p.isActive;
            this.form.projectDetails = { ...this.form.projectDetails, ...p.projectDetails };
            if (p.thumbnail?.url) this.existingThumbnail.set(p.thumbnail.url);
            if (p.images?.length) this.existingImages.set(p.images);
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  onThumbnailSelect(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.thumbnailFile = file;
    const reader = new FileReader();
    reader.onload = () => this.thumbnailPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  onGallerySelect(e: Event) {
    const files = Array.from((e.target as HTMLInputElement).files ?? []);
    this.galleryFiles = [...this.galleryFiles, ...files];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.galleryPreviews.update(p => [...p, reader.result as string]);
      reader.readAsDataURL(file);
    });
  }

  removeGalleryFile(index: number) {
    this.galleryFiles.splice(index, 1);
    this.galleryPreviews.update(p => p.filter((_, i) => i !== index));
  }

  onSubmit() {
    if (!this.form.title || !this.form.category) {
      this.error.set('Title and Category are required');
      return;
    }
    this.error.set('');
    this.saving.set(true);

    const fd = new FormData();
    fd.append('title',            this.form.title);
    fd.append('category',         this.form.category);
    fd.append('shortDescription', this.form.shortDescription);
    fd.append('isFeatured',       String(this.form.isFeatured));
    fd.append('isActive',         String(this.form.isActive));
    fd.append('tags',             JSON.stringify(
      this.form.tags.split(',').map(t => t.trim()).filter(Boolean)
    ));
    fd.append('projectDetails', JSON.stringify(this.form.projectDetails));

    if (this.thumbnailFile) fd.append('thumbnail', this.thumbnailFile);
    this.galleryFiles.forEach(f => fd.append('images', f));

    const req = this.isEdit()
      ? this.api.putForm<any>(`/portfolio/${this.id}`, fd)
      : this.api.postForm<any>('/portfolio', fd);

    req.subscribe({
      next: () => this.router.navigate(['/admin/portfolio']),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Something went wrong');
        this.saving.set(false);
      }
    });
  }
}
