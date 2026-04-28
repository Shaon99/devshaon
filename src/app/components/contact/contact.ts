import {
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { MagneticDirective } from '../../directives/magnetic.directive';

@Component({
  selector: 'app-contact',
  imports: [AsyncPipe, ScrollRevealDirective, MagneticDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit, OnDestroy {
  /** Same cadence as hero clock (live seconds). */
  private static readonly CLOCK_UPDATE_INTERVAL_MS = 1_000;

  readonly portfolio$ = inject(PortfolioService).portfolio$;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly clock = signal('');
  private clockTimer: ReturnType<typeof setInterval> | null = null;

  readonly year = new Date().getFullYear();

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.tick();
    this.clockTimer = setInterval(() => this.tick(), Contact.CLOCK_UPDATE_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    if (this.clockTimer) clearInterval(this.clockTimer);
  }

  private tick(): void {
    try {
      const now = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Dhaka',
      });
      this.clock.set(`${now}`);
    } catch {
      this.clock.set('Dhaka');
    }
  }

  mailtoHref(address: string | undefined | null): string {
    const raw = (address ?? '').trim();
    if (!raw) return '#';
    let local = raw.replace(/^mailto:/i, '').trim();
    if (!local) return '#';
    if (/^https?:\/\//i.test(local)) {
      try {
        const u = new URL(local);
        const to = u.searchParams.get('to');
        if (to) local = decodeURIComponent(to).trim();
        else return '#';
      } catch {
        return '#';
      }
    }
    return `mailto:${local}`;
  }
}
