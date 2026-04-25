import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

interface NavLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit, OnDestroy {
  readonly themeService = inject(ThemeService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly links: NavLink[] = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Life', href: '#hobbies' },
    { label: 'Contact', href: '#contact' },
  ];

  readonly scrolled = signal(false);
  readonly mobileOpen = signal(false);
  readonly activeSection = signal<string>('hero');

  #observer: IntersectionObserver | null = null;
  #retryTimer: ReturnType<typeof setTimeout> | null = null;
  #sectionEls: HTMLElement[] = [];

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.#observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0.05 },
    );

    this.observeSectionsWithRetry();
  }

  ngOnDestroy(): void {
    if (this.#retryTimer) {
      clearTimeout(this.#retryTimer);
      this.#retryTimer = null;
    }
    this.#observer?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isBrowser) return;
    this.scrolled.set(window.scrollY > 24);
    this.updateActiveFromScroll();
  }

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  scrollTo(id: string, event: Event): void {
    event.preventDefault();
    this.mobileOpen.set(false);
    this.activeSection.set(id.replace(/^#/, ''));
    const el = this.isBrowser ? document.querySelector(id) : null;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private observeSectionsWithRetry(remainingAttempts = 8): void {
    if (!this.#observer || !this.isBrowser) return;

    this.#observer.disconnect();
    const targets = this.links
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((el): el is HTMLElement => !!el);
    this.#sectionEls = targets;

    if (!targets.length && remainingAttempts > 0) {
      this.#retryTimer = setTimeout(() => {
        this.observeSectionsWithRetry(remainingAttempts - 1);
      }, 120);
      return;
    }

    for (const section of targets) {
      this.#observer.observe(section);
    }

    // Set an initial active section after observers are attached.
    this.updateActiveFromScroll();
  }

  private updateActiveFromScroll(): void {
    if (!this.#sectionEls.length) return;

    const viewportAnchor = window.innerHeight * 0.32;
    let bestId = this.#sectionEls[0].id;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const section of this.#sectionEls) {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top - viewportAnchor);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestId = section.id;
      }
    }

    if (this.activeSection() !== bestId) {
      this.activeSection.set(bestId);
    }
  }
}
