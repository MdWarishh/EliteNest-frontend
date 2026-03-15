// portfolio-section.component.ts
import {
  Component, Input, AfterViewInit, OnDestroy,
  ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-portfolio-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portfolio-section.component.html',
  styleUrls: ['./portfolio-section.component.scss']
})
export class PortfolioSectionComponent implements AfterViewInit, OnDestroy {

  @Input() portfolio: any[] = [];

  @ViewChild('portfolioSection') portfolioSection!: ElementRef;
  @ViewChild('sectionHeader')    sectionHeader!:    ElementRef;
  @ViewChild('portfolioGrid')    portfolioGrid!:    ElementRef;
  @ViewChild('ctaRow')           ctaRow!:           ElementRef;

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    // Wait a tick so @for renders the cards first
    setTimeout(() => this.animateSection(), 50);
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }

  private animateSection(): void {

    // Header
    gsap.from(Array.from(this.sectionHeader.nativeElement.children) as HTMLElement[], {
      scrollTrigger: {
        trigger: this.sectionHeader.nativeElement,
        start  : 'top 80%',
        once   : true
      },
      y      : 40,
      opacity: 0,
      duration: 0.75,
      stagger : 0.15,
      ease   : 'power3.out'
    });

    // Portfolio cards — only if grid exists
    if (!this.portfolioGrid) return;

    const cards = Array.from(
      this.portfolioGrid.nativeElement.querySelectorAll('.portfolio-card')
    ) as HTMLElement[];

    // Large card (first) — dramatic reveal from bottom
    if (cards[0]) {
      gsap.from(cards[0], {
        scrollTrigger: {
          trigger: this.portfolioGrid.nativeElement,
          start  : 'top 80%',
          once   : true
        },
        y       : 80,
        opacity : 0,
        duration: 0.9,
        ease    : 'power3.out'
      });
    }

    // Rest of cards — stagger
    if (cards.length > 1) {
      gsap.from(cards.slice(1), {
        scrollTrigger: {
          trigger: this.portfolioGrid.nativeElement,
          start  : 'top 80%',
          once   : true
        },
        y       : 50,
        opacity : 0,
        duration: 0.7,
        stagger : 0.1,
        ease    : 'power3.out',
        delay   : 0.2
      });
    }

    // Image parallax on scroll (subtle)
    cards.forEach(card => {
      const img = card.querySelector('img') as HTMLElement;
      if (!img) return;

      gsap.to(img, {
        scrollTrigger: {
          trigger  : card,
          start    : 'top bottom',
          end      : 'bottom top',
          scrub    : 1.5
        },
        y   : -30,
        ease: 'none'
      });
    });

    // CTA button
    if (this.ctaRow) {
      gsap.from(this.ctaRow.nativeElement, {
        scrollTrigger: {
          trigger: this.ctaRow.nativeElement,
          start  : 'top 90%',
          once   : true
        },
        y      : 25,
        opacity: 0,
        duration: 0.6,
        ease   : 'power2.out'
      });
    }
  }
}