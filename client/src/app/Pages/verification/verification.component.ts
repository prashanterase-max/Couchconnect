import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, BackButtonComponent],
  template: `
    <app-navbar />
    <div style="padding-top:80px;min-height:100vh;background:var(--bg);">
      <div style="max-width:820px;margin:0 auto;padding:40px 24px 80px;">
        <app-back-btn />

        <!-- Header -->
        <div style="margin-bottom:36px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
            <div style="width:40px;height:40px;border-radius:10px;background:#fff0ee;display:flex;align-items:center;justify-content:center;font-size:20px;">🛡️</div>
            <h1 style="font-size:26px;font-weight:900;margin:0;">Identity Verification</h1>
          </div>
          <p style="color:#888;font-size:14px;line-height:1.7;max-width:560px;margin:0;">
            Complete identity verification to unlock full access — appear on the map, send stay requests, and build trust with the community.
          </p>
        </div>

        <!-- Current status card -->
        <div *ngIf="current" style="margin-bottom:28px;border-radius:14px;overflow:hidden;border:1px solid;"
          [style.border-color]="current.status==='approved'?'#bbf7d0':current.status==='pending'?'#ffe0a0':'#ffc0c0'">
          <div style="padding:16px 20px;display:flex;align-items:center;gap:14px;"
            [style.background]="current.status==='approved'?'#f0fdf4':current.status==='pending'?'#fffbf0':'#fff5f5'">
            <div style="font-size:28px;">{{ statusIcon(current.status) }}</div>
            <div style="flex:1;">
              <div style="font-weight:800;font-size:15px;"
                [style.color]="current.status==='approved'?'#166534':current.status==='pending'?'#92400e':'#991b1b'">
                {{ statusLabel(current.status) }}
              </div>
              <div style="font-size:12px;margin-top:2px;"
                [style.color]="current.status==='approved'?'#15803d':current.status==='pending'?'#b45309':'#dc2626'">
                <span *ngIf="current.status==='approved'">Your identity is confirmed. You have full access to all features.</span>
                <span *ngIf="current.status==='pending'">Under review — usually takes 24–48 hours. We'll notify you.</span>
                <span *ngIf="current.status==='rejected'">Verification failed. Please resubmit with a clearer document.</span>
              </div>
            </div>
            <div *ngIf="current.confidence" style="text-align:right;flex-shrink:0;">
              <div style="font-size:22px;font-weight:900;"
                [style.color]="current.status==='approved'?'#166534':current.status==='pending'?'#92400e':'#991b1b'">
                {{ (current.confidence * 100).toFixed(0) }}%
              </div>
              <div style="font-size:11px;color:#aaa;">OCR match</div>
            </div>
          </div>
        </div>

        <!-- Step progress -->
        <div style="display:flex;align-items:center;margin-bottom:32px;gap:0;">
          <ng-container *ngFor="let s of steps; let i=index; let last=last">
            <div style="display:flex;flex-direction:column;align-items:center;min-width:80px;">
              <div style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;transition:all 0.3s;border:2px solid;"
                [style.background]="step>i?'#e8472a':step===i?'#e8472a':'transparent'"
                [style.border-color]="step>=i?'#e8472a':'#ddd'"
                [style.color]="step>=i?'#fff':'#bbb'">
                <span *ngIf="step<=i">{{i+1}}</span>
                <span *ngIf="step>i">✓</span>
              </div>
              <div style="font-size:11px;font-weight:600;margin-top:6px;text-align:center;white-space:nowrap;"
                [style.color]="step>=i?'#e8472a':'#bbb'">{{s}}</div>
            </div>
            <div *ngIf="!last" style="flex:1;height:2px;margin-bottom:20px;transition:background 0.3s;"
              [style.background]="step>i?'#e8472a':'#eee'"></div>
          </ng-container>
        </div>

        <!-- ── STEP 0: Personal Info ── -->
        <div *ngIf="step===0" class="v-card" style="animation:fadeUp 0.35s ease both;">
          <div class="v-card-header">
            <span class="v-step-badge">Step 1</span>
            <h2 class="v-card-title">Personal Information</h2>
            <p class="v-card-sub">Enter details exactly as they appear on your government-issued ID.</p>
          </div>

          <div class="v-grid-2">
            <div class="form-group">
              <label>First Name *</label>
              <input [(ngModel)]="form.firstName" placeholder="As on your ID" />
            </div>
            <div class="form-group">
              <label>Last Name *</label>
              <input [(ngModel)]="form.lastName" placeholder="As on your ID" />
            </div>
            <div class="form-group">
              <label>Date of Birth *</label>
              <input type="date" [(ngModel)]="form.dob" />
            </div>
            <div class="form-group">
              <label>Gender</label>
              <select [(ngModel)]="form.gender">
                <option value="">Select gender</option>
                <option>Male</option><option>Female</option>
                <option>Non-binary</option><option>Prefer not to say</option>
              </select>
            </div>
            <div class="form-group">
              <label>Nationality *</label>
              <input [(ngModel)]="form.nationality" placeholder="e.g. Indian" />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input [(ngModel)]="form.phone" placeholder="+91 98765 43210" />
            </div>
          </div>

          <div class="form-group">
            <label>Permanent Address *</label>
            <textarea [(ngModel)]="form.address" placeholder="House/Flat No., Street, City, State, PIN" style="min-height:80px;"></textarea>
          </div>

          <div class="form-group">
            <label>Current City (if different)</label>
            <input [(ngModel)]="form.currentCity" placeholder="City you currently live in" />
          </div>

          <div class="v-footer">
            <div style="font-size:13px;color:#aaa;">Fields marked * are required</div>
            <button class="btn-primary" (click)="nextStep()"
              [disabled]="!form.firstName||!form.lastName||!form.dob||!form.nationality||!form.address">
              Continue → 
            </button>
          </div>
        </div>

        <!-- ── STEP 1: Document Upload ── -->
        <div *ngIf="step===1" class="v-card" style="animation:fadeUp 0.35s ease both;">
          <div class="v-card-header">
            <span class="v-step-badge">Step 2</span>
            <h2 class="v-card-title">Upload Identity Document</h2>
            <p class="v-card-sub">Choose your document type and upload a clear photo.</p>
          </div>

          <!-- Doc type -->
          <div style="margin-bottom:24px;">
            <label style="display:block;font-size:12px;font-weight:700;color:#666;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.3px;">Document Type *</label>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;">
              <div *ngFor="let d of docTypes" (click)="form.docType=d.value"
                style="padding:16px 12px;border-radius:12px;cursor:pointer;text-align:center;transition:all 0.2s;border:2px solid;"
                [style.border-color]="form.docType===d.value?'#e8472a':'#eee'"
                [style.background]="form.docType===d.value?'#fff0ee':'#fafafa'">
                <div style="font-size:28px;margin-bottom:8px;">{{d.icon}}</div>
                <div style="font-size:12px;font-weight:700;"
                  [style.color]="form.docType===d.value?'#e8472a':'#555'">{{d.label}}</div>
                <div style="font-size:11px;color:#aaa;margin-top:2px;">{{d.hint}}</div>
              </div>
            </div>
          </div>

          <!-- Document ID number -->
          <div class="form-group">
            <label>Document ID Number *</label>
            <input [(ngModel)]="form.docNumber" [placeholder]="docNumberPlaceholder" style="font-family:monospace;letter-spacing:1px;" />
          </div>

          <!-- Upload zone -->
          <div style="margin-bottom:20px;">
            <label style="display:block;font-size:12px;font-weight:700;color:#666;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.3px;">Document Photo *</label>

            <label class="upload-zone" [class.has-file]="!!preview" style="cursor:pointer;display:block;">
              <input type="file" accept="image/*" style="display:none;" (change)="onFile($event)" />

              <div *ngIf="!preview" class="upload-empty">
                <div style="width:56px;height:56px;border-radius:14px;background:#fff0ee;display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 14px;">📄</div>
                <div style="font-weight:700;color:#444;margin-bottom:6px;">Drop your document here</div>
                <div style="font-size:13px;color:#aaa;margin-bottom:16px;">or click to browse files</div>
                <div style="display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:8px;background:#e8472a;color:#fff;font-size:13px;font-weight:700;">
                  📁 Choose File
                </div>
                <div style="margin-top:14px;font-size:11px;color:#ccc;">JPG, PNG, HEIC — max 10MB</div>
              </div>

              <div *ngIf="preview" class="upload-preview">
                <img [src]="preview" style="max-width:100%;max-height:260px;border-radius:10px;object-fit:contain;display:block;margin:0 auto;" alt="document" />
                <div style="margin-top:14px;display:flex;align-items:center;justify-content:center;gap:8px;">
                  <span style="color:#22c55e;font-weight:700;font-size:13px;">✓ Document uploaded</span>
                  <span style="color:#aaa;font-size:12px;">— click to replace</span>
                </div>
              </div>
            </label>
          </div>

          <!-- Tips -->
          <div style="background:#fffbf0;border:1px solid #ffe0a0;border-radius:12px;padding:16px 18px;margin-bottom:24px;">
            <div style="font-weight:700;font-size:13px;color:#b07800;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
              💡 Tips for best OCR results
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
              <div *ngFor="let t of tips" style="display:flex;align-items:flex-start;gap:6px;font-size:12px;color:#888;">
                <span style="color:#e8472a;flex-shrink:0;">•</span> {{t}}
              </div>
            </div>
          </div>

          <div class="v-footer">
            <button class="btn-outline" (click)="step=0">← Back</button>
            <button class="btn-primary" (click)="nextStep()" [disabled]="!preview||!form.docNumber">Continue →</button>
          </div>
        </div>

        <!-- ── STEP 2: Review & Submit ── -->
        <div *ngIf="step===2" class="v-card" style="animation:fadeUp 0.35s ease both;">
          <div class="v-card-header">
            <span class="v-step-badge">Step 3</span>
            <h2 class="v-card-title">Review & Submit</h2>
            <p class="v-card-sub">Confirm your details before submitting for verification.</p>
          </div>

          <!-- Summary grid -->
          <div style="background:#fafafa;border:1px solid #eee;border-radius:12px;padding:20px;margin-bottom:20px;">
            <div style="font-size:12px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:14px;">Personal Details</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
              <div *ngFor="let f of summaryFields">
                <div style="font-size:11px;color:#aaa;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;margin-bottom:3px;">{{f.label}}</div>
                <div style="font-weight:600;font-size:14px;color:#1a1a1a;">{{f.value || '—'}}</div>
              </div>
            </div>
          </div>

          <!-- Document preview -->
          <div style="border:1px solid #eee;border-radius:12px;padding:16px;margin-bottom:20px;display:flex;gap:16px;align-items:center;">
            <img [src]="preview" style="width:90px;height:64px;object-fit:cover;border-radius:8px;border:1px solid #eee;flex-shrink:0;" alt="doc" />
            <div>
              <div style="font-weight:700;font-size:14px;margin-bottom:3px;">{{docTypeLabel}}</div>
              <div style="font-size:13px;color:#888;font-family:monospace;">{{form.docNumber}}</div>
              <div style="font-size:12px;color:#22c55e;margin-top:4px;font-weight:600;">✓ Ready for OCR processing</div>
            </div>
            <button (click)="step=1" style="margin-left:auto;padding:6px 12px;border-radius:6px;border:1px solid #ddd;background:#fff;color:#888;font-size:12px;cursor:pointer;">Change</button>
          </div>

          <!-- Consent -->
          <div style="border:1px solid #eee;border-radius:12px;padding:16px;margin-bottom:24px;display:flex;gap:12px;align-items:flex-start;">
            <input type="checkbox" [(ngModel)]="consent" id="consent"
              style="width:18px;height:18px;margin-top:1px;flex-shrink:0;accent-color:#e8472a;cursor:pointer;" />
            <label for="consent" style="font-size:13px;color:#555;line-height:1.7;cursor:pointer;text-transform:none;letter-spacing:0;font-weight:400;">
              I confirm that all information provided is accurate and the document belongs to me. I consent to CouchConnect processing this data solely for identity verification. My document will not be shared with third parties.
            </label>
          </div>

          <!-- Result banner -->
          <div *ngIf="result" style="margin-bottom:20px;border-radius:12px;padding:18px 20px;border:1px solid;"
            [style.border-color]="result.status==='approved'?'#bbf7d0':result.status==='pending'?'#ffe0a0':'#ffc0c0'"
            [style.background]="result.status==='approved'?'#f0fdf4':result.status==='pending'?'#fffbf0':'#fff5f5'">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
              <span style="font-size:22px;">{{statusIcon(result.status)}}</span>
              <span style="font-weight:800;font-size:16px;"
                [style.color]="result.status==='approved'?'#166534':result.status==='pending'?'#92400e':'#991b1b'">
                {{statusLabel(result.status)}}
              </span>
              <span style="margin-left:auto;font-size:20px;font-weight:900;"
                [style.color]="result.status==='approved'?'#166534':result.status==='pending'?'#92400e':'#991b1b'">
                {{(result.confidence*100).toFixed(0)}}%
              </span>
            </div>
            <div style="font-size:13px;"
              [style.color]="result.status==='approved'?'#15803d':result.status==='pending'?'#b45309':'#dc2626'">
              <span *ngIf="result.status==='approved'">Your identity has been verified. You now have full access.</span>
              <span *ngIf="result.status==='pending'">Our team will review your submission within 24–48 hours.</span>
              <span *ngIf="result.status==='rejected'">Name match confidence too low ({{(result.confidence*100).toFixed(0)}}%). Please resubmit with a clearer image.</span>
            </div>
          </div>

          <div class="v-footer">
            <button class="btn-outline" (click)="step=1" [disabled]="loading">← Back</button>
            <button class="btn-primary" (click)="submit()" [disabled]="loading||!consent" style="min-width:200px;">
              <span *ngIf="!loading" style="display:flex;align-items:center;gap:8px;justify-content:center;">
                🛡️ Submit for Verification
              </span>
              <span *ngIf="loading" style="display:flex;align-items:center;gap:8px;justify-content:center;">
                <span class="spinner"></span> Verifying...
              </span>
            </button>
          </div>
        </div>

        <!-- Privacy footer -->
        <div style="margin-top:24px;display:flex;gap:10px;align-items:flex-start;padding:14px 16px;background:#fafafa;border-radius:10px;border:1px solid #eee;">
          <span style="font-size:18px;flex-shrink:0;">🔒</span>
          <span style="font-size:12px;color:#aaa;line-height:1.6;">
            Your document is processed securely using OCR technology for name matching only. We do not store raw document images beyond the verification process and never share your data with third parties.
          </span>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .v-card {
      background: #fff;
      border: 1px solid #eee;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.05);
    }
    .v-card-header {
      padding: 28px 28px 0;
      margin-bottom: 24px;
    }
    .v-step-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 50px;
      background: #fff0ee;
      color: #e8472a;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }
    .v-card-title {
      font-size: 20px;
      font-weight: 800;
      margin: 0 0 6px;
      color: #1a1a1a;
    }
    .v-card-sub {
      font-size: 13px;
      color: #888;
      margin: 0;
    }
    .v-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      padding: 0 28px;
    }
    .form-group {
      padding: 0 28px;
      margin-bottom: 16px;
    }
    .v-card .form-group:first-of-type { padding-top: 0; }
    .v-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 28px;
      border-top: 1px solid #f0f0f0;
      margin-top: 8px;
      background: #fafafa;
    }

    /* Upload zone */
    .upload-zone {
      border: 2px dashed #ddd;
      border-radius: 14px;
      padding: 32px 24px;
      text-align: center;
      transition: all 0.2s;
      background: #fafafa;
      margin: 0 28px 0;
    }
    .upload-zone:hover { border-color: #e8472a; background: #fff8f7; }
    .upload-zone.has-file { border-color: #22c55e; border-style: solid; background: #f0fdf4; }

    /* Tips, doc type, doc number, consent inside card need padding */
    .v-card > div:not(.v-card-header):not(.v-footer):not(.v-grid-2) {
      padding-left: 28px;
      padding-right: 28px;
    }

    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }

    @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Dark mode */
    :host-context(body.dark) .v-card { background: #1a1a1a; border-color: #2a2a2a; }
    :host-context(body.dark) .v-card-title { color: #f0f0f0; }
    :host-context(body.dark) .v-card-sub { color: #666; }
    :host-context(body.dark) .v-footer { background: #111; border-color: #2a2a2a; }
    :host-context(body.dark) .upload-zone { background: #111; border-color: #333; }
    :host-context(body.dark) .upload-zone:hover { border-color: #e8472a; background: #1a0f0d; }
    :host-context(body.dark) .upload-zone.has-file { background: #0a1f0f; border-color: #22c55e; }
    :host-context(body.dark) div[style*="background:#fafafa"] { background: #111 !important; border-color: #2a2a2a !important; }
    :host-context(body.dark) div[style*="color:#1a1a1a"] { color: #f0f0f0 !important; }
    :host-context(body.dark) div[style*="background:#fffbf0"] { background: #1a1200 !important; }
    :host-context(body.dark) h1 { color: #f0f0f0; }
    :host-context(body.dark) p { color: #aaa; }

    @media (max-width: 600px) {
      .v-grid-2 { grid-template-columns: 1fr; }
      .v-card-header, .v-grid-2, .form-group, .v-footer,
      .upload-zone { padding-left: 16px; padding-right: 16px; }
      .v-card > div:not(.v-card-header):not(.v-footer):not(.v-grid-2) {
        padding-left: 16px; padding-right: 16px;
      }
    }
  `]
})
export class VerificationComponent implements OnInit {
  step = 0;
  steps = ['Personal Info', 'Document', 'Review'];

