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

  readonly brandAvatarSrc = 'https://avatars.githubusercontent.com/u/51782102?v=4';

  readonly links: NavLink[] = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Work', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Achievement', href: '#achievement' },
    { label: 'Life', href: '#hobbies' },
    { label: 'Contact', href: '#contact' },
  ];

  readonly scrolled = signal(false);
  readonly mobileOpen = signal(false);
  readonly activeSection = signal<string>('hero');

  /** Browser `setTimeout` ids (`number`); avoid `NodeJS.Timeout` from `@types/node` clash */
  #retryTimer: number | null = null;
  #scrollUnlockTimer: number | null = null;
  #sectionEls: HTMLElement[] = [];
  /** While true, scroll-spy must not overwrite `activeSection` (e.g. right after in-page nav click). */
  #spySuspended = false;

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.observeSectionsWithRetry();
  }

  ngOnDestroy(): void {
    if (this.#retryTimer) {
      clearTimeout(this.#retryTimer);
      this.#retryTimer = null;
    }
    if (this.#scrollUnlockTimer) {
      clearTimeout(this.#scrollUnlockTimer);
      this.#scrollUnlockTimer = null;
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isBrowser) return;
    this.scrolled.set(window.scrollY > 24);
    this.updateActiveFromScroll();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isBrowser) return;
    this.updateActiveFromScroll();
  }

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
    if (this.isBrowser) {
      queueMicrotask(() => this.updateActiveFromScroll());
    }
  }

  scrollTo(id: string, event: Event): void {
    event.preventDefault();
    this.mobileOpen.set(false);
    const sectionId = id.replace(/^#/, '');
    this.activeSection.set(sectionId);

    if (!this.isBrowser) return;

    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Smooth scroll still fires `scroll` at the old position first; spy would reset the highlight.
    this.#spySuspended = true;
    if (this.#scrollUnlockTimer) {
      clearTimeout(this.#scrollUnlockTimer);
      this.#scrollUnlockTimer = null;
    }

    this.#scrollUnlockTimer = window.setTimeout(() => {
      this.#scrollUnlockTimer = null;
      this.#spySuspended = false;
      this.updateActiveFromScroll();
    }, 750);
  }

  private observeSectionsWithRetry(remainingAttempts = 8): void {
    if (!this.isBrowser) return;

    const targets = this.links
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((el): el is HTMLElement => !!el);
    this.#sectionEls = targets;

    if (!targets.length && remainingAttempts > 0) {
      this.#retryTimer = window.setTimeout(() => {
        this.observeSectionsWithRetry(remainingAttempts - 1);
      }, 120);
      return;
    }

    this.updateActiveFromScroll();
  }

  private updateActiveFromScroll(): void {
    if (this.#spySuspended) return;
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
