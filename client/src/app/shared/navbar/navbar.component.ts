import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { ProfileService } from '../../core/services/profile.service';
import { ChatService } from '../../core/services/chat.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.scrolled]="scrolled">
      <!-- Logo -->
      <a class="nav-logo" routerLink="/home">
        <span class="logo-icon">🛋️</span>
        <span class="logo-text">CouchConnect</span>
      </a>

      <!-- Center nav links -->
      <div class="nav-center">
        <a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-link">
          <span class="nav-icon">🏠</span> Home
        </a>
        <a routerLink="/locals" routerLinkActive="active" class="nav-link">
          <span class="nav-icon">🌍</span> Explore
        </a>
        <a routerLink="/map" routerLinkActive="active" class="nav-link">
          <span class="nav-icon">🗺️</span> Map
        </a>
        <a routerLink="/questions" routerLinkActive="active" class="nav-link">
          <span class="nav-icon">❓</span> Q&A
        </a>
        <a *ngIf="auth.role==='traveler'" routerLink="/my-requests" routerLinkActive="active" class="nav-link">
          <span class="nav-icon">📋</span> Requests
        </a>
        <a *ngIf="auth.role==='local'" routerLink="/local-requests" routerLinkActive="active" class="nav-link">
          <span class="nav-icon">📬</span> Requests
        </a>
        <a *ngIf="auth.role==='admin'" routerLink="/admin" routerLinkActive="active" class="nav-link nav-link-admin">
          <span class="nav-icon">⚙️</span> Admin
        </a>
      </div>

      <!-- Hamburger (mobile only) -->
      <button class="hamburger" (click)="mobileMenu=!mobileMenu" [class.open]="mobileMenu">
        <span></span><span></span><span></span>
      </button>

      <!-- Mobile menu overlay -->
      <div class="mobile-menu" [class.open]="mobileMenu" (click)="mobileMenu=false">
        <div class="mobile-menu-inner" (click)="$event.stopPropagation()">
          <div style="padding:16px;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:16px;font-weight:900;color:#e8472a;">CouchConnect</span>
            <button (click)="mobileMenu=false" style="background:none;border:none;font-size:20px;cursor:pointer;color:#888;">✕</button>
          </div>
          <nav style="padding:8px 0;">
            <a routerLink="/home" (click)="mobileMenu=false" class="mob-link">🏠 Home</a>
            <a routerLink="/locals" (click)="mobileMenu=false" class="mob-link">🌍 Explore</a>
            <a routerLink="/map" (click)="mobileMenu=false" class="mob-link">🗺️ Map</a>
            <a routerLink="/questions" (click)="mobileMenu=false" class="mob-link">❓ Q&A</a>
            <a routerLink="/inbox" (click)="mobileMenu=false" class="mob-link">💬 Messages</a>
            <a *ngIf="auth.role==='traveler'" routerLink="/my-requests" (click)="mobileMenu=false" class="mob-link">📋 My Requests</a>
            <a *ngIf="auth.role==='local'" routerLink="/local-requests" (click)="mobileMenu=false" class="mob-link">📬 Stay Requests</a>
            <a *ngIf="auth.role==='admin'" routerLink="/admin" (click)="mobileMenu=false" class="mob-link">⚙️ Admin</a>
            <a routerLink="/profile" (click)="mobileMenu=false" class="mob-link">👤 My Profile</a>
            <a routerLink="/verification" (click)="mobileMenu=false" class="mob-link">🛡️ Verification</a>
          </nav>
          <div style="padding:16px;border-top:1px solid #f0f0f0;display:flex;gap:10px;">
            <button class="btn-outline" style="flex:1;" (click)="auth.logout();mobileMenu=false">Sign Out</button>
            <button class="icon-btn" (click)="theme.toggle()">{{theme.dark()?'☀️':'🌙'}}</button>
          </div>
        </div>
      </div>
      <div class="nav-right">
        <!-- Theme toggle -->
        <button class="icon-btn" (click)="theme.toggle()" [title]="theme.dark()?'Light mode':'Dark mode'">
          {{ theme.dark() ? '☀️' : '🌙' }}
        </button>

        <!-- Messages -->
        <a class="icon-btn msg-wrap" routerLink="/inbox" title="Messages">
          💬
          <span class="badge" *ngIf="unreadCount>0">{{unreadCount > 9 ? '9+' : unreadCount}}</span>
        </a>

        <!-- Notifications bell -->
        <div class="icon-btn msg-wrap" style="position:relative;" (click)="notifOpen=!notifOpen;$event.stopPropagation()">
          🔔
          <span class="badge" *ngIf="notifSvc.unreadCount()>0">{{notifSvc.unreadCount() > 9 ? '9+' : notifSvc.unreadCount()}}</span>

          <!-- Notification dropdown -->
          <div *ngIf="notifOpen" class="notif-drop" (click)="$event.stopPropagation()">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid #f0f0f0;">
              <span style="font-weight:800;font-size:14px;">Notifications</span>
              <button *ngIf="notifSvc.unreadCount()>0" (click)="notifSvc.markAllRead()" style="font-size:11px;color:#e8472a;font-weight:700;background:none;border:none;cursor:pointer;">Mark all read</button>
            </div>
            <div style="max-height:320px;overflow-y:auto;">
              <div *ngIf="notifSvc.notifications().length===0" style="padding:32px;text-align:center;color:#aaa;font-size:13px;">No notifications yet</div>
              <div *ngFor="let n of notifSvc.notifications()" (click)="openNotif(n)"
                style="display:flex;gap:10px;padding:12px 16px;cursor:pointer;transition:background 0.15s;border-bottom:1px solid #f5f5f5;"
                [style.background]="n.read?'transparent':'#fff8f7'"
                onmouseover="this.style.background='#f7f7f7'" onmouseout="this.style.background=n.read?'transparent':'#fff8f7'">
                <div style="font-size:20px;flex-shrink:0;margin-top:2px;">{{notifIcon(n.type)}}</div>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:13px;font-weight:700;color:#1a1a1a;margin-bottom:2px;">{{n.title}}</div>
                  <div style="font-size:12px;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{n.body}}</div>
                  <div style="font-size:10px;color:#bbb;margin-top:3px;">{{n.createdAt | date:'shortTime'}}</div>
                </div>
                <div *ngIf="!n.read" style="width:7px;height:7px;border-radius:50%;background:#e8472a;flex-shrink:0;margin-top:6px;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Verify pill -->
        <a *ngIf="auth.user() && !auth.user()?.isVerified" routerLink="/verification" class="verify-pill">
          <span style="font-size:12px;">🛡️</span> Verify
        </a>

        <!-- Verified badge -->
        <span *ngIf="auth.user()?.isVerified" class="verified-pill">✓ Verified</span>

        <!-- Avatar dropdown -->
        <div class="avatar-wrap" (click)="dropOpen=!dropOpen" (clickOutside)="dropOpen=false">
          <div class="avatar-btn">
            <img *ngIf="profilePhoto" [src]="profilePhoto" class="av-img" alt="avatar" />
            <div *ngIf="!profilePhoto" class="av-initial">{{ initial }}</div>
            <div class="av-info">
              <div class="av-name">{{ auth.user()?.name?.split(' ')[0] }}</div>
              <div class="av-role">{{ auth.user()?.role }}</div>
            </div>
            <svg class="av-chevron" [style.transform]="dropOpen?'rotate(180deg)':''" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <!-- Dropdown -->
          <div class="dropdown" *ngIf="dropOpen" (click)="$event.stopPropagation()">
            <div class="drop-header">
              <img *ngIf="profilePhoto" [src]="profilePhoto" class="drop-av" alt="avatar" />
              <div *ngIf="!profilePhoto" class="drop-av-init">{{ initial }}</div>
              <div>
                <div class="drop-name">{{ auth.user()?.name }}</div>
                <div class="drop-email">{{ auth.user()?.email }}</div>
              </div>
            </div>
            <div class="drop-divider"></div>
            <a routerLink="/profile" class="drop-item" (click)="dropOpen=false">👤 My Profile</a>
            <a routerLink="/inbox" class="drop-item" (click)="dropOpen=false">
              💬 Messages
              <span *ngIf="unreadCount>0" class="drop-badge">{{unreadCount}}</span>
            </a>
            <a routerLink="/verification" class="drop-item" (click)="dropOpen=false">🛡️ Verification</a>
            <a *ngIf="auth.role==='traveler'" routerLink="/my-requests" class="drop-item" (click)="dropOpen=false">📋 My Requests</a>
            <a *ngIf="auth.role==='local'" routerLink="/local-requests" class="drop-item" (click)="dropOpen=false">📬 Stay Requests</a>
            <a *ngIf="auth.role==='admin'" routerLink="/admin" class="drop-item" (click)="dropOpen=false">⚙️ Admin Panel</a>
            <div class="drop-divider"></div>
            <button class="drop-item drop-logout" (click)="auth.logout();dropOpen=false">🚪 Sign Out</button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host { display: block; }

    .navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      height: 64px;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 28px;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(0,0,0,0.06);
      transition: box-shadow 0.3s, background 0.3s;
    }
    .navbar.scrolled {
      box-shadow: 0 2px 20px rgba(0,0,0,0.08);
      background: rgba(255,255,255,0.98);
    }
    :host-context(body.dark) .navbar {
      background: rgba(15,15,15,0.92);
      border-color: rgba(255,255,255,0.06);
    }
    :host-context(body.dark) .navbar.scrolled {
      background: rgba(15,15,15,0.98);
      box-shadow: 0 2px 20px rgba(0,0,0,0.3);
    }

    /* Logo */
    .nav-logo {
      display: flex; align-items: center; gap: 8px;
      text-decoration: none; flex-shrink: 0;
    }
    .logo-icon { font-size: 20px; }
    .logo-text {
      font-size: 17px; font-weight: 900; color: #e8472a;
      letter-spacing: -0.3px;
    }

    /* Center links */
    .nav-center {
      display: flex; align-items: center; gap: 2px;
      position: absolute; left: 50%; transform: translateX(-50%);
    }
    .nav-link {
      display: flex; align-items: center; gap: 5px;
      padding: 6px 12px; border-radius: 8px;
      font-size: 13px; font-weight: 600; color: #555;
      text-decoration: none; transition: all 0.2s;
      white-space: nowrap;
    }
    .nav-icon { font-size: 14px; }
    .nav-link:hover { background: #f5f5f5; color: #1a1a1a; }
    .nav-link.active { background: #fff0ee; color: #e8472a; }
    .nav-link-admin.active { background: #fff0ee; color: #e8472a; }
    :host-context(body.dark) .nav-link { color: #888; }
    :host-context(body.dark) .nav-link:hover { background: #1a1a1a; color: #f0f0f0; }
    :host-context(body.dark) .nav-link.active { background: rgba(232,71,42,0.15); color: #e8472a; }

    /* Right side */
    .nav-right {
      display: flex; align-items: center; gap: 6px; flex-shrink: 0;
    }

    /* Icon buttons */
    .icon-btn {
      position: relative;
      width: 36px; height: 36px; border-radius: 10px;
      border: 1px solid #eee; background: transparent;
      font-size: 16px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; text-decoration: none; color: inherit;
    }
    .icon-btn:hover { background: #f5f5f5; border-color: #ddd; }
    :host-context(body.dark) .icon-btn { border-color: #2a2a2a; }
    :host-context(body.dark) .icon-btn:hover { background: #1a1a1a; }

    .msg-wrap { position: relative; }
    .badge {
      position: absolute; top: -5px; right: -5px;
      background: #e8472a; color: #fff;
      font-size: 9px; font-weight: 800;
      min-width: 16px; height: 16px; border-radius: 50px;
      display: flex; align-items: center; justify-content: center;
      padding: 0 3px; border: 2px solid #fff;
    }
    :host-context(body.dark) .badge { border-color: #0f0f0f; }

    /* Verify pill */
    .verify-pill {
      display: flex; align-items: center; gap: 5px;
      padding: 6px 14px; border-radius: 8px;
      background: #fff0ee; border: 1px solid #ffd0c8;
      color: #e8472a; font-size: 12px; font-weight: 700;
      text-decoration: none; transition: all 0.2s; white-space: nowrap;
    }
    .verify-pill:hover { background: #e8472a; color: #fff; border-color: #e8472a; }

    .verified-pill {
      display: flex; align-items: center; gap: 4px;
      padding: 5px 12px; border-radius: 8px;
      background: #f0fdf4; border: 1px solid #bbf7d0;
      color: #16a34a; font-size: 12px; font-weight: 700;
    }

    /* Avatar button */
    .avatar-wrap { position: relative; }
    .avatar-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 5px 10px 5px 5px;
      border-radius: 50px; border: 1px solid #eee;
      background: #fff; cursor: pointer; transition: all 0.2s;
      user-select: none;
    }
    .avatar-btn:hover { border-color: #e8472a; background: #fff8f7; }
    :host-context(body.dark) .avatar-btn { background: #1a1a1a; border-color: #2a2a2a; }
    :host-context(body.dark) .avatar-btn:hover { border-color: #e8472a; }

    .av-img {
      width: 30px; height: 30px; border-radius: 50%;
      object-fit: cover; border: 2px solid #e8472a; flex-shrink: 0;
    }
    .av-initial {
      width: 30px; height: 30px; border-radius: 50%;
      background: linear-gradient(135deg, #e8472a, #ff7a5c);
      color: #fff; font-size: 13px; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .av-info { display: flex; flex-direction: column; }
    .av-name { font-size: 13px; font-weight: 700; color: #1a1a1a; line-height: 1.2; }
    .av-role { font-size: 10px; color: #aaa; text-transform: capitalize; }
    :host-context(body.dark) .av-name { color: #f0f0f0; }
    .av-chevron { color: #aaa; transition: transform 0.2s; flex-shrink: 0; }

    /* Dropdown */
    .dropdown {
      position: absolute; top: calc(100% + 8px); right: 0;
      width: 240px;
      background: #fff; border: 1px solid #eee;
      border-radius: 14px; overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      animation: dropIn 0.18s cubic-bezier(0.22,1,0.36,1);
      z-index: 200;
    }
    :host-context(body.dark) .dropdown { background: #1a1a1a; border-color: #2a2a2a; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
    @keyframes dropIn { from { opacity:0; transform:translateY(-8px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }

    .drop-header {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 16px;
    }
    .drop-av {
      width: 38px; height: 38px; border-radius: 50%;
      object-fit: cover; border: 2px solid #e8472a; flex-shrink: 0;
    }
    .drop-av-init {
      width: 38px; height: 38px; border-radius: 50%;
      background: linear-gradient(135deg, #e8472a, #ff7a5c);
      color: #fff; font-size: 16px; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .drop-name { font-size: 14px; font-weight: 700; color: #1a1a1a; }
    .drop-email { font-size: 11px; color: #aaa; margin-top: 1px; }
    :host-context(body.dark) .drop-name { color: #f0f0f0; }

    .drop-divider { height: 1px; background: #f0f0f0; margin: 2px 0; }
    :host-context(body.dark) .drop-divider { background: #2a2a2a; }

    .drop-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 16px; font-size: 13px; font-weight: 600;
      color: #444; text-decoration: none; cursor: pointer;
      transition: background 0.15s; border: none; background: none;
      width: 100%; text-align: left;
    }
    .drop-item:hover { background: #f7f7f7; color: #1a1a1a; }
    :host-context(body.dark) .drop-item { color: #aaa; }
    :host-context(body.dark) .drop-item:hover { background: #222; color: #f0f0f0; }

    .drop-badge {
      background: #e8472a; color: #fff;
      font-size: 10px; font-weight: 800;
      padding: 1px 7px; border-radius: 50px;
    }
    .drop-logout { color: #ef4444 !important; }
    .drop-logout:hover { background: #fff5f5 !important; }
    :host-context(body.dark) .drop-logout:hover { background: #1a0a0a !important; }

    /* Notification dropdown */
    .notif-drop {
      position: absolute; top: calc(100% + 8px); right: 0;
      width: 320px;
      background: #fff; border: 1px solid #eee;
      border-radius: 14px; overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      animation: dropIn 0.18s cubic-bezier(0.22,1,0.36,1);
      z-index: 200;
    }
    :host-context(body.dark) .notif-drop { background: #1a1a1a; border-color: #2a2a2a; }
    :host-context(body.dark) .notif-drop div[style*="border-bottom:1px solid #f0f0f0"] { border-color: #2a2a2a !important; }
    :host-context(body.dark) .notif-drop div[style*="color:#1a1a1a"] { color: #f0f0f0 !important; }

    @media (max-width: 768px) {
      .nav-center { display: none; }
      .navbar { padding: 0 16px; }
      .av-info { display: none; }
      .av-chevron { display: none; }
      .verify-pill span:last-child { display: none; }
      .hamburger { display: flex; }
      .nav-right .icon-btn:not(.msg-wrap) { display: none; }
      .verify-pill { display: none; }
      .verified-pill { display: none; }
    }

    /* Hamburger */
    .hamburger {
      display: none;
      flex-direction: column; justify-content: center; align-items: center;
      gap: 5px; width: 36px; height: 36px;
      background: none; border: none; cursor: pointer; padding: 4px;
    }
    .hamburger span {
      display: block; width: 20px; height: 2px;
      background: #555; border-radius: 2px; transition: all 0.3s;
    }
    :host-context(body.dark) .hamburger span { background: #aaa; }
    .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* Mobile menu */
    .mobile-menu {
      display: none;
      position: fixed; inset: 0; z-index: 500;
      background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
    }
    .mobile-menu.open { display: block; animation: fadeIn 0.2s; }
    .mobile-menu-inner {
      position: absolute; top: 0; right: 0; bottom: 0;
      width: min(300px, 85vw);
      background: #fff; box-shadow: -4px 0 24px rgba(0,0,0,0.15);
      display: flex; flex-direction: column;
      animation: slideIn 0.25s cubic-bezier(0.22,1,0.36,1);
    }
    :host-context(body.dark) .mobile-menu-inner { background: #1a1a1a; }
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .mob-link {
      display: flex; align-items: center; gap: 10px;
      padding: 13px 20px; font-size: 15px; font-weight: 600;
      color: #333; text-decoration: none; transition: background 0.15s;
    }
    .mob-link:hover { background: #f7f7f8; color: #e8472a; }
    :host-context(body.dark) .mob-link { color: #ccc; }
    :host-context(body.dark) .mob-link:hover { background: #222; }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  profilePhoto = '';
  unreadCount = 0;
  dropOpen = false;
  notifOpen = false;
  scrolled = false;
  mobileMenu = false;

  constructor(
    public auth: AuthService,
    public theme: ThemeService,
    private profileSvc: ProfileService,
    private chatSvc: ChatService,
    public notifSvc: NotificationService,
    private router: Router
  ) {}

  get initial() { return this.auth.user()?.name?.charAt(0)?.toUpperCase() || '?'; }

  ngOnInit() {
    this.profileSvc.getMyProfile().subscribe(p => { this.profilePhoto = p?.photo || ''; });
    this.chatSvc.getInbox().subscribe(inbox => {
      this.unreadCount = inbox.reduce((sum: number, c: any) => sum + (c.unread || 0), 0);
    });
    if (this.auth.isLoggedIn) this.notifSvc.start();
  }

  ngOnDestroy() { this.notifSvc.stop(); }

  notifIcon(type: string) {
    const map: any = { message: '💬', stay_request: '🏠', stay_accepted: '✅', stay_rejected: '❌', verification: '🛡️', rating: '⭐', report: '🚩' };
    return map[type] || '🔔';
  }

  openNotif(n: any) {
    this.notifSvc.markRead(n._id);
    this.notifOpen = false;
    if (n.link) this.router.navigateByUrl(n.link);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event) {
    const target = e.target as HTMLElement;
    if (!target.closest('.avatar-wrap')) this.dropOpen = false;
    if (!target.closest('.msg-wrap')) this.notifOpen = false;
  }

  @HostListener('window:scroll')
  onScroll() { this.scrolled = window.scrollY > 10; }
}
