import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

const SLIDES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600',
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600',
  'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1600',
];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  template: `
    <div class="auth-page">
      <div class="hero-slideshow" style="position:absolute;inset:0;">
        <div *ngFor="let s of slides; let i = index" class="slide" [style.background-image]="'url(' + s + ')'"></div>
      </div>
      <div class="bg-overlay"></div>
      <div class="auth-card">
        <div style="text-align:center;margin-bottom:28px;">
          <div style="font-size:22px;font-weight:900;color:#e8472a;margin-bottom:4px;">CouchConnect</div>
          <h2>Welcome back</h2>
          <p style="color:rgba(255,255,255,0.6);font-size:14px;margin-top:6px;">Sign in to continue your journey</p>
        </div>
        <div *ngIf="error" style="background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.4);border-radius:8px;padding:10px 14px;color:#fca5a5;font-size:13px;margin-bottom:16px;">{{ error }}</div>
        <form (ngSubmit)="submit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="you@example.com" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required />
          </div>
          <button type="submit" class="btn-auth" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        <p style="text-align:center;margin-top:20px;color:rgba(255,255,255,0.6);font-size:14px;">
          No account? <a routerLink="/signup" style="color:#e8472a;font-weight:700;">Sign up</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; animation: heroSlide 25s infinite; }
    .slide:nth-child(1){animation-delay:0s} .slide:nth-child(2){animation-delay:5s} .slide:nth-child(3){animation-delay:10s} .slide:nth-child(4){animation-delay:15s} .slide:nth-child(5){animation-delay:20s}
    @keyframes heroSlide{0%,100%{opacity:0;transform:scale(1)}5%,28%{opacity:1}33%{opacity:0;transform:scale(1.06)}}
  `]
})
export class LoginComponent {
  slides = SLIDES;
  email = ''; password = ''; error = ''; loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = ''; this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (e) => { this.error = e.error?.message || 'Login failed'; this.loading = false; }
    });
  }
}
