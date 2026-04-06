import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const HERO_SLIDES = [
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600', // India
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600',
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600',
];

const PLACES = [
  {
    name: 'Jaipur', country: 'India', tag: '🏰 Heritage',
    desc: 'The Pink City of Rajasthan, famous for its stunning palaces, vibrant bazaars, and rich Rajput history.',
    bestTime: 'Oct – Mar', language: 'Hindi', currency: 'INR',
    highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar'],
    imgs: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=700',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=700',
      'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=700',
    ]
  },
  {
    name: 'Varanasi', country: 'India', tag: '🕌 Spiritual',
    desc: 'One of the world\'s oldest living cities, the spiritual capital of India on the banks of the sacred Ganges.',
    bestTime: 'Nov – Feb', language: 'Hindi', currency: 'INR',
    highlights: ['Ganga Aarti', 'Kashi Vishwanath', 'Sarnath', 'Boat Rides'],
    imgs: [
      'https://images.unsplash.com/photo-1561361058-c24e01238a46?w=700',
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=700',
      'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=700',
    ]
  },
  {
    name: 'Goa', country: 'India', tag: '🏖️ Beach',
    desc: 'India\'s beach paradise — golden sands, Portuguese heritage, vibrant nightlife, and fresh seafood.',
    bestTime: 'Nov – Feb', language: 'Konkani', currency: 'INR',
    highlights: ['Baga Beach', 'Old Goa Churches', 'Dudhsagar Falls', 'Anjuna Market'],
    imgs: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700',
      'https://images.unsplash.com/photo-1587922546307-776227941871?w=700',
      'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=700',
    ]
  },
  {
    name: 'Udaipur', country: 'India', tag: '🏙️ City of Lakes',
    desc: 'The Venice of the East — a romantic city of shimmering lakes, white marble palaces, and Rajput grandeur.',
    bestTime: 'Sep – Mar', language: 'Hindi', currency: 'INR',
    highlights: ['Lake Pichola', 'City Palace', 'Jag Mandir', 'Saheliyon ki Bari'],
    imgs: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=700',
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=700',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=700',
    ]
  },
  {
    name: 'Rishikesh', country: 'India', tag: '🧘 Wellness',
    desc: 'The yoga capital of the world, nestled in the Himalayas — adventure sports, ashrams, and the holy Ganges.',
    bestTime: 'Feb – May', language: 'Hindi', currency: 'INR',
    highlights: ['Laxman Jhula', 'River Rafting', 'Beatles Ashram', 'Triveni Ghat'],
    imgs: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=700',
      'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=700',
      'https://images.unsplash.com/photo-1591018533408-f8a4f1b5e3e5?w=700',
    ]
  },
  {
    name: 'Kyoto', country: 'Japan', tag: '⛩️ Culture',
    desc: 'Japan\'s ancient imperial capital — thousands of temples, traditional tea houses, and breathtaking bamboo groves.',
    bestTime: 'Mar – May', language: 'Japanese', currency: 'JPY',
    highlights: ['Fushimi Inari', 'Arashiyama', 'Kinkaku-ji', 'Gion District'],
    imgs: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=700',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=700',
    ]
  },
  {
    name: 'Santorini', country: 'Greece', tag: '🌅 Scenic',
    desc: 'The iconic Greek island of whitewashed buildings, blue-domed churches, and spectacular Aegean sunsets.',
    bestTime: 'Apr – Oct', language: 'Greek', currency: 'EUR',
    highlights: ['Oia Sunset', 'Caldera Views', 'Red Beach', 'Wine Tasting'],
    imgs: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=700',
      'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=700',
    ]
  },
  {
    name: 'Marrakech', country: 'Morocco', tag: '🕌 Exotic',
    desc: 'The Red City — a sensory explosion of spice-filled souks, ornate riads, and ancient medina streets.',
    bestTime: 'Mar – May', language: 'Arabic', currency: 'MAD',
    highlights: ['Jemaa el-Fna', 'Majorelle Garden', 'Bahia Palace', 'Souks'],
    imgs: [
      'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=700',
      'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=700',
      'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=700',
    ]
  },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />

    <!-- Hero -->
    <section class="hero">
      <div class="hero-slideshow">
        <div *ngFor="let s of heroSlides" class="slide" [style.background-image]="'url(' + s + ')'"></div>
      </div>
      <div class="hero-overlay"></div>
      <div class="hero-content" style="padding:0 20px;">
        <div style="font-size:13px;font-weight:700;color:#e8472a;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Welcome back, {{ auth.user()?.name?.split(' ')[0] }} 👋</div>
        <h1>Your Next Adventure<br>Starts Here</h1>
        <p>Explore locals, find stays, and connect with the world.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <a routerLink="/locals" style="display:inline-block;padding:14px 32px;border-radius:10px;background:#e8472a;color:#fff;font-weight:800;font-size:15px;box-shadow:0 4px 20px rgba(232,71,42,0.4);">Explore Locals</a>
          <a routerLink="/map" style="display:inline-block;padding:14px 32px;border-radius:10px;border:2px solid rgba(255,255,255,0.4);color:#fff;font-weight:700;font-size:15px;">Open Map</a>
        </div>
      </div>
    </section>

    <!-- Photo Strip -->
    <section class="photo-strip">
      <div style="text-align:center;margin-bottom:24px;">
        <h2 style="font-size:24px;font-weight:800;">Discover Destinations</h2>
        <p style="color:#888;font-size:14px;margin-top:4px;">Click any place to explore</p>
      </div>
      <div class="strip-track">
        <div *ngFor="let p of stripPlaces" class="strip-item" (click)="openPlace(p)">
          <img [src]="p.imgs[0]" [alt]="p.name" loading="lazy" />
          <span>{{ p.name }}</span>
        </div>
      </div>
    </section>

    <!-- Feature Cards -->
    <section style="padding:60px 40px 80px;max-width:1200px;margin:0 auto;">
      <div style="margin-bottom:32px;">
        <div style="font-size:12px;font-weight:700;color:#e8472a;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">QUICK ACCESS</div>
        <h2 style="font-size:28px;font-weight:900;margin:0;">What would you like to do?</h2>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">

        <!-- Find Locals -->
        <a routerLink="/locals" class="quick-card qc-blue">
          <div class="qc-blob"></div>
          <div class="qc-inner">
            <div class="qc-icon" style="background:rgba(59,130,246,0.2);border-color:rgba(59,130,246,0.3);">🌍</div>
            <div class="qc-title">Find Locals</div>
            <div class="qc-desc">Browse verified local hosts in any city around the world.</div>
            <div class="qc-link" style="color:#3b82f6;">Explore now →</div>
          </div>
        </a>

        <!-- Map -->
        <a routerLink="/map" class="quick-card qc-green">
          <div class="qc-blob"></div>
          <div class="qc-inner">
            <div class="qc-icon" style="background:rgba(34,197,94,0.2);border-color:rgba(34,197,94,0.3);">🗺️</div>
            <div class="qc-title">Explore Map</div>
            <div class="qc-desc">See locals pinned on an interactive world map. Search any city.</div>
            <div class="qc-link" style="color:#22c55e;">Open map →</div>
          </div>
        </a>

        <!-- Q&A -->
        <a routerLink="/questions" class="quick-card qc-orange">
          <div class="qc-blob"></div>
          <div class="qc-inner">
            <div class="qc-icon" style="background:rgba(232,71,42,0.2);border-color:rgba(232,71,42,0.3);">❓</div>
            <div class="qc-title">Ask Questions</div>
            <div class="qc-desc">Get local tips, travel advice, and answers from the community.</div>
            <div class="qc-link" style="color:#e8472a;">Ask now →</div>
          </div>
        </a>

        <!-- Messages -->
        <a routerLink="/inbox" class="quick-card qc-purple">
          <div class="qc-blob"></div>
          <div class="qc-inner">
            <div class="qc-icon" style="background:rgba(168,85,247,0.2);border-color:rgba(168,85,247,0.3);">💬</div>
            <div class="qc-title">Messages</div>
            <div class="qc-desc">Chat with your hosts and fellow travelers anytime.</div>
            <div class="qc-link" style="color:#a855f7;">Open inbox →</div>
          </div>
        </a>

      </div>
    </section>

    <!-- Place Modal -->
    <div *ngIf="selectedPlace" class="modal-backdrop" (click)="closePlace($event)">
      <div class="place-modal" (click)="$event.stopPropagation()">

        <!-- Image gallery -->
        <div style="position:relative;height:260px;overflow:hidden;border-radius:16px 16px 0 0;background:#111;">
          <img [src]="selectedPlace.imgs[galleryIdx]" style="width:100%;height:100%;object-fit:cover;transition:opacity 0.3s;" [alt]="selectedPlace.name" />
          <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.55) 100%);"></div>

          <!-- Close -->
          <button (click)="selectedPlace=null" style="position:absolute;top:14px;right:14px;background:rgba(0,0,0,0.45);border:none;color:#fff;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);">✕</button>

          <!-- Tag -->
          <div style="position:absolute;top:14px;left:14px;background:rgba(0,0,0,0.45);backdrop-filter:blur(4px);color:#fff;padding:4px 12px;border-radius:50px;font-size:12px;font-weight:700;">{{ selectedPlace.tag }}</div>

          <!-- Thumbnail strip -->
          <div style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:6px;">
            <div *ngFor="let img of selectedPlace.imgs; let i=index"
              (click)="galleryIdx=i"
              style="cursor:pointer;border-radius:6px;overflow:hidden;transition:all 0.2s;border:2px solid;"
              [style.border-color]="galleryIdx===i?'#fff':'transparent'"
              [style.opacity]="galleryIdx===i?'1':'0.6'">
              <img [src]="img" style="width:48px;height:34px;object-fit:cover;display:block;" [alt]="selectedPlace.name" />
            </div>
          </div>

          <!-- Prev/Next -->
          <button *ngIf="selectedPlace.imgs.length > 1" (click)="prevImg()" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.4);border:none;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;backdrop-filter:blur(4px);">‹</button>
          <button *ngIf="selectedPlace.imgs.length > 1" (click)="nextImg()" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.4);border:none;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;backdrop-filter:blur(4px);">›</button>
        </div>

        <!-- Content -->
        <div style="padding:22px 24px 24px;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px;">
            <div>
              <h2 style="font-size:22px;font-weight:900;margin:0 0 2px;">{{ selectedPlace.name }}</h2>
              <div style="font-size:13px;color:#888;">📍 {{ selectedPlace.country }}</div>
            </div>
            <button class="btn-primary" style="padding:9px 18px;font-size:13px;white-space:nowrap;flex-shrink:0;" (click)="openOnMap(selectedPlace.name)">🗺️ Open on Map</button>
          </div>

          <p style="font-size:14px;color:#555;line-height:1.7;margin-bottom:18px;">{{ selectedPlace.desc }}</p>

          <!-- Info chips -->
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;">
            <div style="background:#f5f5f5;border-radius:8px;padding:8px 14px;font-size:12px;">
              <div style="color:#aaa;font-weight:600;margin-bottom:2px;">BEST TIME</div>
              <div style="font-weight:700;color:#333;">{{ selectedPlace.bestTime }}</div>
            </div>
            <div style="background:#f5f5f5;border-radius:8px;padding:8px 14px;font-size:12px;">
              <div style="color:#aaa;font-weight:600;margin-bottom:2px;">LANGUAGE</div>
              <div style="font-weight:700;color:#333;">{{ selectedPlace.language }}</div>
            </div>
            <div style="background:#f5f5f5;border-radius:8px;padding:8px 14px;font-size:12px;">
              <div style="color:#aaa;font-weight:600;margin-bottom:2px;">CURRENCY</div>
              <div style="font-weight:700;color:#333;">{{ selectedPlace.currency }}</div>
            </div>
          </div>

          <!-- Highlights -->
          <div>
            <div style="font-size:12px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Top Highlights</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <span *ngFor="let h of selectedPlace.highlights" style="background:#fff0ee;color:#e8472a;border:1px solid #ffd0c8;padding:5px 12px;border-radius:50px;font-size:12px;font-weight:600;">{{ h }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── HOW IT WORKS ── -->
    <section style="padding:48px 40px;position:relative;overflow:hidden;">
      <div style="position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600');background-size:cover;background-position:center;"></div>
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0.72);backdrop-filter:blur(1px);"></div>
      <div style="max-width:900px;margin:0 auto;text-align:center;position:relative;z-index:1;">
        <div style="font-size:11px;font-weight:700;color:#e8472a;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">SIMPLE PROCESS</div>
        <h2 style="font-size:24px;font-weight:900;margin-bottom:36px;color:#fff;">How CouchConnect works</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0;position:relative;">
          <div style="position:absolute;top:28px;left:20%;right:20%;height:2px;background:linear-gradient(to right,#e8472a,#ff7a5c);z-index:0;"></div>
          <div *ngFor="let s of howSteps; let i=index" style="position:relative;z-index:1;padding:0 20px;">
            <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#e8472a,#ff7a5c);color:#fff;font-size:22px;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;box-shadow:0 6px 18px rgba(232,71,42,0.4);">{{s.icon}}</div>
            <div style="font-size:10px;font-weight:800;color:#e8472a;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">Step {{i+1}}</div>
            <h3 style="font-size:15px;font-weight:800;margin-bottom:6px;color:#fff;">{{s.title}}</h3>
            <p style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">{{s.desc}}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── COMMUNITY STATS ── -->
    <section style="background:linear-gradient(135deg,#e8472a 0%,#c93a20 100%);padding:32px 40px;">
      <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:0;text-align:center;">
        <div style="padding:0 16px;border-right:1px solid rgba(255,255,255,0.15);">
          <div style="font-size:28px;font-weight:900;color:#fff;line-height:1;">{{siteStats?.totalUsers || '...'}}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:4px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Members</div>
        </div>
        <div style="padding:0 16px;border-right:1px solid rgba(255,255,255,0.15);">
          <div style="font-size:28px;font-weight:900;color:#fff;line-height:1;">{{siteStats?.totalCities || '...'}}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:4px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Cities</div>
        </div>
        <div style="padding:0 16px;border-right:1px solid rgba(255,255,255,0.15);">
          <div style="font-size:28px;font-weight:900;color:#fff;line-height:1;">{{siteStats?.totalStays || '...'}}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:4px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Stays Hosted</div>
        </div>
        <div style="padding:0 16px;">
          <div style="font-size:28px;font-weight:900;color:#fff;line-height:1;">{{siteStats?.avgRating || '...'}}★</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:4px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Avg Rating</div>
        </div>
      </div>
    </section>

    <!-- ── FEATURED LOCALS ── -->
    <section style="padding:80px 40px;max-width:1200px;margin:0 auto;">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:32px;flex-wrap:wrap;gap:12px;">
        <div>
          <div style="font-size:12px;font-weight:700;color:#e8472a;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">MEET THE COMMUNITY</div>
          <h2 style="font-size:28px;font-weight:900;margin:0;">Featured Locals</h2>
        </div>
        <a routerLink="/locals" style="font-size:14px;font-weight:700;color:#e8472a;text-decoration:none;">View all →</a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;">
        <div *ngFor="let l of featuredLocals" class="card" style="text-align:center;padding:28px 20px;">
          <div style="position:relative;display:inline-block;margin-bottom:14px;">
            <img *ngIf="l.photo" [src]="l.photo" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #e8472a;" [alt]="l.name" />
            <div *ngIf="!l.photo" style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#e8472a,#ff7a5c);color:#fff;font-size:26px;font-weight:800;display:flex;align-items:center;justify-content:center;">{{l.name?.charAt(0)}}</div>
            <span style="position:absolute;bottom:2px;right:2px;width:18px;height:18px;background:#22c55e;border-radius:50%;border:2px solid #fff;display:block;"></span>
          </div>
          <div style="font-weight:800;font-size:15px;margin-bottom:4px;">{{l.name}}</div>
          <div *ngIf="l.city" style="font-size:12px;color:#888;margin-bottom:10px;">📍 {{l.city}}</div>
          <div *ngIf="l.bio" style="font-size:12px;color:#aaa;line-height:1.6;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">{{l.bio}}</div>
          <a [routerLink]="['/profile', l.userId]" style="display:inline-block;padding:7px 18px;border-radius:8px;background:#fff0ee;color:#e8472a;font-size:12px;font-weight:700;text-decoration:none;border:1px solid #ffd0c8;transition:all 0.2s;">View Profile</a>
        </div>
        <!-- Skeleton placeholders while loading -->
        <div *ngFor="let i of skeletons" style="background:#fff;border:1px solid #eee;border-radius:14px;padding:28px 20px;text-align:center;">
          <div style="width:72px;height:72px;border-radius:50%;background:#f0f0f0;margin:0 auto 14px;animation:pulse 1.4s infinite;"></div>
          <div style="height:14px;width:60%;background:#f0f0f0;border-radius:6px;margin:0 auto 8px;animation:pulse 1.4s infinite;"></div>
          <div style="height:12px;width:40%;background:#f0f0f0;border-radius:6px;margin:0 auto;animation:pulse 1.4s infinite;"></div>
        </div>
      </div>
    </section>

    <!-- ── TRENDING CITIES ── -->
    <section style="padding:0 40px 80px;max-width:1200px;margin:0 auto;">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
        <div>
          <div style="font-size:11px;font-weight:700;color:#e8472a;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">POPULAR RIGHT NOW</div>
          <h2 style="font-size:28px;font-weight:900;margin:0;">Trending Cities</h2>
        </div>
        <a routerLink="/map" style="font-size:13px;font-weight:700;color:#e8472a;text-decoration:none;display:flex;align-items:center;gap:4px;">View on Map →</a>
      </div>

      <!-- Magazine grid -->
      <div style="display:grid;grid-template-columns:1.6fr 1fr;grid-template-rows:204px 204px;gap:12px;">

        <!-- Hero card — Jaipur -->
        <div (click)="goToCity(trendingCities[0])" style="grid-row:1/3;position:relative;border-radius:18px;overflow:hidden;cursor:pointer;"
          onmouseover="this.querySelector('.city-overlay').style.opacity='1';this.querySelector('img').style.transform='scale(1.04)'"
          onmouseout="this.querySelector('.city-overlay').style.opacity='0';this.querySelector('img').style.transform='scale(1)'">
          <img [src]="trendingCities[0].img" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.5s;" [alt]="trendingCities[0].name" />
          <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.1) 50%,transparent 100%);"></div>
          <div class="city-overlay" style="position:absolute;inset:0;background:rgba(232,71,42,0.15);opacity:0;transition:opacity 0.3s;"></div>
          <div style="position:absolute;top:16px;left:16px;background:rgba(232,71,42,0.9);backdrop-filter:blur(4px);color:#fff;font-size:11px;font-weight:800;padding:4px 12px;border-radius:50px;letter-spacing:0.5px;">🔥 #1 TRENDING</div>
          <div style="position:absolute;bottom:0;left:0;right:0;padding:24px;">
            <div style="color:rgba(255,255,255,0.7);font-size:12px;font-weight:600;margin-bottom:4px;">{{trendingCities[0].country}}</div>
            <div style="color:#fff;font-size:28px;font-weight:900;line-height:1;margin-bottom:10px;">{{trendingCities[0].name}}</div>
            <span style="background:rgba(255,255,255,0.15);backdrop-filter:blur(4px);color:#fff;font-size:12px;padding:5px 14px;border-radius:50px;border:1px solid rgba(255,255,255,0.25);">🗺️ Explore on Map</span>
          </div>
        </div>

        <!-- Right top — Bali -->
        <div (click)="goToCity(trendingCities[1])" style="position:relative;border-radius:14px;overflow:hidden;cursor:pointer;"
          onmouseover="this.querySelector('img').style.transform='scale(1.06)'"
          onmouseout="this.querySelector('img').style.transform='scale(1)'">
          <img [src]="trendingCities[1].img" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.4s;" [alt]="trendingCities[1].name" />
          <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 60%);"></div>
          <div style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.45);backdrop-filter:blur(4px);color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:50px;">🔥 Trending</div>
          <div style="position:absolute;bottom:14px;left:14px;">
            <div style="color:rgba(255,255,255,0.65);font-size:11px;font-weight:600;">{{trendingCities[1].country}}</div>
            <div style="color:#fff;font-size:18px;font-weight:800;">{{trendingCities[1].name}}</div>
          </div>
        </div>

        <!-- Right bottom — Istanbul -->
        <div (click)="goToCity(trendingCities[2])" style="position:relative;border-radius:14px;overflow:hidden;cursor:pointer;"
          onmouseover="this.querySelector('img').style.transform='scale(1.06)'"
          onmouseout="this.querySelector('img').style.transform='scale(1)'">
          <img [src]="trendingCities[2].img" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.4s;" [alt]="trendingCities[2].name" />
          <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 60%);"></div>
          <div style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.45);backdrop-filter:blur(4px);color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:50px;">🔥 Trending</div>
          <div style="position:absolute;bottom:14px;left:14px;">
            <div style="color:rgba(255,255,255,0.65);font-size:11px;font-weight:600;">{{trendingCities[2].country}}</div>
            <div style="color:#fff;font-size:18px;font-weight:800;">{{trendingCities[2].name}}</div>
          </div>
        </div>

      </div>

      <!-- Bottom row — 3 equal cards -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:12px;">
        <div *ngFor="let c of trendingCities.slice(3,6)" (click)="goToCity(c)"
          style="position:relative;border-radius:14px;overflow:hidden;cursor:pointer;height:160px;"
          onmouseover="this.querySelector('img').style.transform='scale(1.06)'"
          onmouseout="this.querySelector('img').style.transform='scale(1)'">
          <img [src]="c.img" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.4s;" [alt]="c.name" />
          <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 60%);"></div>
          <div style="position:absolute;bottom:12px;left:12px;">
            <div style="color:rgba(255,255,255,0.6);font-size:10px;font-weight:600;">{{c.country}}</div>
            <div style="color:#fff;font-size:15px;font-weight:800;">{{c.name}}</div>
          </div>
          <div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.4);backdrop-filter:blur(4px);color:#fff;font-size:9px;font-weight:700;padding:2px 8px;border-radius:50px;">🔥</div>
        </div>
      </div>
    </section>

    <!-- ── TRAVEL TIPS ── -->
    <section style="padding:0 40px 80px;max-width:1200px;margin:0 auto;">
      <div style="margin-bottom:28px;">
        <div style="font-size:12px;font-weight:700;color:#e8472a;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">FROM THE BLOG</div>
        <h2 style="font-size:28px;font-weight:900;margin:0;">Travel Tips & Guides</h2>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">
        <div *ngFor="let t of travelTips" class="card" style="padding:0;overflow:hidden;cursor:pointer;">
          <img [src]="t.img" style="width:100%;height:180px;object-fit:cover;" [alt]="t.title" loading="lazy" />
          <div style="padding:20px;">
            <span style="background:#fff0ee;color:#e8472a;font-size:11px;font-weight:700;padding:3px 10px;border-radius:50px;border:1px solid #ffd0c8;">{{t.tag}}</span>
            <h3 style="font-size:16px;font-weight:800;margin:10px 0 8px;line-height:1.4;">{{t.title}}</h3>
            <p style="font-size:13px;color:#888;line-height:1.6;margin-bottom:14px;">{{t.excerpt}}</p>
            <div style="font-size:12px;color:#aaa;">{{t.readTime}} · {{t.date}}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA BANNER ── -->
    <section style="margin:0 40px 80px;border-radius:20px;overflow:hidden;position:relative;background:linear-gradient(135deg,#1a1a2e,#16213e);padding:60px 48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px;">
      <div style="position:absolute;top:-40px;right:-40px;width:200px;height:200px;border-radius:50%;background:rgba(232,71,42,0.1);"></div>
      <div style="position:absolute;bottom:-60px;left:20%;width:160px;height:160px;border-radius:50%;background:rgba(59,130,246,0.08);"></div>
      <div style="position:relative;z-index:1;">
        <div style="font-size:12px;font-weight:700;color:#e8472a;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">GET STARTED TODAY</div>
        <h2 style="font-size:28px;font-weight:900;color:#fff;margin:0 0 10px;">Ready to host or travel?</h2>
        <p style="color:#8b9dc3;font-size:14px;max-width:400px;line-height:1.7;margin:0;">Complete your profile, get verified, and start connecting with locals or travelers in your city.</p>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;position:relative;z-index:1;">
        <a routerLink="/profile" class="cta-btn-primary">Complete Profile</a>
        <a routerLink="/locals" [queryParams]="{role:'local'}" class="cta-btn-outline">Browse Locals</a>
      </div>
    </section>

    <app-footer />
  `,
  styles: [`
    :host { display: block; }
    .slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; animation: heroSlide 25s infinite; }
    .slide:nth-child(1){animation-delay:0s} .slide:nth-child(2){animation-delay:5s} .slide:nth-child(3){animation-delay:10s} .slide:nth-child(4){animation-delay:15s} .slide:nth-child(5){animation-delay:20s}
    @keyframes heroSlide{0%,100%{opacity:0;transform:scale(1)}5%,28%{opacity:1}33%{opacity:0;transform:scale(1.06)}}
    :host-context(body.dark) h2, :host-context(body.dark) h3 { color: #f0f0f0; }
    :host-context(body.dark) .card { background: #1a1a1a; border-color: #2a2a2a; }
    :host-context(body.dark) p { color: #aaa; }
    .place-modal {
      background: #fff; border-radius: 16px;
      max-width: 560px; width: 100%;
      max-height: 90vh; overflow-y: auto;
      animation: scaleIn 0.25s cubic-bezier(0.22,1,0.36,1);
      box-shadow: 0 24px 60px rgba(0,0,0,0.3);
    }
    :host-context(body.dark) .place-modal { background: #1a1a1a; }
    :host-context(body.dark) p[style*="color:#555"] { color: #aaa !important; }
    :host-context(body.dark) div[style*="background:#f5f5f5"] { background: #2a2a2a !important; }
    :host-context(body.dark) div[style*="color:#333"] { color: #f0f0f0 !important; }
    :host-context(body.dark) h2 { color: #f0f0f0; }
    @keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    :host-context(body.dark) section[style*="background:#fff"] { background: #111 !important; }
    :host-context(body.dark) .card h3 { color: #f0f0f0; }
    :host-context(body.dark) h3 { color: #f0f0f0; }

    /* CTA buttons */
    .cta-btn-primary { padding:13px 28px;border-radius:10px;background:#e8472a;color:#fff;font-weight:800;font-size:14px;text-decoration:none;box-shadow:0 4px 20px rgba(232,71,42,0.4);transition:background 0.2s; }
    .cta-btn-primary:hover { background:#c93a20; }
    .cta-btn-outline { padding:13px 28px;border-radius:10px;border:1px solid rgba(255,255,255,0.25);color:#fff;font-weight:700;font-size:14px;text-decoration:none;transition:background 0.2s; }
    .cta-btn-outline:hover { background:rgba(255,255,255,0.1); }

    /* Quick action cards */
    .quick-card {
      text-decoration: none; display: block;
      border-radius: 16px; overflow: hidden; position: relative;
      min-height: 180px; border: 1px solid transparent;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    .quick-card:hover { transform: translateY(-4px); }
    .qc-blue  { background: linear-gradient(135deg,#1a1a2e,#16213e); border-color: #2a2a3e; }
    .qc-green { background: linear-gradient(135deg,#0f2027,#203a43); border-color: #1a3a3a; }
    .qc-orange{ background: linear-gradient(135deg,#2d1b00,#3d2800); border-color: #3a2a00; }
    .qc-purple{ background: linear-gradient(135deg,#1a0a2e,#2d1b4e); border-color: #2a1a3e; }
    .qc-blue:hover  { box-shadow: 0 12px 32px rgba(59,130,246,0.25); }
    .qc-green:hover { box-shadow: 0 12px 32px rgba(34,197,94,0.25); }
    .qc-orange:hover{ box-shadow: 0 12px 32px rgba(232,71,42,0.25); }
    .qc-purple:hover{ box-shadow: 0 12px 32px rgba(168,85,247,0.25); }
    .qc-blob { position:absolute;top:-20px;right:-20px;width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,0.04); }
    .qc-inner { padding: 24px; position: relative; z-index: 1; }
    .qc-icon { width:48px;height:48px;border-radius:12px;border:1px solid;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:16px; }
    .qc-title { font-size:17px;font-weight:800;color:#fff;margin-bottom:6px; }
    .qc-desc  { font-size:13px;color:rgba(255,255,255,0.55);line-height:1.5;margin-bottom:16px; }
    .qc-link  { font-size:12px;font-weight:700; }
  `]
})
export class HomeComponent implements OnInit {
  heroSlides = HERO_SLIDES;
  places = PLACES;
  stripPlaces = [...PLACES, ...PLACES];
  selectedPlace: any = null;
  galleryIdx = 0;
  featuredLocals: any[] = [];
  skeletons: number[] = [1, 2, 3, 4];

  siteStats: any = null;

  howSteps = [
    { icon: '👤', title: 'Create Your Profile', desc: 'Sign up, verify your identity, and set up your profile as a traveler or local host.' },
    { icon: '🔍', title: 'Find & Connect', desc: 'Browse verified locals on the map, read profiles, and send a stay request.' },
    { icon: '🏠', title: 'Stay & Explore', desc: 'Chat, plan your trip, and experience the destination through a local\'s eyes.' },
  ];

  stats = [
    { num: '50K+', label: 'Travelers Worldwide' },
    { num: '120+', label: 'Countries' },
    { num: '200K+', label: 'Stays Hosted' },
    { num: '4.9★', label: 'Average Rating' },
  ];

  trendingCities = [
    { name: 'Jaipur', country: 'India', img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400' },
    { name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
    { name: 'Istanbul', country: 'Turkey', img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400' },
    { name: 'Kyoto', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400' },
    { name: 'Lisbon', country: 'Portugal', img: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400' },
    { name: 'Marrakech', country: 'Morocco', img: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400' },
  ];

  travelTips = [
    {
      img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
      tag: 'Safety', title: 'How to Stay Safe While Couchsurfing', readTime: '5 min read', date: 'Mar 2025',
      excerpt: 'Essential tips for verifying hosts, sharing your itinerary, and staying safe during your travels.'
    },
    {
      img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600',
      tag: 'Tips', title: 'Being the Perfect Guest: A Complete Guide', readTime: '4 min read', date: 'Feb 2025',
      excerpt: 'From communication to gratitude — everything you need to know to be a guest your host will remember.'
    },
    {
      img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600',
      tag: 'Hosting', title: 'How to Write a Profile That Gets Requests', readTime: '6 min read', date: 'Jan 2025',
      excerpt: 'Your profile is your first impression. Learn what makes travelers choose one host over another.'
    },
  ];

  constructor(public auth: AuthService, private router: Router, private profileSvc: ProfileService, private http: HttpClient) {}

  ngOnInit() {
    this.profileSvc.listProfiles().subscribe((profiles: any[]) => {
      this.featuredLocals = profiles.filter(p => p.role === 'local' && p.city).slice(0, 4);
      this.skeletons = this.featuredLocals.length < 4 ? Array(4 - this.featuredLocals.length).fill(0) : [];
    });
    this.http.get<any>(`${environment.apiUrl}/stats`).subscribe({
      next: s => this.siteStats = s,
      error: () => {}
    });
  }

  openPlace(p: any) { this.selectedPlace = p; this.galleryIdx = 0; }
  closePlace(e: any) { if (!e || e.target === e.currentTarget) this.selectedPlace = null; }
  nextImg() { this.galleryIdx = (this.galleryIdx + 1) % this.selectedPlace.imgs.length; }
  prevImg() { this.galleryIdx = (this.galleryIdx - 1 + this.selectedPlace.imgs.length) % this.selectedPlace.imgs.length; }
  openOnMap(city: string) { this.selectedPlace = null; this.router.navigate(['/map'], { queryParams: { city } }); }
  goToCity(c: any) { this.router.navigate(['/map'], { queryParams: { city: c.name } }); }
}
