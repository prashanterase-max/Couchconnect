import { Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChatService } from '../../core/services/chat.service';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="chat-root">

      <!-- Header -->
      <div class="chat-header">
        <a routerLink="/inbox" class="back-btn" title="Back to inbox">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </a>

        <div class="header-avatar">
          <img *ngIf="otherProfile?.photo" [src]="otherProfile.photo" alt="avatar" />
          <div *ngIf="!otherProfile?.photo" class="avatar-initial-lg">
            {{ otherProfile?.name?.charAt(0)?.toUpperCase() || '?' }}
          </div>
          <span class="online-dot"></span>
        </div>

        <div class="header-info">
          <div class="header-name">{{ otherProfile?.name || 'Chat' }}</div>
          <div class="header-sub" *ngIf="otherProfile?.city">📍 {{ otherProfile.city }}</div>
          <div class="header-sub" *ngIf="!otherProfile?.city">CouchConnect member</div>
        </div>

        <div class="header-actions">
          <a *ngIf="otherProfile?.userId" [routerLink]="['/profile', otherProfile.userId]"
            style="padding:7px 14px;border-radius:8px;border:1px solid #ddd;font-size:13px;font-weight:600;color:#555;background:#fff;text-decoration:none;transition:all 0.2s;"
            onmouseover="this.style.borderColor='#e8472a';this.style.color='#e8472a'"
            onmouseout="this.style.borderColor='#ddd';this.style.color='#555'">
            View Profile
          </a>
        </div>
      </div>

      <!-- Messages body -->
      <div class="chat-body" #chatBody>

        <!-- Loading -->
        <div *ngIf="loading" class="chat-loading">
          <div class="loading-dots">
            <span></span><span></span><span></span>
          </div>
          <div style="font-size:13px;color:#aaa;margin-top:10px;">Loading messages...</div>
        </div>

        <!-- Empty state -->
        <div *ngIf="!loading && messages.length === 0" class="chat-empty">
          <div style="font-size:48px;margin-bottom:12px;">💬</div>
          <div style="font-weight:700;font-size:16px;margin-bottom:6px;">Start the conversation</div>
          <div style="font-size:13px;color:#aaa;">Say hello to {{ otherProfile?.name || 'your contact' }}</div>
        </div>

        <!-- Date separator helper — group by day -->
        <ng-container *ngFor="let msg of messages; let i = index">
          <!-- Date separator -->
          <div *ngIf="showDateSep(i)" class="date-sep">
            <span>{{ formatDate(msg.createdAt) }}</span>
          </div>

          <!-- Message row -->
          <div class="msg-row" [class.mine]="isMine(msg)">
            <!-- Their avatar -->
            <div *ngIf="!isMine(msg)" class="msg-avatar">
              <img *ngIf="otherProfile?.photo" [src]="otherProfile.photo" alt="avatar" />
              <div *ngIf="!otherProfile?.photo" class="msg-avatar-initial">
                {{ otherProfile?.name?.charAt(0)?.toUpperCase() || '?' }}
              </div>
            </div>

            <div class="msg-col" [class.mine]="isMine(msg)">
              <div class="bubble" [class.mine]="isMine(msg)">
                {{ msg.text }}
              </div>
              <div class="msg-time">{{ msg.createdAt | date:'shortTime' }}</div>
            </div>
          </div>
        </ng-container>

        <!-- Typing indicator placeholder -->
        <div *ngIf="false" class="msg-row">
          <div class="msg-avatar">
            <div class="msg-avatar-initial">?</div>
          </div>
          <div class="bubble typing">
            <span></span><span></span><span></span>
          </div>
        </div>

      </div>

      <!-- Input bar -->
      <div class="chat-input-bar">
        <div class="input-wrap">
          <input
            class="msg-input"
            [(ngModel)]="text"
            placeholder="Type a message..."
            (keyup.enter)="send()"
            [disabled]="sending"
            autocomplete="off"
          />
          <button class="send-btn" (click)="send()" [disabled]="!text.trim() || sending" [class.active]="text.trim()">
            <svg *ngIf="!sending" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
            <span *ngIf="sending" class="spinner"></span>
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; position: fixed; inset: 0; z-index: 200; }

    .chat-root {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #f7f7f8;
    }

    /* ── Header ── */
    .chat-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 20px;
      height: 68px;
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
      box-shadow: 0 1px 8px rgba(0,0,0,0.05);
      flex-shrink: 0;
      z-index: 10;
    }
    .back-btn {
      width: 36px; height: 36px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #555;
      background: #f5f5f5;
      transition: all 0.2s;
      flex-shrink: 0;
      text-decoration: none;
    }
    .back-btn:hover { background: #fff0ee; color: #e8472a; }

    .header-avatar {
      position: relative;
      flex-shrink: 0;
    }
    .header-avatar img,
    .avatar-initial-lg {
      width: 42px; height: 42px;
      border-radius: 50%;
      object-fit: cover;
    }
    .avatar-initial-lg {
      background: linear-gradient(135deg, #e8472a, #ff7a5c);
      color: #fff;
      font-size: 18px;
      font-weight: 800;
      display: flex; align-items: center; justify-content: center;
    }
    .online-dot {
      position: absolute;
      bottom: 1px; right: 1px;
      width: 11px; height: 11px;
      border-radius: 50%;
      background: #22c55e;
      border: 2px solid #fff;
    }

    .header-info { flex: 1; min-width: 0; }
    .header-name { font-weight: 800; font-size: 15px; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .header-sub  { font-size: 12px; color: #aaa; margin-top: 1px; }
    .header-actions { flex-shrink: 0; }

    /* ── Body ── */
    .chat-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-height: 0;
      scroll-behavior: smooth;
    }

    .chat-loading, .chat-empty {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #888;
      padding: 40px;
    }

    .loading-dots { display: flex; gap: 6px; }
    .loading-dots span {
      width: 8px; height: 8px; border-radius: 50%; background: #e8472a;
      animation: bounce 1.2s infinite;
    }
    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }

    /* Date separator */
    .date-sep {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 14px 0 8px;
      color: #bbb;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .date-sep::before, .date-sep::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #eee;
    }

    /* Message rows */
    .msg-row {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      margin-bottom: 4px;
    }
    .msg-row.mine { flex-direction: row-reverse; }

    .msg-avatar img,
    .msg-avatar-initial {
      width: 28px; height: 28px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }
    .msg-avatar-initial {
      background: linear-gradient(135deg, #e8472a, #ff7a5c);
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }

    .msg-col {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      max-width: 65%;
    }
    .msg-col.mine { align-items: flex-end; }

    .bubble {
      padding: 10px 14px;
      border-radius: 18px 18px 18px 4px;
      background: #fff;
      border: 1px solid #eee;
      font-size: 14px;
      line-height: 1.55;
      word-break: break-word;
      color: #1a1a1a;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
      animation: msgIn 0.2s ease;
    }
    .bubble.mine {
      background: #e8472a;
      color: #fff;
      border: none;
      border-radius: 18px 18px 4px 18px;
      box-shadow: 0 2px 10px rgba(232,71,42,0.25);
    }
    @keyframes msgIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }

    .msg-time {
      font-size: 10px;
      color: #ccc;
      margin-top: 3px;
      padding: 0 4px;
    }

    /* Typing dots */
    .bubble.typing {
      display: flex; gap: 4px; align-items: center;
      padding: 12px 16px;
    }
    .bubble.typing span {
      width: 7px; height: 7px; border-radius: 50%; background: #ccc;
      animation: bounce 1.2s infinite;
    }
    .bubble.typing span:nth-child(2) { animation-delay: 0.2s; }
    .bubble.typing span:nth-child(3) { animation-delay: 0.4s; }

    /* ── Input bar ── */
    .chat-input-bar {
      padding: 12px 16px 16px;
      background: #fff;
      border-top: 1px solid #f0f0f0;
      flex-shrink: 0;
    }
    .input-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #f5f5f5;
      border-radius: 50px;
      padding: 6px 6px 6px 18px;
      border: 1.5px solid #eee;
      transition: border-color 0.2s;
    }
    .input-wrap:focus-within { border-color: #e8472a; background: #fff; }

    .msg-input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 14px;
      color: #1a1a1a;
      outline: none;
      padding: 6px 0;
      width: 100%;
    }
    .msg-input::placeholder { color: #bbb; }

    .send-btn {
      width: 40px; height: 40px;
      border-radius: 50%;
      border: none;
      background: #ddd;
      color: #aaa;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .send-btn.active { background: #e8472a; color: #fff; box-shadow: 0 2px 10px rgba(232,71,42,0.35); }
    .send-btn:disabled { cursor: not-allowed; }

    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Dark mode ── */
    :host-context(body.dark) .chat-root { background: #0f0f0f; }
    :host-context(body.dark) .chat-header { background: #1a1a1a; border-color: #2a2a2a; }
    :host-context(body.dark) .header-name { color: #f0f0f0; }
    :host-context(body.dark) .back-btn { background: #2a2a2a; color: #aaa; }
    :host-context(body.dark) .back-btn:hover { background: #3a1a15; color: #e8472a; }
    :host-context(body.dark) .online-dot { border-color: #1a1a1a; }
    :host-context(body.dark) .chat-body { background: #0f0f0f; }
    :host-context(body.dark) .bubble { background: #1a1a1a; border-color: #2a2a2a; color: #f0f0f0; }
    :host-context(body.dark) .bubble.mine { background: #e8472a; color: #fff; border: none; }
    :host-context(body.dark) .date-sep { color: #444; }
    :host-context(body.dark) .date-sep::before, :host-context(body.dark) .date-sep::after { background: #2a2a2a; }
    :host-context(body.dark) .chat-input-bar { background: #1a1a1a; border-color: #2a2a2a; }
    :host-context(body.dark) .input-wrap { background: #111; border-color: #333; }
    :host-context(body.dark) .input-wrap:focus-within { border-color: #e8472a; background: #1a1a1a; }
    :host-context(body.dark) .msg-input { color: #f0f0f0; }
    :host-context(body.dark) .send-btn { background: #2a2a2a; color: #666; }
    :host-context(body.dark) .send-btn.active { background: #e8472a; color: #fff; }
    :host-context(body.dark) .msg-time { color: #444; }
  `]
})
export class MessagesComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatBody') chatBody!: ElementRef;

  messages: any[] = [];
  text = '';
  loading = true;
  sending = false;
  chatId = '';
  otherProfile: any = null;
  private shouldScroll = false;
  private pollInterval: any;

  constructor(
    private route: ActivatedRoute,
    private chatSvc: ChatService,
    private profileSvc: ProfileService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get('chatId')!;
    this.loadMessages();
    this.loadOtherProfile();
    this.chatSvc.markSeen(this.chatId).subscribe();
    // poll for new messages every 5s
    this.pollInterval = setInterval(() => this.pollMessages(), 5000);
  }

  loadMessages() {
    this.chatSvc.getMessages(this.chatId).subscribe(msgs => {
      this.messages = msgs;
      this.loading = false;
      this.shouldScroll = true;
    });
  }

  pollMessages() {
    this.chatSvc.getMessages(this.chatId).subscribe(msgs => {
      if (msgs.length !== this.messages.length) {
        this.messages = msgs;
        this.shouldScroll = true;
        this.chatSvc.markSeen(this.chatId).subscribe();
      }
    });
  }

  loadOtherProfile() {
    const myId = this.auth.user()?._id;
    const parts = this.chatId.split('_');
    const otherId = parts.find(p => p !== myId);
    if (otherId) {
      this.profileSvc.getProfile(otherId).subscribe(p => this.otherProfile = p);
    }
  }

  isMine(msg: any) { return String(msg.senderId) === String(this.auth.user()?._id); }

  showDateSep(i: number): boolean {
    if (i === 0) return true;
    const prev = new Date(this.messages[i - 1].createdAt).toDateString();
    const curr = new Date(this.messages[i].createdAt).toDateString();
    return prev !== curr;
  }

  formatDate(d: any): string {
    const date = new Date(d);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  send() {
    if (!this.text.trim() || this.sending) return;
    const t = this.text.trim();
    this.text = '';
    this.sending = true;
    this.chatSvc.sendMessage(this.chatId, t).subscribe(msg => {
      this.messages.push(msg);
      this.shouldScroll = true;
      this.sending = false;
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScroll && this.chatBody) {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      this.shouldScroll = false;
    }
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }
}
