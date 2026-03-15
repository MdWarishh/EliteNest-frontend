// hero.component.ts
import {
  Component, Input, OnInit, OnChanges, SimpleChanges,
  OnDestroy, signal, computed,
  ElementRef, ViewChild, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  // ── Inputs ─────────────────────────────────────────────
  @Input() heroData: any = null;

  // ── ViewChild refs for GSAP ────────────────────────────
  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('eyebrow')     eyebrow!:     ElementRef;
  @ViewChild('title')       title!:       ElementRef;
  @ViewChild('subtitle')    subtitle!:    ElementRef;
  @ViewChild('actions')     actions!:     ElementRef;
  @ViewChild('scrollHint')  scrollHint!:  ElementRef;

  // ── Carousel state ─────────────────────────────────────
  activeSlide         = signal(0);
  private autoplayTimer: any;
  private animationDone = false;

  // ── BUG FIX: Internal signal — heroData (plain @Input) se
  //    computed() reactively kaam nahi karta kyunki @Input change
  //    Angular signals graph mein track nahi hota.
  //    Solution: @Input change hone par is signal ko manually update karo.
  private _heroData = signal<any>(null);

  // ── Default hero fallback ──────────────────────────────
  private defaultHero = {
    headline   : 'Crafting Spaces That Tell <em>Your Story</em>',
    subHeadline: 'Award-winning interior design studio transforming homes and offices into extraordinary living experiences.',
    ctaText    : 'Explore Our Work'
  };

  // ── Computed: slide URLs — ab _heroData signal track hoti hai ──
  heroSlides = computed<string[]>(() => {
    const h = this._heroData();   // ✅ signal read — reactive hai
    if (!h) return [];

    if (Array.isArray(h.mediaUrls) && h.mediaUrls.length > 0) {
      return h.mediaUrls
        .map((e: any) => typeof e === 'string' ? e : e?.url)
        .filter((u: any): u is string => typeof u === 'string' && u.trim() !== '');
    }

    if (h.mediaUrl && typeof h.mediaUrl === 'string') return [h.mediaUrl];

    return [];
  });

  get hero() { return this._heroData() ?? this.defaultHero; }

  // ── Lifecycle ──────────────────────────────────────────

  ngOnInit(): void {
    // Initial value sync (agar heroData pehle se set ho)
    if (this.heroData) {
      this._heroData.set(this.heroData);
      if (this.heroSlides().length > 1) this.startAutoplay();
    }
  }

  // ── BUG FIX: ngOnChanges — jab bhi parent heroData update kare ──
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['heroData'] && changes['heroData'].currentValue) {
      const newData = changes['heroData'].currentValue;
      this._heroData.set(newData);   // ✅ signal update → computed re-runs → template re-renders

      // Autoplay restart karo nai images ke saath
      this.stopAutoplay();
      this.activeSlide.set(0);
      if (this.heroSlides().length > 1) this.startAutoplay();
    }
  }

  ngAfterViewInit(): void {
    // Agar data pehle se aa gaya ho to animate karo
    // Warna animation skip — data aane par bhi ek baar chalega
    this.runEntranceAnimation();
    this.animationDone = true;
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  // ── GSAP Entrance Animation ────────────────────────────
  private runEntranceAnimation(): void {
    // Elements exist check — agar koi ViewChild null ho to skip
    if (!this.eyebrow || !this.title || !this.subtitle || !this.actions || !this.scrollHint) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(this.heroSection.nativeElement.querySelector('.hero__overlay'), {
      opacity: 0, duration: 1.2
    }, 0);

    tl.from(this.eyebrow.nativeElement, {
      y: 30, opacity: 0, duration: 0.8
    }, 0.4);

    tl.from(this.title.nativeElement, {
      y: 60, opacity: 0, duration: 1, ease: 'power4.out'
    }, 0.65);

    tl.from(this.subtitle.nativeElement, {
      y: 25, opacity: 0, duration: 0.8
    }, 0.95);

    tl.from(Array.from(this.actions.nativeElement.children) as HTMLElement[], {
      y: 20, opacity: 0, duration: 0.7, stagger: 0.15
    }, 1.15);

    tl.from(this.scrollHint.nativeElement, {
      opacity: 0, duration: 0.6
    }, 1.5);
  }

  // ── Carousel methods ───────────────────────────────────
  goToSlide(index: number): void {
    this.activeSlide.set(index);
    this.resetAutoplay();
  }

  nextSlide(): void {
    const total = this.heroSlides().length;
    this.activeSlide.set((this.activeSlide() + 1) % total);
    this.resetAutoplay();
  }

  prevSlide(): void {
    const total = this.heroSlides().length;
    this.activeSlide.set((this.activeSlide() - 1 + total) % total);
    this.resetAutoplay();
  }

  private startAutoplay(): void {
    this.autoplayTimer = setInterval(() => {
      const total = this.heroSlides().length;
      if (total > 1) this.activeSlide.set((this.activeSlide() + 1) % total);
    }, 5000);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  private resetAutoplay(): void {
    this.stopAutoplay();
    if (this.heroSlides().length > 1) this.startAutoplay();
  }
}