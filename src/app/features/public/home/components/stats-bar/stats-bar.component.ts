// stats-bar.component.ts
import {
  Component, Input, AfterViewInit, OnDestroy,
  ElementRef, ViewChild, ViewChildren, QueryList
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-bar.component.html',
  styleUrls: ['./stats-bar.component.scss']
})
export class StatsBarComponent implements AfterViewInit, OnDestroy {

  @Input() stats: any = {
    projectsCompleted: 250,
    happyClients     : 200,
    yearsExperience  : 12,
    citiesCovered    : 8
  };

  @ViewChild('statsSection') statsSection!: ElementRef;
  @ViewChildren('statItem')  statItems!: QueryList<ElementRef>;

  private scrollTriggerInstance: ScrollTrigger | undefined;

  ngAfterViewInit(): void {
    this.animateStats();
  }

  ngOnDestroy(): void {
    this.scrollTriggerInstance?.kill();
  }

  private animateStats(): void {
    const items = this.statItems.map(r => r.nativeElement);

    // Slide-up stagger reveal on scroll
    gsap.from(items, {
      scrollTrigger: {
        trigger: this.statsSection.nativeElement,
        start  : 'top 85%',
        once   : true
      },
      y      : 40,
      opacity: 0,
      duration: 0.7,
      stagger : 0.12,
      ease   : 'power3.out',
      onComplete: () => this.runCounters(items)
    });
  }

  // Animated number counters
  private runCounters(items: HTMLElement[]): void {
    const targets = [
      { key: 'projectsCompleted', el: items[0] },
      { key: 'happyClients',      el: items[1] },
      { key: 'yearsExperience',   el: items[2] },
      { key: 'citiesCovered',     el: items[3] }
    ];

    targets.forEach(({ key, el }) => {
      const numEl    = el.querySelector('.stat-item__num') as HTMLElement;
      const endValue = this.stats[key] as number;
      const suffix   = key !== 'citiesCovered' ? '+' : '';
      const obj      = { val: 0 };

      gsap.to(obj, {
        val     : endValue,
        duration: 2,
        ease    : 'power2.out',
        onUpdate: () => {
          numEl.textContent = Math.round(obj.val) + suffix;
        }
      });
    });
  }
}