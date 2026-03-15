import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({ selector: 'app-blog-detail', standalone: true, imports: [CommonModule, RouterModule],
  template: `
<div class="public-page">
  @if (loading()) {
    <div class="blog-loading"><div class="spinner"></div></div>
  } @else if (!blog()) {
    <div class="container" style="padding:120px 0;text-align:center"><h2>Article not found</h2><a routerLink="/blog" class="back-link">← Back to Journal</a></div>
  } @else {
    <article class="blog-article">
      <header class="blog-article__header">
        <div class="container container--sm">
          <span class="blog-cat">{{ blog().category }}</span>
          <h1 class="blog-article__title">{{ blog().title }}</h1>
          <div class="blog-article__meta">
            <span>By {{ blog().author || 'EliteNest Team' }}</span>
            <span>·</span><span>{{ blog().readTime }} min read</span>
            <span>·</span><span>{{ blog().createdAt | date:'MMMM d, y' }}</span>
          </div>
          @if (blog().tags?.length) {
            <div class="blog-article__tags">
              @for (tag of blog().tags; track tag) { <span class="tag">#{{ tag }}</span> }
            </div>
          }
        </div>
      </header>
      @if (blog().featuredImage?.url) {
        <div class="blog-article__cover"><img [src]="blog().featuredImage.url" [alt]="blog().title" /></div>
      }
      <div class="container container--sm">
        <div class="blog-article__content" [innerHTML]="blog().content"></div>
        <div class="blog-article__footer">
          <a routerLink="/blog" class="back-link">← Back to Journal</a>
        </div>
      </div>
    </article>
  }
</div>`,
  styles: [`
    @import '../../../../styles/variables'; @import '../../../../styles/mixins'; @import '../_public-shared';
    .blog-loading { min-height:60vh; display:flex; align-items:center; justify-content:center; }
    .spinner { width:40px; height:40px; border:3px solid #e5ddd3; border-top-color:#b8934a; border-radius:50%; animation:spin .8s linear infinite; }
    @keyframes spin { to{transform:rotate(360deg)} }
    .blog-article__header { background:var(--pub-text); color:#fff; padding:140px 0 60px; text-align:center; }
    .blog-cat { background:var(--pub-gold); color:#fff; font-size:.72rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:5px 14px; border-radius:100px; }
    .blog-article__title { font-family:'Cormorant Garamond',serif; font-size:clamp(2rem,4vw,3.2rem); font-weight:300; margin:20px 0 16px; line-height:1.2; }
    .blog-article__meta { font-size:.85rem; color:rgba(255,255,255,.6); display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
    .blog-article__tags { margin-top:16px; display:flex; gap:8px; justify-content:center; flex-wrap:wrap; }
    .tag { font-size:.75rem; color:rgba(255,255,255,.5); }
    .blog-article__cover { max-height:520px; overflow:hidden; img { width:100%; height:100%; object-fit:cover; } }
    .container--sm { max-width:760px; margin:0 auto; padding:0 24px; }
    .blog-article__content { padding:60px 0; font-size:1.05rem; line-height:1.85; color:var(--pub-text); }
    .blog-article__footer { padding-bottom:80px; }
    .back-link { font-size:.85rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--pub-gold); text-decoration:none; border-bottom:1px solid var(--pub-gold); }
  `]
})
export class BlogDetailComponent implements OnInit {
  blog = signal<any>(null);
  loading = signal(true);
  constructor(private api: ApiService, private route: ActivatedRoute) {}
  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.api.get<any>(`/blogs/${slug}`).subscribe({
      next: r => { this.blog.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
