import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../shared/footer/footer.component';

const SLIDES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600',
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600',
  'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1600',
];

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule, FooterComponent],
  template: `
    <!-- Hero -->
    <section class="hero">
      <div class="hero-slideshow">
        <div *ngFor="let s of slides" class="slide" [style.background-image]="'url(' + s + ')'"></div>
      </div>
      <div class="hero-overlay"></div>
      <div class="hero-content" style="padding:0 20px;">
        <div style="font-size:14px;font-weight:700;color:#e8472a;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">✈️ Travel. Connect. Stay.</div>
        <h1>Find a Home<br>Anywhere in the World</h1>
        <p>Connect with locals, share experiences, and travel like a local — not a tourist.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <a routerLink="/signup" class="btn-auth" style="display:inline-block;width:auto;padding:14px 32px;border-radius:10px;">Get Started Free</a>
          <a routerLink="/login" style="display:inline-block;padding:14px 32px;border-radius:10px;border:2px solid rgba(255,255,255,0.4);color:#fff;font-weight:700;font-size:15px;transition:all 0.2s;">Sign In</a>
        </div>
      </div>
    </section>

    <!-- Trust bar -->
    <section style="background:#fff;padding:24px 40px;display:flex;justify-content:center;gap:48px;flex-wrap:wrap;border-bottom:1px solid #eee;">
      <div style="text-align:center;">
        <div style="font-size:28px;font-weight:900;color:#e8472a;">50K+</div>
        <div style="font-size:13px;color:#888;">Travelers</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:28px;font-weight:900;color:#e8472a;">120+</div>
        <div style="font-size:13px;color:#888;">Countries</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:28px;font-weight:900;color:#e8472a;">200K+</div>
        <div style="font-size:13px;color:#888;">Stays Hosted</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:28px;font-weight:900;color:#e8472a;">4.9★</div>
        <div style="font-size:13px;color:#888;">Avg Rating</div>
      </div>
    </section>

    <!-- How it works -->
    <section style="padding:80px 40px;max-width:960px;margin:0 auto;text-align:center;">
      <div style="font-size:12px;font-weight:700;color:#e8472a;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">HOW IT WORKS</div>
      <h2 style="font-size:36px;font-weight:900;margin-bottom:48px;">Three simple steps</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:32px;position:relative;">
        <div class="card" style="padding:32px 24px;">
          <div style="font-size:40px;margin-bottom:16px;">👤</div>
          <h3 style="font-weight:800;margin-bottom:8px;">Create Profile</h3>
          <p style="color:#888;font-size:14px;line-height:1.6;">Sign up, verify your identity, and set up your profile as a traveler or local host.</p>
        </div>
        <div class="card" style="padding:32px 24px;">
          <div style="font-size:40px;margin-bottom:16px;">🔍</div>
          <h3 style="font-weight:800;margin-bottom:8px;">Find Locals</h3>
          <p style="color:#888;font-size:14px;line-height:1.6;">Browse verified locals on the map, read their profiles, and send a stay request.</p>
        </div>
        <div class="card" style="padding:32px 24px;">
          <div style="font-size:40px;margin-bottom:16px;">🏠</div>
          <h3 style="font-weight:800;margin-bottom:8px;">Stay & Connect</h3>
          <p style="color:#888;font-size:14px;line-height:1.6;">Chat, plan your trip, and experience the destination through a local's eyes.</p>
        </div>
      </div>
    </section>

    <!-- Dark features section -->
    <section style="background:#111;padding:80px 40px;color:#fff;">
      <div style="max-width:960px;margin:0 auto;text-align:center;">
        <h2 style="font-size:36px;font-weight:900;margin-bottom:48px;">Everything you need to travel smarter</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px;">
          <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:24px;">
            <div style="font-size:32px;margin-bottom:12px;">🗺️</div>
            <h4 style="font-weight:700;margin-bottom:6px;">Interactive Map</h4>
            <p style="color:#888;font-size:13px;">Find locals near any city with our live map.</p>
          </div>
          <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:24px;">
            <div style="font-size:32px;margin-bottom:12px;">💬</div>
            <h4 style="font-weight:700;margin-bottom:6px;">Real-time Chat</h4>
            <p style="color:#888;font-size:13px;">Message hosts directly before and during your stay.</p>
          </div>
          <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:24px;">
            <div style="font-size:32px;margin-bottom:12px;">✅</div>
            <h4 style="font-weight:700;margin-bottom:6px;">ID Verification</h4>
            <p style="color:#888;font-size:13px;">OCR-powered identity checks for a safe community.</p>
          </div>
          <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:24px;">
            <div style="font-size:32px;margin-bottom:12px;">❓</div>
            <h4 style="font-weight:700;margin-bottom:6px;">Q&A Community</h4>
            <p style="color:#888;font-size:13px;">Ask locals anything about their city before you arrive.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section style="padding:80px 40px;max-width:960px;margin:0 auto;">
      <h2 style="font-size:36px;font-weight:900;text-align:center;margin-bottom:48px;">What travelers say</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;">
        <div class="card">
          <div style="font-size:20px;margin-bottom:12px;">⭐⭐⭐⭐⭐</div>
          <p style="color:#555;font-size:14px;line-height:1.7;margin-bottom:16px;">"Stayed with a local in Jaipur — best travel experience of my life. The host showed me places no guidebook mentions."</p>
          <div style="font-weight:700;font-size:13px;">— Sarah M., USA</div>
        </div>
        <div class="card">
          <div style="font-size:20px;margin-bottom:12px;">⭐⭐⭐⭐⭐</div>
          <p style="color:#555;font-size:14px;line-height:1.7;margin-bottom:16px;">"As a local host in Mumbai, I've met incredible people from 30+ countries. CouchConnect changed how I see my own city."</p>
          <div style="font-weight:700;font-size:13px;">— Rahul K., India</div>
        </div>
        <div class="card">
          <div style="font-size:20px;margin-bottom:12px;">⭐⭐⭐⭐⭐</div>
          <p style="color:#555;font-size:14px;line-height:1.7;margin-bottom:16px;">"The verification system made me feel safe. I knew exactly who I was staying with before I even arrived."</p>
          <div style="font-weight:700;font-size:13px;">— Emma L., Germany</div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section style="background:linear-gradient(135deg,#e8472a,#ff7a5c);padding:80px 40px;text-align:center;color:#fff;">
      <h2 style="font-size:40px;font-weight:900;margin-bottom:16px;">Ready to start your journey?</h2>
      <p style="font-size:18px;opacity:0.9;margin-bottom:32px;">Join thousands of travelers and locals already on CouchConnect.</p>
      <a routerLink="/signup" style="display:inline-block;padding:16px 40px;background:#fff;color:#e8472a;border-radius:10px;font-weight:800;font-size:16px;box-shadow:0 4px 20px rgba(0,0,0,0.2);">Join for Free</a>
    </section>

    <app-footer />
  `,
  styles: [`
    :host { display: block; }
    .slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; animation: heroSlide 25s infinite; }
    .slide:nth-child(1) { animation-delay: 0s; }
    .slide:nth-child(2) { animation-delay: 5s; }
    .slide:nth-child(3) { animation-delay: 10s; }
    .slide:nth-child(4) { animation-delay: 15s; }
    .slide:nth-child(5) { animation-delay: 20s; }
    @keyframes heroSlide { 0%,100%{opacity:0;transform:scale(1)} 5%,28%{opacity:1} 33%{opacity:0;transform:scale(1.06)} }
    :host-context(body.dark) .card { background: #1a1a1a; border-color: #2a2a2a; }
    :host-context(body.dark) h2, :host-context(body.dark) h3 { color: #f0f0f0; }
    :host-context(body.dark) p { color: #aaa; }
  `]
})
export class LandingComponent {
  slides = SLIDES;
}
