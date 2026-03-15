// src/app/features/admin/blogs/blog-form/blog-form.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-blog-form', standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.scss']
})
export class BlogFormComponent implements OnInit {
  isEdit   = signal(false);
  saving   = signal(false);
  loading  = signal(false);
  error    = signal('');

  // ⚠ These MUST match Blog model enum exactly
  categories = ['Design Tips', 'Trends', 'Project Stories', 'AI & Technology', 'Lifestyle'];

  form = {
    title: '', content: '', excerpt: '', author: '',
    category: 'Design Tips',   // default to valid enum
    tags: '',
    readTime: 5,
    isPublished: false, isFeatured: false,
  };

  imageFile: File | null = null;
  imagePreview = signal('');
  existingImage = signal('');

  private id: string | null = null;

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit.set(true); this.loading.set(true);
      this.api.get<any>(`/blogs/${this.id}`).subscribe({
        next: r => {
          const b = r.data;
          if (b) {
            this.form.title      = b.title ?? '';
            this.form.content    = b.content ?? '';
            this.form.excerpt    = b.excerpt ?? '';
            this.form.author     = b.author ?? '';
            this.form.category   = b.category ?? 'Design Tips';
            this.form.tags       = b.tags?.join(', ') ?? '';
            this.form.readTime   = b.readTime ?? 5;
            this.form.isPublished = b.isPublished ?? false;
            this.form.isFeatured  = b.isFeatured ?? false;
            if (b.featuredImage?.url) this.existingImage.set(b.featuredImage.url);
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  onImageSelect(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return;
    this.imageFile = file;
    const r = new FileReader(); r.onload = () => this.imagePreview.set(r.result as string); r.readAsDataURL(file);
  }

  onSubmit() {
    if (!this.form.title?.trim() || !this.form.content?.trim() || !this.form.category) {
      this.error.set('Title, Content and Category are required'); return;
    }
    this.error.set(''); this.saving.set(true);

    const fd = new FormData();
    fd.append('title',       this.form.title);
    fd.append('content',     this.form.content);
    fd.append('excerpt',     this.form.excerpt);
    fd.append('author',      this.form.author);
    fd.append('category',    this.form.category);
    fd.append('readTime',    String(this.form.readTime));
    fd.append('isPublished', String(this.form.isPublished));
    fd.append('isFeatured',  String(this.form.isFeatured));
    // Tags as comma-separated string — backend handles parsing
    fd.append('tags', this.form.tags);
    if (this.imageFile) fd.append('featuredImage', this.imageFile);

    const req = this.isEdit()
      ? this.api.putForm<any>(`/blogs/${this.id}`, fd)
      : this.api.postForm<any>('/blogs', fd);

    req.subscribe({
      next: () => this.router.navigate(['/admin/blogs']),
      error: (err) => { this.error.set(err?.error?.message ?? 'Something went wrong'); this.saving.set(false); }
    });
  }
}
