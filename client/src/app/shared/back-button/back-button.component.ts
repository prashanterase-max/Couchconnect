import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-btn',
  standalone: true,
  template: `
    <button class="back-btn" (click)="go()" title="Go back">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      Back
    </button>
  `,
  styles: [`
    .back-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 14px; border-radius: 8px;
      border: 1px solid #eee; background: #fff;
      color: #555; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
      margin-bottom: 20px;
    }
    .back-btn:hover { border-color: #e8472a; color: #e8472a; background: #fff8f7; }
    :host-context(body.dark) .back-btn { background: #1a1a1a; border-color: #2a2a2a; color: #aaa; }
    :host-context(body.dark) .back-btn:hover { border-color: #e8472a; color: #e8472a; background: #1a0f0d; }
  `]
})
export class BackButtonComponent {
  constructor(private location: Location) {}
  go() { this.location.back(); }
}
