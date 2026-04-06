import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { BackButtonComponent } from '../../../shared/back-button/back-button.component';
import { StayService } from '../../../core/services/stay.service';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-request-stay',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, BackButtonComponent],
  template: `
    <app-navbar />
    <div style="padding-top:80px;max-width:560px;margin:0 auto;padding:80px 24px 60px;">
      <app-back-btn />
      <div *ngIf="localProfile" style="display:flex;align-items:center;gap:14px;margin-bottom:28px;">
        <img *ngIf="localProfile.photo" [src]="localProfile.photo" style="width:56px;height:56px;border-radius:50%;object-fit:cover;" alt="avatar" />
        <div *ngIf="!localProfile.photo" style="width:56px;height:56px;border-radius:50%;background:#e8472a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;">{{ localProfile.name?.charAt(0) }}</div>
        <div>
          <h2 style="font-size:20px;font-weight:800;">Request Stay with {{ localProfile.name }}</h2>
          <div style="color:#888;font-size:13px;">📍 {{ localProfile.city }}</div>
        </div>
      </div>

      <div class="card">
        <div *ngIf="success" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;color:#22c55e;font-weight:700;margin-bottom:16px;">Request sent successfully!</div>
        <div *ngIf="error" style="background:#fff5f5;border:1px solid #ffc0c0;border-radius:8px;padding:12px 16px;color:#ef4444;margin-bottom:16px;">{{ error }}</div>

        <div class="form-group">
          <label>Number of Guests *</label>
          <select [(ngModel)]="form.guestCount">
            <option value="1">1 guest (just me)</option>
            <option value="2">2 guests</option>
            <option value="3">3 guests</option>
            <option value="4">4 guests</option>
          </select>
        </div>
        <div class="form-group">
          <label>Purpose of Visit</label>
          <select [(ngModel)]="form.purpose">
            <option value="">Select purpose...</option>
            <option>Tourism / Sightseeing</option>
            <option>Business / Work</option>
            <option>Cultural Exchange</option>
            <option>Language Learning</option>
            <option>Backpacking</option>
            <option>Other</option>
          </select>
        </div>
        <div class="form-group">
          <label>From Date</label>
          <input type="date" [(ngModel)]="form.fromDate" />
        </div>
        <div class="form-group">
          <label>To Date</label>
          <input type="date" [(ngModel)]="form.toDate" />
        </div>
        <div class="form-group">
          <label>Message</label>
          <textarea [(ngModel)]="form.message" placeholder="Introduce yourself and explain your travel plans..."></textarea>
        </div>
        <button class="btn-primary" (click)="submit()" [disabled]="loading">{{ loading ? 'Sending...' : 'Send Request' }}</button>
      </div>
    </div>
  `,
  styles: [`:host{display:block;} :host-context(body.dark) .card{background:#1a1a1a;border-color:#2a2a2a;} :host-context(body.dark) h2{color:#f0f0f0;}`]
})
export class RequestStayComponent implements OnInit {
  localId = '';
  localProfile: any = null;
  form = { fromDate: '', toDate: '', message: '', guestCount: '1', purpose: '' };
  loading = false; success = false; error = '';

  constructor(private route: ActivatedRoute, private staySvc: StayService, private profileSvc: ProfileService, private router: Router) {}

  ngOnInit() {
    this.localId = this.route.snapshot.paramMap.get('localId')!;
    this.profileSvc.getProfile(this.localId).subscribe(p => this.localProfile = p);
  }

  submit() {
    this.loading = true; this.error = '';
    this.staySvc.sendRequest({ localId: this.localId, ...this.form }).subscribe({
      next: () => { this.success = true; this.loading = false; setTimeout(() => this.router.navigate(['/my-requests']), 1500); },
      error: (e) => { this.error = e.error?.message || 'Failed'; this.loading = false; }
    });
  }
}
