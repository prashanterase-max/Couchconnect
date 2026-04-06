import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  dark = signal(false);

  constructor() {
    const saved = localStorage.getItem('cc_theme');
    if (saved === 'dark') this.enable();
  }

  toggle() { this.dark() ? this.disable() : this.enable(); }

  enable() {
    this.dark.set(true);
    document.body.classList.add('dark');
    localStorage.setItem('cc_theme', 'dark');
  }

  disable() {
    this.dark.set(false);
    document.body.classList.remove('dark');
    localStorage.setItem('cc_theme', 'light');
  }
}
