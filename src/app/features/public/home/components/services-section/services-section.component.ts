// services-section.component.ts
import {
  Component, Input, AfterViewInit, OnDestroy,
  ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services-section.component.html',
  styleUrls: ['./services-section.component.scss']
})
export class ServicesSectionComponent implements AfterViewInit, OnDestroy {

  @Input() services: any[] = [];

  @ViewChild('servicesSection') servicesSection!: ElementRef;
  @ViewChild('sectionHeader')   sectionHeader!:   ElementRef;
  @ViewChild('servicesGrid')    servicesGrid!:    ElementRef;

  placeholderServices = [
    { icon: '🏠', title: 'Residential Design',  desc: 'Complete home transformation from concept to completion.'   },
    { icon: '🏢', title: 'Commercial Spaces',   desc: 'Offices and commercial spaces that inspire and impress.'     },
    { icon: '🍳', title: 'Modular Kitchen',     desc: 'Beautiful, functional kitchens tailored to your lifestyle.' },
    { icon: '🛏',  title: 'Bedroom Design',     desc: 'Serene, personalised bedroom retreats.'                      },
    { icon: '🛋',  title: 'Living Rooms',       desc: 'Statement living spaces for entertaining and relaxing.'     },
    { icon: '✦',   title: 'Turnkey Projects',   desc: 'End-to-end execution with zero hassle for you.'            },
  ];

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    this.animateSection();
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }

  private animateSection(): void {
    const headerTrigger = {
      trigger: this.sectionHeader.nativeElement,
      start  : 'top 80%',
      once   : true
    };

    // Section header — fade up
    gsap.from(Array.from(this.sectionHeader.nativeElement.children) as HTMLElement[], {
      scrollTrigger: headerTrigger,
      y      : 40,
      opacity: 0,
      duration: 0.75,
      stagger : 0.15,
      ease   : 'power3.out'
    });

    // Cards — stagger in with slight y + opacity
    const cards = Array.from(
      this.servicesGrid.nativeElement.querySelectorAll('.service-card')
    ) as HTMLElement[];

    gsap.from(cards, {
      scrollTrigger: {
        trigger: this.servicesGrid.nativeElement,
        start  : 'top 80%',
        once   : true
      },
      y       : 50,
      opacity : 0,
      duration: 0.65,
      stagger : 0.1,
      ease    : 'power3.out'
    });

    // Individual card icon — subtle scale pop on scroll
    cards.forEach((card) => {
      const icon = card.querySelector('.service-card__icon') as HTMLElement;
      if (!icon) return;

      gsap.from(icon, {
        scrollTrigger: {
          trigger: card,
          start  : 'top 85%',
          once   : true
        },
        scale   : 0.5,
        opacity : 0,
        duration: 0.5,
        ease    : 'back.out(2)'
      });
    });
  }
}