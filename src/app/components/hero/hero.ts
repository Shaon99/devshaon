import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { MagneticDirective } from '../../directives/magnetic.directive';

const ROLE_PHRASES = [
  'Lead Software Engineer',
  'Backend Developer',
  'Full-Stack Builder',
  'UI / UX Tinkerer',
  'DevOps Practitioner',
  'Side-Project Addict',
];

const ROLE_ROTATION_INTERVAL_MS = 2400;
const CLOCK_UPDATE_INTERVAL_MS = 1_000;

@Component({
  selector: 'app-hero',
  imports: [AsyncPipe, MagneticDirective],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit, OnDestroy {
  private readonly svc = inject(PortfolioService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly portfolio$ = this.svc.portfolio$;
  readonly roles = ROLE_PHRASES;

  readonly activeRoleIndex = signal(0);
  readonly clock = signal('');
  readonly pointer = signal({ x: 50, y: 50 });

  private rotateTimer: ReturnType<typeof setInterval> | null = null;
  private clockTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.rotateTimer = setInterval(() => {
      this.activeRoleIndex.update((i) => (i + 1) % this.roles.length);
    }, ROLE_ROTATION_INTERVAL_MS);

    this.updateClock();
    this.clockTimer = setInterval(() => this.updateClock(), CLOCK_UPDATE_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    if (this.rotateTimer) clearInterval(this.rotateTimer);
    if (this.clockTimer) clearInterval(this.clockTimer);
  }

  @HostListener('window:mousemove', ['$event'])
  onMove(e: MouseEvent): void {
    if (!this.isBrowser) return;
    this.pointer.set({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  }

  scrollTo(id: string, event: Event): void {
    event.preventDefault();
    if (!this.isBrowser) return;
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private updateClock(): void {
    try {
      const now = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Dhaka',
      });
      this.clock.set(`Dhaka ${now}`);
    } catch {
      this.clock.set('Dhaka');
    }
  }

  firstName(full: string): string {
    return full.trim().split(/\s+/)[0] ?? full;
  }

  lastName(full: string): string {
    const parts = full.trim().split(/\s+/);
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
  }
}
