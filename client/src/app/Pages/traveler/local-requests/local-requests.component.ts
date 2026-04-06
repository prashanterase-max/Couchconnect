import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { BackButtonComponent } from '../../../shared/back-button/back-button.component';
import { StayService } from '../../../core/services/stay.service';

@Component({
  selector: 'app-local-requests',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, BackButtonComponent],
  template: `
    <app-navbar />
    <div style="padding-top:80px;max-width:860px;margin:0 auto;padding:80px 24px 60px;">
      <app-back-btn />
      <h1 style="font-size:24px;font-weight:800;margin-bottom:24px;">Incoming Stay Requests</h1>
      <div *ngIf="loading" style="color:#888;text-align:center;padding:40px;">Loading...</div>
      <div *ngIf="!loading && requests.length === 0" style="text-align:center;padding:60px;color:#888;">
        <div style="font-size:48px;margin-bottom:16px;">📬</div>
        <p>No incoming requests yet.</p>
      </div>
      <div *ngFor="let r of requests" class="card" style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:12px;">
          <div>
            <div style="font-weight:700;margin-bottom:4px;">From {{ r.travelerId?.name || 'Traveler' }}</div>
            <div style="font-size:13px;color:#888;">{{ r.fromDate | date:'mediumDate' }} → {{ r.toDate | date:'mediumDate' }}</div>
            <div *ngIf="r.message" style="font-size:13px;color:#555;margin-top:6px;">{{ r.message }}</div>
          </div>
          <span [class]="statusClass(r.status)">{{ r.status }}</span>
        </div>
        <div *ngIf="r.status === 'pending'" style="display:flex;gap:8px;">
          <button class="btn-primary" style="padding:8px 16px;" (click)="respond(r, 'accepted')">Accept</button>
          <button class="btn-outline" style="padding:8px 16px;" (click)="respond(r, 'rejected')">Decline</button>
          <a [routerLink]="['/profile', r.travelerId?._id]" class="btn-ghost" style="padding:8px 0;">View Profile</a>
        </div>
      </div>
    </div>
  `,
  styles: [`:host{display:block;} :host-context(body.dark) h1{color:#f0f0f0;} :host-context(body.dark) .card{background:#1a1a1a;border-color:#2a2a2a;} :host-context(body.dark) div[style*="font-weight:700"]{color:#f0f0f0;}`]
})
export class LocalRequestsComponent implements OnInit {
  requests: any[] = [];
  loading = true;

  constructor(private staySvc: StayService) {}
  ngOnInit() { this.staySvc.localRequests().subscribe(r => { this.requests = r; this.loading = false; }); }
  statusClass(s: string) { return s === 'accepted' ? 'verified-chip' : s === 'rejected' ? 'status-rejected' : 'status-pending'; }
  respond(r: any, status: string) {
    this.staySvc.respond(r._id, status).subscribe(updated => {
      const idx = this.requests.findIndex(x => x._id === r._id);
      if (idx >= 0) this.requests[idx] = updated;
    });
  }
}
