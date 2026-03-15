// about-teaser.component.ts
import {
  Component, Input, AfterViewInit, OnDestroy,
  ElementRef, ViewChild, ViewChildren, QueryList
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about-teaser',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-teaser.component.html',
  styleUrls: ['./about-teaser.component.scss']
})
export class AboutTeaserComponent implements AfterViewInit, OnDestroy {

  @Input() aboutData: any = null;

  @ViewChild('aboutSection') aboutSection!: ElementRef;
  @ViewChild('visual')       visual!:       ElementRef;
  @ViewChild('badge')        badge!:        ElementRef;
  @ViewChild('body')         body!:         ElementRef;
  @ViewChild('featureList')  featureList!:  ElementRef;
  @ViewChild('ctaBtn')       ctaBtn!:       ElementRef;

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    this.animateSection();
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }

  private animateSection(): void {
    const trigger = {
      trigger: this.aboutSection.nativeElement,
      start  : 'top 75%',
      once   : true
    };

    // Image — slides in from left
    gsap.from(this.visual.nativeElement, {
      scrollTrigger: trigger,
      x      : -60,
      opacity: 0,
      duration: 1,
      ease   : 'power3.out'
    });

    // Badge — pops in slightly after image
    gsap.from(this.badge.nativeElement, {
      scrollTrigger: trigger,
      scale  : 0.75,
      opacity: 0,
      duration: 0.7,
      ease   : 'back.out(1.7)',
      delay  : 0.45
    });

    // Body text — slides in from right
    const bodyChildren = Array.from(
      this.body.nativeElement.querySelector('.section-header').children
    ) as HTMLElement[];

    gsap.from(bodyChildren, {
      scrollTrigger: trigger,
      x      : 50,
      opacity: 0,
      duration: 0.75,
      stagger : 0.15,
      ease   : 'power3.out',
      delay  : 0.2
    });

    // Feature list items — stagger from bottom
    const featureItems = Array.from(
      this.featureList.nativeElement.children
    ) as HTMLElement[];

    gsap.from(featureItems, {
      scrollTrigger: trigger,
      y      : 20,
      opacity: 0,
      duration: 0.5,
      stagger : 0.1,
      ease   : 'power2.out',
      delay  : 0.55
    });

    // CTA button
    gsap.from(this.ctaBtn.nativeElement, {
      scrollTrigger: trigger,
      y      : 20,
      opacity: 0,
      duration: 0.6,
      ease   : 'power2.out',
      delay  : 0.85
    });
  }
}