// testimonials-section.component.ts
import {
  Component, Input, AfterViewInit, OnDestroy,
  ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.scss']
})
export class TestimonialsSectionComponent implements AfterViewInit, OnDestroy {

  @Input() testimonials: any[] = [];

  @ViewChild('testimonialsSection') testimonialsSection!: ElementRef;
  @ViewChild('sectionHeader')       sectionHeader!:       ElementRef;
  @ViewChild('testimonialsGrid')    testimonialsGrid!:    ElementRef;

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    if (this.testimonials.length === 0) return;
    setTimeout(() => this.animateSection(), 50);
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }

  private animateSection(): void {
    if (!this.sectionHeader || !this.testimonialsGrid) return;

    // Header
    gsap.from(Array.from(this.sectionHeader.nativeElement.children) as HTMLElement[], {
      scrollTrigger: {
        trigger: this.sectionHeader.nativeElement,
        start  : 'top 82%',
        once   : true
      },
      y      : 35,
      opacity: 0,
      duration: 0.7,
      stagger : 0.15,
      ease   : 'power3.out'
    });

    // Cards — alternating vertical offset for a natural stagger feel
    const cards = Array.from(
      this.testimonialsGrid.nativeElement.querySelectorAll('.testimonial-card')
    ) as HTMLElement[];

    cards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: this.testimonialsGrid.nativeElement,
          start  : 'top 80%',
          once   : true
        },
        y       : i % 2 === 0 ? 50 : 70,   // alternating offset
        opacity : 0,
        duration: 0.75,
        delay   : i * 0.1,
        ease    : 'power3.out'
      });
    });
  }

  stars(n: number): number[] { return Array(n).fill(1); }
}