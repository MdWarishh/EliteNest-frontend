// home-manager.component.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

/** Ek image entry — ya to server se aayi (url) ya nai file hai */
interface HeroImageEntry {
  previewUrl : string;        // display ke liye (data-URL ya server URL string)
  file       : File | null;   // nai file; null = server se already stored
  serverUrl  : string | null; // server pe stored URL string (existing images)
}

@Component({
  selector   : 'app-home-manager',
  standalone : true,
  imports    : [CommonModule, FormsModule],
  templateUrl: './home-manager.component.html',
  styleUrls  : ['./home-manager.component.scss']
})
export class HomeManagerComponent implements OnInit {

  loading = signal(true);
  saving  = signal(false);
  saved   = signal(false);
  error   = signal('');

  // ── Hero: multiple images ──────────────────────────────
  heroImages       = signal<HeroImageEntry[]>([]);
  heroPreviewIndex = signal(0);

  /** Combined list for the template */
  allHeroImages = computed(() => this.heroImages());

  // ── About: single image ────────────────────────────────
  aboutFile     : File | null = null;
  aboutPreview  = signal('');
  existingAbout = signal('');

  form = {
    hero        : { headline: '', subHeadline: '', ctaText: 'Explore Our Work', ctaLink: '/portfolio' },
    stats       : { projectsCompleted: 150, happyClients: 120, yearsExperience: 10, citiesCovered: 5 },
    aboutTeaser : { heading: '', description: '' },
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<any>('/home').subscribe({
      next: r => {
        const d = r.data ?? {};

        // ── Hero text fields ──
        if (d.hero) {
          this.form.hero = {
            headline   : d.hero.headline    ?? '',
            subHeadline: d.hero.subHeadline ?? '',
            ctaText    : d.hero.ctaText     ?? 'Explore Our Work',
            ctaLink    : d.hero.ctaLink     ?? '/portfolio',
          };

          // ── BUG FIX: mediaUrls is array of {url, publicId} objects, NOT plain strings ──
          const existing: HeroImageEntry[] = [];

          if (Array.isArray(d.hero.mediaUrls) && d.hero.mediaUrls.length > 0) {
            d.hero.mediaUrls.forEach((entry: any) => {
              // entry can be: {url: '...', publicId: '...'} OR plain string (legacy)
              const urlStr = typeof entry === 'string' ? entry : entry?.url;
              if (urlStr) {
                existing.push({
                  previewUrl: urlStr,   // ✅ always a plain string now
                  file      : null,
                  serverUrl : urlStr,   // ✅ plain string for keepUrls
                });
              }
            });
          } else if (d.hero.mediaUrl) {
            // Legacy single image fallback
            existing.push({
              previewUrl: d.hero.mediaUrl,
              file      : null,
              serverUrl : d.hero.mediaUrl,
            });
          }

          this.heroImages.set(existing);
        }

        // ── Stats ──
        if (d.stats) this.form.stats = { ...this.form.stats, ...d.stats };

        // ── About ──
        if (d.aboutTeaser) {
          this.form.aboutTeaser = {
            heading    : d.aboutTeaser.heading     ?? '',
            description: d.aboutTeaser.description ?? '',
          };
          if (d.aboutTeaser.image?.url) this.existingAbout.set(d.aboutTeaser.image.url);
        }

        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  // ── Hero: multiple file picker ─────────────────────────
  pickHeroFiles(e: Event) {
    const files = Array.from((e.target as HTMLInputElement).files ?? []);
    if (!files.length) return;

    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = () => {
        const entry: HeroImageEntry = {
          previewUrl: reader.result as string,
          file      : f,
          serverUrl : null,
        };
        this.heroImages.update(list => [...list, entry]);
      };
      reader.readAsDataURL(f);
    });

    // Reset input so same file can be re-selected
    (e.target as HTMLInputElement).value = '';
  }

  removeHeroImage(index: number) {
    this.heroImages.update(list => list.filter((_, i) => i !== index));
  }

  // ── About: single file picker ──────────────────────────
  pickFile(type: 'about', e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.aboutFile = f;
      this.aboutPreview.set(reader.result as string);
    };
    reader.readAsDataURL(f);
  }

  // ── Save ───────────────────────────────────────────────
  onSave() {
    this.saving.set(true);
    this.error.set('');

    const fd = new FormData();
    fd.append('hero',        JSON.stringify(this.form.hero));
    fd.append('stats',       JSON.stringify(this.form.stats));
    fd.append('aboutTeaser', JSON.stringify(this.form.aboutTeaser));

    // ── BUG FIX: serverUrl is now always a plain string ──
    // Controller ko ye batata hai ki kaunsi existing images rakhni hain
    const keepUrls = this.heroImages()
      .filter(img => img.serverUrl !== null)
      .map(img => img.serverUrl as string);   // ✅ guaranteed string
    fd.append('heroExistingUrls', JSON.stringify(keepUrls));

    // Nai files append karo
    this.heroImages()
      .filter(img => img.file !== null)
      .forEach(img => fd.append('heroImages', img.file as File));

    // About image
    if (this.aboutFile) fd.append('aboutImage', this.aboutFile);

    this.api.putForm<any>('/home', fd).subscribe({
      next: (r) => {
        const d = r.data;

        // ── BUG FIX: refresh hero images — same fix as ngOnInit ──
        if (d?.hero) {
          const updated: HeroImageEntry[] = [];

          if (Array.isArray(d.hero.mediaUrls) && d.hero.mediaUrls.length > 0) {
            d.hero.mediaUrls.forEach((entry: any) => {
              const urlStr = typeof entry === 'string' ? entry : entry?.url;
              if (urlStr) {
                updated.push({ previewUrl: urlStr, file: null, serverUrl: urlStr });
              }
            });
          } else if (d.hero.mediaUrl) {
            updated.push({ previewUrl: d.hero.mediaUrl, file: null, serverUrl: d.hero.mediaUrl });
          }

          this.heroImages.set(updated);
        }

        if (d?.aboutTeaser?.image?.url) this.existingAbout.set(d.aboutTeaser.image.url);

        this.aboutFile = null;
        this.aboutPreview.set('');
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 3000);
      },
      error: (e) => {
        this.error.set(e?.error?.message ?? 'Error saving');
        this.saving.set(false);
      }
    });
  }
}