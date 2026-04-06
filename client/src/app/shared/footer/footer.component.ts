import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <footer class="footer">

      <!-- Top section -->
      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-logo">CouchConnect</div>
          <p class="footer-tagline">Connecting travelers and locals around the world — one couch at a time.</p>
          <div class="footer-socials">
            <a href="#" class="social-btn" title="Twitter">𝕏</a>
            <a href="#" class="social-btn" title="Instagram">📸</a>
            <a href="#" class="social-btn" title="Facebook">f</a>
            <a href="#" class="social-btn" title="LinkedIn">in</a>
          </div>
        </div>

        <div class="footer-links-group">
          <div class="footer-col">
            <div class="footer-col-title">Explore</div>
            <a routerLink="/locals">Find Locals</a>
            <a routerLink="/map">Interactive Map</a>
            <a routerLink="/questions">Q&A Community</a>
            <a routerLink="/inbox">Messages</a>
          </div>
          <div class="footer-col">
            <div class="footer-col-title">Account</div>
            <a routerLink="/profile">My Profile</a>
            <a routerLink="/verification">Get Verified</a>
            <a routerLink="/my-requests">Stay Requests</a>
            <a routerLink="/signup">Sign Up</a>
          </div>
          <div class="footer-col">
            <div class="footer-col-title">Company</div>
            <a href="#">About Us</a>
            <a href="#">Safety</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>

      <!-- Stats bar -->
      <div class="footer-stats">
        <div class="footer-stat">
          <span class="stat-num">{{stats?.totalUsers || '...'}}</span>
          <span class="stat-label">Travelers & Locals</span>
        </div>
        <div class="footer-stat-divider"></div>
        <div class="footer-stat">
          <span class="stat-num">{{stats?.totalCities || '...'}}</span>
          <span class="stat-label">Cities</span>
        </div>
        <div class="footer-stat-divider"></div>
        <div class="footer-stat">
          <span class="stat-num">{{stats?.totalStays || '...'}}</span>
          <span class="stat-label">Stays Hosted</span>
        </div>
        <div class="footer-stat-divider"></div>
        <div class="footer-stat">
          <span class="stat-num">{{stats?.avgRating || '...'}}★</span>
          <span class="stat-label">Avg Rating</span>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="footer-bottom">
        <div class="footer-bottom-left">
          © 2025 CouchConnect. All rights reserved.
        </div>

        <!-- App rating widget -->
        <div class="app-rating-wrap">
          <span style="font-size:12px;color:#444;margin-right:8px;">Rate CouchConnect:</span>
          <div style="display:flex;gap:3px;">
            <span *ngFor="let s of [1,2,3,4,5]"
              (click)="submitAppRating(s)"
              (mouseenter)="hoverStar=s" (mouseleave)="hoverStar=0"
              class="footer-star"
              [class.active]="s <= (hoverStar || myAppRating)">★</span>
          </div>
          <span *ngIf="myAppRating" style="font-size:11px;color:#555;margin-left:6px;">Your rating: {{myAppRating}}★</span>
          <span *ngIf="ratingSubmitted" style="font-size:11px;color:#22c55e;margin-left:6px;">✓ Thanks!</span>
        </div>

        <div class="footer-bottom-right">
          <a href="#">Privacy Policy</a>
          <span>·</span>
          <a href="#">Terms of Service</a>
          <span>·</span>
          <button class="footer-feedback-btn" (click)="showFeedback=true">💬 Send Feedback</button>
        </div>
      </div>

      <!-- Feedback modal -->
      <div *ngIf="showFeedback" style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;" (click)="showFeedback=false">
        <div style="background:#fff;border-radius:16px;padding:28px;max-width:460px;width:100%;animation:scaleIn 0.2s ease;max-height:90vh;overflow-y:auto;" (click)="$event.stopPropagation()">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h3 style="font-weight:800;font-size:18px;margin:0;">Send Feedback</h3>
            <button (click)="showFeedback=false" style="background:none;border:none;font-size:20px;cursor:pointer;color:#aaa;">✕</button>
          </div>

          <div *ngIf="feedbackSent" style="text-align:center;padding:24px 0;">
            <div style="font-size:48px;margin-bottom:12px;">✅</div>
            <div style="font-weight:800;font-size:16px;margin-bottom:6px;">Thank you!</div>
            <div style="color:#888;font-size:14px;">Your feedback has been sent to the admin team.</div>
            <button class="btn-primary" style="margin-top:20px;" (click)="showFeedback=false;feedbackSent=false">Close</button>
          </div>

          <div *ngIf="!feedbackSent">
            <div class="form-group">
              <label>Category</label>
              <select [(ngModel)]="fbForm.category">
                <option>General</option>
                <option>Bug Report</option>
                <option>Feature Request</option>
                <option>Safety Concern</option>
                <option>Account Issue</option>
                <option>Other</option>
              </select>
            </div>
            <div class="form-group">
              <label>Your Message *</label>
              <textarea [(ngModel)]="fbForm.message" placeholder="Tell us what's on your mind..." style="min-height:120px;"></textarea>
            </div>
            <div *ngIf="fbError" style="color:#ef4444;font-size:13px;margin-bottom:12px;">{{fbError}}</div>
            <div style="display:flex;gap:10px;">
              <button class="btn-primary" (click)="submitFeedback()" [disabled]="fbLoading">
                {{fbLoading ? 'Sending...' : '📤 Send Feedback'}}
              </button>
              <button class="btn-outline" (click)="showFeedback=false">Cancel</button>
            </div>
          </div>
        </div>
      </div>

    </footer>
  `,
  styles: [`
    .footer {
      background: #0d0d0d;
      color: #888;
      font-size: 14px;
    }

    /* Top */
    .footer-top {
      max-width: 1200px;
      margin: 0 auto;
      padding: 60px 40px 48px;
      display: flex;
      gap: 60px;
      flex-wrap: wrap;
    }

    /* Brand */
    .footer-brand {
      flex: 0 0 260px;
      min-width: 200px;
    }
    .footer-logo {
      font-size: 22px;
      font-weight: 900;
      color: #e8472a;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }
    .footer-tagline {
      font-size: 13px;
      color: #555;
      line-height: 1.7;
      margin-bottom: 20px;
    }
    .footer-socials {
      display: flex;
      gap: 8px;
    }
    .social-btn {
      width: 34px; height: 34px;
      border-radius: 8px;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      color: #666;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700;
      text-decoration: none;
      transition: all 0.2s;
    }
    .social-btn:hover { background: #e8472a; border-color: #e8472a; color: #fff; }

    /* Link columns */
    .footer-links-group {
      flex: 1;
      display: flex;
      gap: 40px;
      flex-wrap: wrap;
    }
    .footer-col {
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 120px;
    }
    .footer-col-title {
      font-size: 11px;
      font-weight: 800;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .footer-col a {
      color: #555;
      text-decoration: none;
      font-size: 13px;
      transition: color 0.2s;
    }
    .footer-col a:hover { color: #e8472a; }

    /* Stats bar */
    .footer-stats {
      border-top: 1px solid #1a1a1a;
      border-bottom: 1px solid #1a1a1a;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      padding: 24px 40px;
      flex-wrap: wrap;
    }
    .footer-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 40px;
    }
    .stat-num {
      font-size: 22px;
      font-weight: 900;
      color: #e8472a;
      line-height: 1;
    }
    .stat-label {
      font-size: 11px;
      color: #444;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .footer-stat-divider {
      width: 1px;
      height: 32px;
      background: #1a1a1a;
    }

    /* Bottom bar */
    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .footer-bottom-left {
      font-size: 12px;
      color: #333;
    }
    .footer-bottom-right {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #333;
    }
    .footer-bottom-right a {
      color: #444;
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer-bottom-right a:hover { color: #e8472a; }

    .app-rating-wrap { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }
    .footer-star { font-size: 18px; cursor: pointer; color: #333; transition: color 0.15s, transform 0.1s; user-select: none; }
    .footer-star:hover { transform: scale(1.2); }
    .footer-star.active { color: #f59e0b; }

    .footer-feedback-btn {
      background: none; border: none; cursor: pointer;
      color: #e8472a; font-size: 12px; font-weight: 700;
      padding: 0; transition: opacity 0.2s;
    }
    .footer-feedback-btn:hover { opacity: 0.8; }
    @keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }

    @media (max-width: 768px) {
      .footer-top { padding: 40px 20px 32px; gap: 32px; }
      .footer-brand { flex: 0 0 100%; }
      .footer-stat { padding: 0 20px; }
      .footer-bottom { padding: 16px 20px; flex-direction: column; text-align: center; }
      .footer-stats { padding: 20px; gap: 8px; }
    }
  `]
})
export class FooterComponent implements OnInit {
  stats: any = null;
  myAppRating = 0;
  hoverStar = 0;
  ratingSubmitted = false;
  showFeedback = false;
  feedbackSent = false;
  fbLoading = false;
  fbError = '';
  fbForm = { category: 'General', message: '' };
  private token = () => localStorage.getItem('cc_token');

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/stats`).subscribe({
      next: s => this.stats = s,
      error: () => {}
    });
    if (this.token()) {
      this.http.get<any>(`${environment.apiUrl}/app-rating/me`).subscribe({
        next: r => { if (r) this.myAppRating = r.stars; },
        error: () => {}
      });
    }
  }

  submitAppRating(stars: number) {
    if (!this.token()) return;
    this.myAppRating = stars;
    this.http.post<any>(`${environment.apiUrl}/app-rating`, { stars }).subscribe({
      next: () => {
        this.ratingSubmitted = true;
        setTimeout(() => this.ratingSubmitted = false, 3000);
        this.http.get<any>(`${environment.apiUrl}/stats`).subscribe(s => this.stats = s);
      },
      error: () => {}
    });
  }

  submitFeedback() {
    if (!this.fbForm.message.trim()) { this.fbError = 'Please enter a message'; return; }
    this.fbLoading = true; this.fbError = '';
    this.http.post(`${environment.apiUrl}/feedback`, this.fbForm).subscribe({
      next: () => { this.feedbackSent = true; this.fbLoading = false; this.fbForm = { category: 'General', message: '' }; },
      error: (e: any) => { this.fbError = e.error?.message || 'Failed to send'; this.fbLoading = false; }
    });
  }
}
