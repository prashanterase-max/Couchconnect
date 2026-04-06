import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, BackButtonComponent],
  template: `
    <app-navbar />
    <div style="padding-top:80px;max-width:700px;margin:0 auto;padding-left:24px;padding-right:24px;padding-bottom:60px;">
      <app-back-btn />
      <h1 style="font-size:24px;font-weight:800;margin-bottom:24px;">Messages</h1>

      <div *ngIf="loading" style="color:#888;text-align:center;padding:40px;">Loading...</div>

      <div *ngIf="!loading && inbox.length === 0" style="text-align:center;padding:60px;color:#888;">
        <div style="font-size:48px;margin-bottom:16px;">💬</div>
        <p>No conversations yet. Start chatting with a local!</p>
        <a routerLink="/locals" class="btn-primary" style="display:inline-block;margin-top:16px;">Find Locals</a>
      </div>

      <div *ngFor="let conv of inbox" style="margin-bottom:8px;">
        <a [routerLink]="['/messages', conv.chatId]" style="display:flex;align-items:center;gap:14px;padding:16px;background:#fff;border:1px solid #eee;border-radius:12px;transition:all 0.2s;text-decoration:none;"
          [style.border-color]="conv.unread > 0 ? '#e8472a' : '#eee'">
          <div style="position:relative;flex-shrink:0;">
            <img *ngIf="conv.otherPhoto" [src]="conv.otherPhoto" style="width:48px;height:48px;border-radius:50%;object-fit:cover;" alt="avatar" />
            <div *ngIf="!conv.otherPhoto" style="width:48px;height:48px;border-radius:50%;background:#e8472a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;">
              {{ conv.otherName?.charAt(0) || '?' }}
            </div>
            <span *ngIf="conv.unread > 0" style="position:absolute;top:-4px;right:-4px;background:#e8472a;color:#fff;font-size:10px;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;">{{ conv.unread }}</span>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;font-size:15px;color:#1a1a1a;">{{ conv.otherName }}</div>
            <div style="font-size:13px;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ conv.lastMessage || 'No messages yet' }}</div>
          </div>
          <div style="font-size:11px;color:#bbb;flex-shrink:0;">{{ conv.lastAt | date:'shortDate' }}</div>
        </a>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    :host-context(body.dark) h1 { color: #f0f0f0; }
    :host-context(body.dark) a[style] { background: #1a1a1a !important; border-color: #2a2a2a !important; }
    :host-context(body.dark) div[style*="color:#1a1a1a"] { color: #f0f0f0 !important; }
  `]
})
export class NewMessageComponent implements OnInit {
  inbox: any[] = [];
  loading = true;

  constructor(private chatSvc: ChatService) {}

  ngOnInit() {
    this.chatSvc.getInbox().subscribe(data => {
      this.inbox = data.sort((a: any, b: any) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
      this.loading = false;
    });
  }
}