  docTypes = [
    { value: 'aadhaar',   label: 'Aadhaar',   icon: '🪪', hint: 'India' },
    { value: 'passport',  label: 'Passport',  icon: '📘', hint: 'International' },
    { value: 'driving',   label: "Driver's",  icon: '🚗', hint: 'License' },
    { value: 'voter',     label: 'Voter ID',  icon: '🗳️', hint: 'India' },
  ];

  tips = [
    'All text must be clearly readable',
    'Avoid glare and shadows',
    'Capture the full document',
    'Use natural or bright light',
    'Keep the camera steady',
    'No cropping of edges',
  ];

  form = {
    firstName: '', lastName: '', dob: '', gender: '',
    nationality: 'Indian', phone: '', address: '', currentCity: '',
    docType: 'aadhaar', docNumber: ''
  };

  docImage = '';
  preview = '';
  consent = false;
  loading = false;
  result: any = null;
  current: any = null;

  constructor(private http: HttpClient, private profileSvc: ProfileService) {}

  ngOnInit() {
    this.http.get(`${environment.apiUrl}/verification/me`).subscribe({
      next: (v: any) => { if (v) this.current = v; },
      error: () => {}
    });
  }

  get docTypeLabel() {
    return this.docTypes.find(d => d.value === this.form.docType)?.label || 'Document';
  }

