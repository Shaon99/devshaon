import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly theme = signal<Theme>('dark');

  constructor() {
    if (!this.isBrowser) return;

    const saved = localStorage.getItem('theme') as Theme | null;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.apply(saved ?? (systemDark ? 'dark' : 'light'));

    // Track system preference changes (only when user hasn't set a manual preference)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.apply(e.matches ? 'dark' : 'light');
      }
    });
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.apply(next);
    if (this.isBrowser) localStorage.setItem('theme', next);
  }

  private apply(t: Theme): void {
    this.theme.set(t);
    if (this.isBrowser) {
      document.documentElement.setAttribute('data-theme', t);
    }
  }
}
