import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { BackButtonComponent } from '../../../shared/back-button/back-button.component';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChatService } from '../../../core/services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-locals-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar />

    <!-- Hero bar -->
    <div class="explore-hero">
      <div class="explore-hero-inner">
        <div>
          <h1 class="explore-title">Explore Locals</h1>
          <p class="explore-sub">Find verified hosts and travelers around the world</p>
        </div>
        <div class="explore-count" *ngIf="!loading">
          <span class="count-num">{{filtered.length}}</span>
          <span class="count-label">people found</span>
        </div>
      </div>
    </div>

    <div class="explore-body">

      <!-- Filter bar -->
      <div class="filter-bar">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input [(ngModel)]="search" placeholder="Search by name or city..." class="search-input" (ngModelChange)="filter()" />
          <button *ngIf="search" (click)="search='';filter()" class="search-clear">✕</button>
        </div>

        <div class="filter-controls">
          <select [(ngModel)]="roleFilter" class="filter-select" (ngModelChange)="filter()">
            <option value="">All roles</option>
            <option value="local">🏠 Locals only</option>
            <option value="traveler">✈️ Travelers only</option>
          </select>

          <select [(ngModel)]="sortBy" class="filter-select" (ngModelChange)="filter()">
            <option value="newest">🕐 Newest first</option>
            <option value="rating">⭐ Top rated</option>
            <option value="city">📍 By city</option>
          </select>

          <div class="view-toggle">
            <button (click)="viewMode='grid'" [class.active]="viewMode==='grid'" title="Grid view">⊞</button>
            <button (click)="viewMode='list'" [class.active]="viewMode==='list'" title="List view">☰</button>
          </div>
        </div>
      </div>

      <!-- Active filters chips -->
      <div *ngIf="search || roleFilter" class="active-filters">
        <span *ngIf="search" class="filter-chip">🔍 "{{search}}" <button (click)="search='';filter()">✕</button></span>
        <span *ngIf="roleFilter" class="filter-chip">{{roleFilter==='local'?'🏠 Locals':'✈️ Travelers'}} <button (click)="roleFilter='';filter()">✕</button></span>
      </div>

      <!-- Skeleton -->
      <div *ngIf="loading" class="grid-view">
        <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="skel-card">
          <div class="skel-avatar"></div>
          <div class="skel-line w50"></div>
          <div class="skel-line w30"></div>
          <div class="skel-line w70"></div>
        </div>
      </div>

      <!-- Grid view -->
      <div *ngIf="!loading && viewMode==='grid'" class="grid-view">
        <div *ngFor="let p of filtered" class="profile-card" (click)="goProfile(p)">

          <div class="card-body">
            <!-- Avatar -->
            <div class="card-avatar-wrap">
              <img *ngIf="p.photo" [src]="p.photo" class="card-avatar" alt="avatar" />
              <div *ngIf="!p.photo" class="card-avatar-init" [style.background]="avatarGradient(p.name)">
                {{p.name?.charAt(0)?.toUpperCase()||'?'}}
              </div>
              <span *ngIf="isOnline(p)" class="online-dot"></span>
            </div>

            <!-- Info -->
            <div class="card-name">{{p.name || 'User'}}</div>
            <div *ngIf="p.city" class="card-city">📍 {{p.city}}</div>
            <div *ngIf="!p.city" class="card-city no-city">No city set</div>

            <!-- Role + rating -->
            <div class="card-chips">
              <span class="role-chip" [class]="p.role">{{p.role}}</span>
              <span *ngIf="p.ratingCount>0" class="rating-chip">⭐ {{p.rating}}</span>
            </div>

            <!-- Languages -->
            <div *ngIf="p.languages?.length" class="card-langs">
              <span *ngFor="let l of p.languages.slice(0,2)" class="lang-tag">{{l}}</span>
              <span *ngIf="p.languages.length>2" class="lang-tag lang-more">+{{p.languages.length-2}}</span>
            </div>
          </div>

          <!-- Card footer -->
          <div class="card-footer" (click)="$event.stopPropagation()">
            <a [routerLink]="['/profile', p.userId]" class="card-btn card-btn-outline">Profile</a>
            <button class="card-btn card-btn-primary" (click)="chat(p)">💬 Chat</button>
          </div>
        </div>
      </div>

      <!-- List view -->
      <div *ngIf="!loading && viewMode==='list'" class="list-view">
        <div *ngFor="let p of filtered" class="list-card" (click)="goProfile(p)">
          <div style="position:relative;flex-shrink:0;">
            <img *ngIf="p.photo" [src]="p.photo" class="list-avatar" alt="avatar" />
            <div *ngIf="!p.photo" class="list-avatar list-avatar-init" [style.background]="avatarGradient(p.name)">
              {{p.name?.charAt(0)?.toUpperCase()||'?'}}
            </div>
            <span *ngIf="isOnline(p)" style="position:absolute;bottom:1px;right:1px;width:10px;height:10px;border-radius:50%;background:#22c55e;border:2px solid #fff;display:block;"></span>
          </div>
          <div class="list-info">
            <div class="list-name">{{p.name || 'User'}}</div>
            <div class="list-meta">
              <span *ngIf="p.city">📍 {{p.city}}</span>
              <span *ngIf="p.languages?.length">🗣 {{p.languages.slice(0,2).join(', ')}}</span>
              <span *ngIf="p.ratingCount>0" style="color:#b07800;">⭐ {{p.rating}}</span>
            </div>
          </div>
          <div class="list-chips">
            <span class="role-chip" [class]="p.role">{{p.role}}</span>
          </div>
          <div class="list-actions" (click)="$event.stopPropagation()">
            <a [routerLink]="['/profile', p.userId]" class="card-btn card-btn-outline">Profile</a>
            <button class="card-btn card-btn-primary" (click)="chat(p)">Chat</button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="!loading && filtered.length===0" class="empty-state">
        <div style="font-size:56px;margin-bottom:16px;">🔍</div>
        <h3>No results found</h3>
        <p>Try adjusting your search or filters</p>
        <button class="btn-primary" (click)="search='';roleFilter='';filter()">Clear filters</button>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }

    /* Hero */
    .explore-hero {
      padding-top: 64px;
      background: linear-gradient(135deg, #fff8f7 0%, #fff 100%);
      border-bottom: 1px solid #f0f0f0;
    }
    :host-context(body.dark) .explore-hero { background: linear-gradient(135deg, #1a0f0d 0%, #0f0f0f 100%); border-color: #2a2a2a; }
    .explore-hero-inner {
      max-width: 1200px; margin: 0 auto;
      padding: 28px 32px 24px;
      display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px;
    }
    .explore-title { font-size: 28px; font-weight: 900; margin: 0 0 4px; color: #1a1a1a; }
    :host-context(body.dark) .explore-title { color: #f0f0f0; }
    .explore-sub { font-size: 14px; color: #888; margin: 0; }
    .explore-count { text-align: right; }
    .count-num { display: block; font-size: 32px; font-weight: 900; color: #e8472a; line-height: 1; }
    .count-label { font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 0.5px; }

    /* Body */
    .explore-body { max-width: 1200px; margin: 0 auto; padding: 24px 32px 60px; }

    /* Filter bar */
    .filter-bar {
      display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
      background: #fff; border: 1px solid #eee; border-radius: 14px;
      padding: 14px 16px; margin-bottom: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    }
    :host-context(body.dark) .filter-bar { background: #1a1a1a; border-color: #2a2a2a; }

    .search-wrap {
      flex: 1; min-width: 200px;
      display: flex; align-items: center; gap: 8px;
      background: #f7f7f8; border: 1.5px solid #eee; border-radius: 10px;
      padding: 8px 12px; transition: border-color 0.2s;
    }
    .search-wrap:focus-within { border-color: #e8472a; background: #fff; }
    :host-context(body.dark) .search-wrap { background: #111; border-color: #333; }
    .search-icon { font-size: 15px; flex-shrink: 0; }
    .search-input { flex: 1; border: none; background: transparent; font-size: 14px; outline: none; color: #1a1a1a; }
    :host-context(body.dark) .search-input { color: #f0f0f0; }
    .search-clear { background: none; border: none; color: #aaa; cursor: pointer; font-size: 14px; padding: 0; }

    .filter-controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .filter-select {
      padding: 8px 12px; border-radius: 10px; border: 1.5px solid #eee;
      background: #f7f7f8; font-size: 13px; font-weight: 600; color: #555;
      cursor: pointer; outline: none; transition: border-color 0.2s;
    }
    .filter-select:focus { border-color: #e8472a; }
    :host-context(body.dark) .filter-select { background: #111; border-color: #333; color: #aaa; }

    .view-toggle {
      display: flex; gap: 2px; background: #f0f0f0; border-radius: 8px; padding: 3px;
    }
    :host-context(body.dark) .view-toggle { background: #2a2a2a; }
    .view-toggle button {
      width: 32px; height: 32px; border-radius: 6px; border: none;
      background: transparent; font-size: 16px; cursor: pointer; transition: all 0.2s; color: #888;
    }
    .view-toggle button.active { background: #fff; color: #e8472a; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    :host-context(body.dark) .view-toggle button.active { background: #1a1a1a; }

    /* Active filter chips */
    .active-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
    .filter-chip {
      display: flex; align-items: center; gap: 6px;
      background: #fff0ee; border: 1px solid #ffd0c8; color: #e8472a;
      padding: 4px 10px; border-radius: 50px; font-size: 12px; font-weight: 700;
    }
    .filter-chip button { background: none; border: none; color: #e8472a; cursor: pointer; font-size: 12px; padding: 0; line-height: 1; }

    /* Skeleton */
    .skel-card { background: #fff; border: 1px solid #eee; border-radius: 16px; padding: 24px; text-align: center; }
    :host-context(body.dark) .skel-card { background: #1a1a1a; border-color: #2a2a2a; }
    .skel-avatar { width: 72px; height: 72px; border-radius: 50%; background: #e8e8e8; margin: 0 auto 12px; animation: pulse 1.4s infinite; }
    :host-context(body.dark) .skel-avatar { background: #2a2a2a; }
    .skel-line { height: 12px; background: #e8e8e8; border-radius: 6px; margin: 8px auto; animation: pulse 1.4s infinite; }
    :host-context(body.dark) .skel-line { background: #2a2a2a; }
    .w30 { width: 30%; } .w50 { width: 50%; } .w70 { width: 70%; }

    /* Grid */
    .grid-view { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }

    .profile-card {
      background: #fff;
      border: 1px solid #eee;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.25s;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .profile-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.1);
      border-color: #e8472a;
    }
    :host-context(body.dark) .profile-card { background: #1a1a1a; border-color: #2a2a2a; box-shadow: none; }
    :host-context(body.dark) .profile-card:hover { border-color: #e8472a; box-shadow: 0 8px 28px rgba(232,71,42,0.15); }

    .card-body { padding: 24px 16px 14px; text-align: center; flex: 1; }

    .card-avatar-wrap { position: relative; display: inline-block; margin-bottom: 12px; }
    .card-avatar { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.12); display: block; }
    .card-avatar-init { width: 72px; height: 72px; border-radius: 50%; color: #fff; font-size: 26px; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 3px solid #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.12); }
    .online-dot { position: absolute; bottom: 3px; right: 3px; width: 12px; height: 12px; border-radius: 50%; background: #22c55e; border: 2px solid #fff; }

    .card-name { font-weight: 800; font-size: 15px; color: #1a1a1a; margin-bottom: 4px; }
    :host-context(body.dark) .card-name { color: #f0f0f0; }
    .card-city { font-size: 12px; color: #888; margin-bottom: 10px; }
    .no-city { color: #ccc; font-style: italic; }
    :host-context(body.dark) .no-city { color: #444; }
    .card-chips { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin-bottom: 8px; }
    .rating-chip { background: #fffbf0; color: #b07800; border: 1px solid #ffe0a0; padding: 2px 8px; border-radius: 50px; font-size: 11px; font-weight: 700; }
    .card-langs { display: flex; gap: 4px; justify-content: center; flex-wrap: wrap; }
    .lang-tag { background: #f0f0f0; color: #666; padding: 2px 8px; border-radius: 50px; font-size: 11px; }
    :host-context(body.dark) .lang-tag { background: #2a2a2a; color: #888; }
    .lang-more { background: #fff0ee; color: #e8472a; }

    .card-footer { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid #f5f5f5; }
    :host-context(body.dark) .card-footer { border-color: #2a2a2a; }
    .card-btn { flex: 1; padding: 8px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; text-align: center; text-decoration: none; }
    .card-btn-outline { border: 1.5px solid #eee; background: transparent; color: #555; }
    .card-btn-outline:hover { border-color: #e8472a; color: #e8472a; }
    :host-context(body.dark) .card-btn-outline { border-color: #333; color: #aaa; }
    .card-btn-primary { border: none; background: #e8472a; color: #fff; box-shadow: 0 2px 8px rgba(232,71,42,0.25); }
    .card-btn-primary:hover { background: #c93a20; }

    /* List view */
    .list-view { display: flex; flex-direction: column; gap: 10px; }
    .list-card {
      background: #fff; border: 1px solid #eee; border-radius: 12px;
      padding: 14px 18px; display: flex; align-items: center; gap: 14px;
      cursor: pointer; transition: all 0.2s;
    }
    .list-card:hover { border-color: #e8472a; box-shadow: 0 4px 16px rgba(232,71,42,0.08); }
    :host-context(body.dark) .list-card { background: #1a1a1a; border-color: #2a2a2a; }
    :host-context(body.dark) .list-card:hover { border-color: #e8472a; }
    .list-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #e8472a; flex-shrink: 0; }
    .list-avatar-init { display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; color: #fff; }
    .list-info { flex: 1; min-width: 0; }
    .list-name { font-weight: 700; font-size: 15px; color: #1a1a1a; margin-bottom: 3px; }
    :host-context(body.dark) .list-name { color: #f0f0f0; }
    .list-meta { font-size: 12px; color: #888; display: flex; gap: 12px; flex-wrap: wrap; }
    .list-chips { flex-shrink: 0; }
    .list-actions { display: flex; gap: 8px; flex-shrink: 0; }

    /* Empty */
    .empty-state { text-align: center; padding: 80px 20px; color: #888; }
    .empty-state h3 { font-size: 18px; font-weight: 800; color: #1a1a1a; margin: 0 0 8px; }
    :host-context(body.dark) .empty-state h3 { color: #f0f0f0; }
    .empty-state p { margin: 0 0 20px; }

    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @media(max-width:768px) { .explore-body{padding:16px;} .filter-bar{flex-direction:column;align-items:stretch;} .grid-view{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));} }
  `]
})
export class LocalsListComponent implements OnInit {
  profiles: any[] = [];
  filtered: any[] = [];
  loading = true;
  search = '';
  roleFilter = '';
  sortBy = 'newest';
  viewMode = 'grid';

  constructor(private profileSvc: ProfileService, public auth: AuthService, private chatSvc: ChatService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // read ?role= query param to pre-filter
    this.route.queryParams.subscribe(params => {
      if (params['role']) this.roleFilter = params['role'];
    });
    this.profileSvc.clearCache();
    this.profileSvc.listProfiles().subscribe({
      next: (data: any[]) => { this.profiles = data.filter(p => p.role !== 'admin'); this.filter(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  filter() {
    let result = this.profiles.filter(p => {
      const matchSearch = !this.search || p.name?.toLowerCase().includes(this.search.toLowerCase()) || p.city?.toLowerCase().includes(this.search.toLowerCase());
      const matchRole = !this.roleFilter || p.role === this.roleFilter;
      return matchSearch && matchRole;
    });
    if (this.sortBy === 'rating') result = result.sort((a, b) => (b.rating||0) - (a.rating||0));
    else if (this.sortBy === 'city') result = result.sort((a, b) => (a.city||'').localeCompare(b.city||''));
    this.filtered = result;
  }

  goProfile(p: any) { this.router.navigate(['/profile', p.userId]); }

  isOnline(p: any): boolean {
    if (!p.lastSeen) return false;
    return (Date.now() - new Date(p.lastSeen).getTime()) < 5 * 60 * 1000;
  }

  chat(p: any) {
    const myId = this.auth.user()?._id;
    this.router.navigate(['/messages', this.chatSvc.buildChatId(myId, p.userId)]);
  }

  roleColor(role: string) {
    return role === 'local' ? 'linear-gradient(90deg,#22c55e,#16a34a)' : role === 'admin' ? 'linear-gradient(90deg,#e8472a,#c93a20)' : 'linear-gradient(90deg,#3b82f6,#2563eb)';
  }

  avatarGradient(name: string) {
    const colors = ['linear-gradient(135deg,#e8472a,#ff7a5c)', 'linear-gradient(135deg,#3b82f6,#60a5fa)', 'linear-gradient(135deg,#22c55e,#4ade80)', 'linear-gradient(135deg,#a855f7,#c084fc)', 'linear-gradient(135deg,#f59e0b,#fbbf24)'];
    return colors[(name?.charCodeAt(0)||0) % colors.length];
  }
}
