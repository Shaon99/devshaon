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
    this.apply(saved ?? 'dark');
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
