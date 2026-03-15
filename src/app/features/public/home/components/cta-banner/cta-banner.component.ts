// cta-banner.component.ts
import {
  Component, AfterViewInit, OnDestroy,
  ElementRef, ViewChild
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-cta-banner',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cta-banner.component.html',
  styleUrls: ['./cta-banner.component.scss']
})
export class CtaBannerComponent implements AfterViewInit, OnDestroy {

  @ViewChild('ctaSection') ctaSection!: ElementRef;
  @ViewChild('eyebrow')    eyebrow!:    ElementRef;
  @ViewChild('title')      title!:      ElementRef;
  @ViewChild('sub')        sub!:        ElementRef;
  @ViewChild('actions')    actions!:    ElementRef;

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    this.animateSection();
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }

  private animateSection(): void {
    const trigger = {
      trigger: this.ctaSection.nativeElement,
      start  : 'top 75%',
      once   : true
    };

    const tl = gsap.timeline({ scrollTrigger: trigger });

    // Background radial glow expands
    tl.from(this.ctaSection.nativeElement.querySelector('.cta-banner__bg'), {
      opacity : 0,
      duration: 1,
      ease    : 'power2.out'
    }, 0);

    // Content stagger
    tl.from(this.eyebrow.nativeElement, {
      y: 30, opacity: 0, duration: 0.7, ease: 'power3.out'
    }, 0.2);

    tl.from(this.title.nativeElement, {
      y: 45, opacity: 0, duration: 0.85, ease: 'power3.out'
    }, 0.38);

    tl.from(this.sub.nativeElement, {
      y: 30, opacity: 0, duration: 0.7, ease: 'power3.out'
    }, 0.56);

    tl.from(Array.from(this.actions.nativeElement.children) as HTMLElement[], {
      y: 20, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out'
    }, 0.72);
  }
}