  get docNumberPlaceholder() {
    const map: any = { aadhaar: 'XXXX XXXX XXXX', passport: 'A1234567', driving: 'DL-XXXXXXXXXX', voter: 'ABC1234567' };
    return map[this.form.docType] || 'Document number';
  }

  get summaryFields() {
    return [
      { label: 'Full Name',    value: `${this.form.firstName} ${this.form.lastName}` },
      { label: 'Date of Birth', value: this.form.dob },
      { label: 'Gender',       value: this.form.gender },
      { label: 'Nationality',  value: this.form.nationality },
      { label: 'Phone',        value: this.form.phone },
      { label: 'Current City', value: this.form.currentCity },
      { label: 'Address',      value: this.form.address },
      { label: 'Doc Type',     value: this.docTypeLabel },
    ];
  }

  nextStep() { this.step++; }

  async onFile(e: any) {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await this.profileSvc.compressImage(file, 900, 0.88);
    this.docImage = compressed;
    this.preview = compressed;
  }

  submit() {
    this.loading = true;
    const payload = {
      submittedName: `${this.form.firstName} ${this.form.lastName}`,
      documentImage: this.docImage,
      meta: {
        dob: this.form.dob, gender: this.form.gender,
        nationality: this.form.nationality, phone: this.form.phone,
        address: this.form.address, currentCity: this.form.currentCity,
        docType: this.form.docType, docNumber: this.form.docNumber
      }
    };
    this.http.post<any>(`${environment.apiUrl}/verification`, payload).subscribe({
      next: (res) => { this.result = res; this.current = res.verification; this.loading = false; },
      error: (e) => { this.loading = false; alert(e.error?.message || 'Verification failed. Please try again.'); }
    });
  }

  statusIcon(s: string)  { return s==='approved'?'✅':s==='pending'?'⏳':'❌'; }
  statusLabel(s: string) { return s==='approved'?'Identity Verified':s==='pending'?'Under Review':'Verification Failed'; }
}
