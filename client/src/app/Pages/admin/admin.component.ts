import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="dash-root">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div style="padding:20px 20px 12px;border-bottom:1px solid #21262d;">
          <div style="font-size:16px;font-weight:800;color:#e8472a;">CouchConnect</div>
          <div style="font-size:11px;color:#8b949e;margin-top:2px;">Admin Dashboard</div>
        </div>
        <nav class="sidebar-nav" style="padding:12px 0;">
          <a [class.active]="tab==='overview'" (click)="tab='overview'">📊 Overview</a>
          <a [class.active]="tab==='activity'" (click)="tab='activity';loadActivity()">⚡ Activity Feed</a>
          <a [class.active]="tab==='users'" (click)="tab='users'">👥 Users</a>
          <a [class.active]="tab==='verifications'" (click)="tab='verifications';loadVerifications()">
            🛡️ Verifications
            <span *ngIf="pendingCount>0" style="margin-left:auto;background:#e8472a;color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:50px;">{{pendingCount}}</span>
          </a>
          <a [class.active]="tab==='questions'" (click)="tab='questions';loadQuestions()">❓ Q&A Posts</a>
          <a [class.active]="tab==='reports'" (click)="tab='reports';loadReports()">
            🚩 Reports
            <span *ngIf="pendingReports>0" style="margin-left:auto;background:#ef4444;color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:50px;">{{pendingReports}}</span>
          </a>
          <a [class.active]="tab==='feedback'" (click)="tab='feedback';loadFeedback()">
            💬 Feedback
            <span *ngIf="newFeedbackCount>0" style="margin-left:auto;background:#3b82f6;color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:50px;">{{newFeedbackCount}}</span>
          </a>
          <a routerLink="/home" style="margin-top:auto;">🏠 Back to App</a>
        </nav>
      </aside>

      <main class="dash-main">

        <!-- ── OVERVIEW ── -->
        <div *ngIf="tab==='overview'">
          <h2 style="font-size:22px;font-weight:800;margin-bottom:24px;color:#e6edf3;">Overview</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:32px;">
            <div class="stat-card" (click)="tab='users'">
              <div style="font-size:11px;font-weight:700;color:#8b949e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Total Users</div>
              <div style="font-size:32px;font-weight:900;color:#e6edf3;">{{stats?.total||0}}</div>
            </div>
            <div class="stat-card">
              <div style="font-size:11px;font-weight:700;color:#8b949e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Locals</div>
              <div style="font-size:32px;font-weight:900;color:#22c55e;">{{stats?.locals||0}}</div>
            </div>
            <div class="stat-card">
              <div style="font-size:11px;font-weight:700;color:#8b949e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Travelers</div>
              <div style="font-size:32px;font-weight:900;color:#3b82f6;">{{stats?.travelers||0}}</div>
            </div>
            <div class="stat-card">
              <div style="font-size:11px;font-weight:700;color:#8b949e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Verified</div>
              <div style="font-size:32px;font-weight:900;color:#22c55e;">{{stats?.verified||0}}</div>
            </div>
            <div class="stat-card" (click)="tab='verifications';loadVerifications()">
              <div style="font-size:11px;font-weight:700;color:#8b949e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Pending Verif.</div>
              <div style="font-size:32px;font-weight:900;color:#e8472a;">{{stats?.pendingVerifications||0}}</div>
            </div>
            <div class="stat-card" (click)="tab='questions';loadQuestions()">
              <div style="font-size:11px;font-weight:700;color:#8b949e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Q&A Posts</div>
              <div style="font-size:32px;font-weight:900;color:#a855f7;">{{stats?.totalQuestions||0}}</div>
            </div>
          </div>

          <!-- Donut -->
          <div style="background:#161b22;border:1px solid #21262d;border-radius:12px;padding:24px;max-width:420px;">
            <h3 style="font-weight:700;margin-bottom:20px;color:#e6edf3;">User Breakdown</h3>
            <div style="display:flex;align-items:center;gap:32px;" *ngIf="stats">
              <div style="position:relative;flex-shrink:0;">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#21262d" stroke-width="20"/>
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#3b82f6" stroke-width="20"
                    [attr.stroke-dasharray]="travelerDash" [attr.stroke-dashoffset]="travelerOffset" transform="rotate(-90 70 70)"/>
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#22c55e" stroke-width="20"
                    [attr.stroke-dasharray]="localDash" [attr.stroke-dashoffset]="localOffset" transform="rotate(-90 70 70)"/>
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#e8472a" stroke-width="20"
                    [attr.stroke-dasharray]="adminDash" [attr.stroke-dashoffset]="adminOffset" transform="rotate(-90 70 70)"/>
                </svg>
                <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                  <div style="font-size:26px;font-weight:900;color:#e6edf3;">{{stats.total}}</div>
                  <div style="font-size:10px;color:#555;text-transform:uppercase;">Total</div>
                </div>
              </div>
              <div style="flex:1;display:flex;flex-direction:column;gap:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <div style="display:flex;align-items:center;gap:8px;"><div style="width:10px;height:10px;border-radius:50%;background:#3b82f6;"></div><span style="font-size:13px;color:#8b949e;">Travelers</span></div>
                  <div><span style="font-size:15px;font-weight:800;color:#3b82f6;">{{stats.travelers}}</span> <span style="font-size:11px;color:#555;">{{pct(stats.travelers)}}%</span></div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <div style="display:flex;align-items:center;gap:8px;"><div style="width:10px;height:10px;border-radius:50%;background:#22c55e;"></div><span style="font-size:13px;color:#8b949e;">Locals</span></div>
                  <div><span style="font-size:15px;font-weight:800;color:#22c55e;">{{stats.locals}}</span> <span style="font-size:11px;color:#555;">{{pct(stats.locals)}}%</span></div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <div style="display:flex;align-items:center;gap:8px;"><div style="width:10px;height:10px;border-radius:50%;background:#e8472a;"></div><span style="font-size:13px;color:#8b949e;">Admins</span></div>
                  <div><span style="font-size:15px;font-weight:800;color:#e8472a;">{{stats.total-stats.locals-stats.travelers}}</span> <span style="font-size:11px;color:#555;">{{pct(stats.total-stats.locals-stats.travelers)}}%</span></div>
                </div>
                <div style="padding-top:12px;border-top:1px solid #21262d;">
                  <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="font-size:12px;color:#8b949e;">Verified</span><span style="font-size:12px;font-weight:700;color:#22c55e;">{{stats.verified}}/{{stats.total}}</span></div>
                  <div style="height:6px;background:#21262d;border-radius:3px;overflow:hidden;"><div style="height:100%;background:#22c55e;border-radius:3px;" [style.width]="stats.total?(stats.verified/stats.total*100)+'%':'0%'"></div></div>
                </div>
              </div>
            </div>
            <div *ngIf="!stats" style="height:140px;display:flex;align-items:center;justify-content:center;color:#555;">Loading...</div>
          </div>
        </div>

        <!-- ── ACTIVITY FEED ── -->
        <div *ngIf="tab==='activity'">
          <h2 style="font-size:22px;font-weight:800;margin-bottom:24px;color:#e6edf3;">Activity Feed</h2>
          <div *ngIf="activityLoading" style="color:#8b949e;padding:40px;text-align:center;">Loading...</div>
          <div style="display:flex;flex-direction:column;gap:0;">
            <div *ngFor="let a of activity; let last=last" style="display:flex;gap:16px;align-items:flex-start;padding:14px 0;" [style.border-bottom]="last?'none':'1px solid #21262d'">
              <div style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;" [style.background]="a.color+'22'">{{a.icon}}</div>
              <div style="flex:1;">
                <div style="font-size:14px;color:#e6edf3;">{{a.text}}</div>
                <div style="font-size:11px;color:#555;margin-top:3px;">{{a.time | date:'medium'}}</div>
              </div>
              <div style="width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:6px;" [style.background]="a.color"></div>
            </div>
          </div>
          <div *ngIf="!activityLoading && activity.length===0" style="color:#555;text-align:center;padding:60px;">No activity yet.</div>
        </div>

        <!-- ── USERS ── -->
        <div *ngIf="tab==='users'">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
            <h2 style="font-size:22px;font-weight:800;color:#e6edf3;">Users</h2>
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
              <input [(ngModel)]="search" placeholder="Search name or email..." style="max-width:220px;margin:0;background:#161b22;border-color:#21262d;color:#e6edf3;" (ngModelChange)="loadUsers()" />
              <select [(ngModel)]="roleFilter" style="max-width:130px;margin:0;background:#161b22;border-color:#21262d;color:#e6edf3;" (ngModelChange)="loadUsers()">
                <option value="">All roles</option>
                <option value="local">Local</option>
                <option value="traveler">Traveler</option>
                <option value="admin">Admin</option>
              </select>
              <button *ngIf="selectedUsers.length>0" style="padding:8px 14px;border-radius:6px;border:none;background:#ef4444;color:#fff;font-size:12px;font-weight:700;cursor:pointer;" (click)="bulkBan()">Ban {{selectedUsers.length}}</button>
              <button *ngIf="selectedUsers.length>0" style="padding:8px 14px;border-radius:6px;border:none;background:#ef4444;color:#fff;font-size:12px;font-weight:700;cursor:pointer;" (click)="bulkDelete()">Delete {{selectedUsers.length}}</button>
              <button style="padding:8px 14px;border-radius:6px;border:1px solid #333;background:transparent;color:#8b949e;font-size:12px;cursor:pointer;" (click)="exportCSV()">⬇ CSV</button>
            </div>
          </div>

          <div style="background:#161b22;border:1px solid #21262d;border-radius:12px;overflow:hidden;">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width:36px;"><input type="checkbox" (change)="toggleAll($event)" style="accent-color:#e8472a;" /></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let u of users" style="cursor:pointer;" [style.background]="selectedUsers.includes(u._id)?'rgba(232,71,42,0.06)':''">
                  <td (click)="$event.stopPropagation()"><input type="checkbox" [checked]="selectedUsers.includes(u._id)" (change)="toggleSelect(u._id)" style="accent-color:#e8472a;" /></td>
                  <td style="color:#e6edf3;font-weight:600;cursor:pointer;" (click)="openUserDetail(u)">{{u.name}}</td>
                  <td style="color:#8b949e;">{{u.email}}</td>
                  <td>
                    <select [(ngModel)]="u.role" (change)="setRole(u)" style="background:#21262d;border:1px solid #333;color:#e6edf3;padding:3px 8px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">
                      <option value="traveler">Traveler</option>
                      <option value="local">Local</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span *ngIf="u.isVerified" class="verified-chip">Verified</span>
                    <span *ngIf="u.isBlacklisted" class="status-rejected">Banned</span>
                    <span *ngIf="!u.isVerified&&!u.isBlacklisted" class="status-pending">{{u.verificationStatus}}</span>
                  </td>
                  <td style="color:#555;font-size:12px;">{{u.createdAt|date:'mediumDate'}}</td>
                  <td>
                    <div style="display:flex;gap:5px;flex-wrap:wrap;">
                      <button *ngIf="!u.isVerified" style="padding:3px 9px;border-radius:5px;border:none;background:#22c55e;color:#fff;font-size:11px;font-weight:700;cursor:pointer;" (click)="action(u,'approve')">✓</button>
                      <button *ngIf="u.isVerified" style="padding:3px 9px;border-radius:5px;border:none;background:#555;color:#fff;font-size:11px;cursor:pointer;" (click)="action(u,'reject')">Revoke</button>
                      <button *ngIf="!u.isBlacklisted" style="padding:3px 9px;border-radius:5px;border:1px solid #333;background:transparent;color:#8b949e;font-size:11px;cursor:pointer;" (click)="action(u,'blacklist')">Ban</button>
                      <button *ngIf="u.isBlacklisted" style="padding:3px 9px;border-radius:5px;border:1px solid #22c55e;background:transparent;color:#22c55e;font-size:11px;cursor:pointer;" (click)="action(u,'unblacklist')">Unban</button>
                      <button style="padding:3px 9px;border-radius:5px;border:none;background:#ef4444;color:#fff;font-size:11px;cursor:pointer;" (click)="action(u,'delete')">Del</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ── VERIFICATIONS ── -->
        <div *ngIf="tab==='verifications'">
          <h2 style="font-size:22px;font-weight:800;margin-bottom:8px;color:#e6edf3;">Verification Requests</h2>
          <p style="color:#8b949e;font-size:13px;margin-bottom:20px;">Review identity submissions and approve or reject.</p>
          <div style="display:flex;gap:8px;margin-bottom:20px;">
            <button *ngFor="let f of ['all','pending','approved','rejected']" (click)="vFilter=f"
              style="padding:6px 16px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;border:1px solid;"
              [style.background]="vFilter===f?'#e8472a':'transparent'" [style.border-color]="vFilter===f?'#e8472a':'#333'" [style.color]="vFilter===f?'#fff':'#8b949e'">
              {{f|titlecase}}<span *ngIf="f==='pending'&&pendingCount>0" style="margin-left:4px;background:rgba(255,255,255,0.25);padding:1px 6px;border-radius:50px;">{{pendingCount}}</span>
            </button>
          </div>
          <div *ngIf="vLoading" style="color:#8b949e;padding:40px;text-align:center;">Loading...</div>
          <div *ngIf="!vLoading&&filteredVerifications.length===0" style="color:#555;text-align:center;padding:60px;"><div style="font-size:40px;margin-bottom:12px;">🛡️</div>No {{vFilter==='all'?'':vFilter}} requests.</div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div *ngFor="let v of filteredVerifications" style="background:#161b22;border:1px solid #21262d;border-radius:12px;padding:20px;display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap;">
              <img *ngIf="v.documentImage" [src]="v.documentImage" style="width:100px;height:70px;object-fit:cover;border-radius:8px;border:1px solid #21262d;cursor:pointer;flex-shrink:0;" (click)="previewDoc=v.documentImage" alt="doc" />
              <div *ngIf="!v.documentImage" style="width:100px;height:70px;background:#21262d;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#555;font-size:24px;flex-shrink:0;">📄</div>
              <div style="flex:1;min-width:200px;">
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
                  <span style="font-weight:800;color:#e6edf3;font-size:15px;">{{v.submittedName}}</span>
                  <span [class]="v.status==='approved'?'verified-chip':v.status==='pending'?'status-pending':'status-rejected'">{{v.status}}</span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-bottom:10px;">
                  <div><div style="font-size:10px;color:#555;text-transform:uppercase;margin-bottom:2px;">OCR Confidence</div><div style="font-weight:700;font-size:14px;" [style.color]="v.confidence>=0.9?'#22c55e':v.confidence>=0.6?'#b07800':'#ef4444'">{{(v.confidence*100).toFixed(0)}}%</div></div>
                  <div *ngIf="v.meta?.docType"><div style="font-size:10px;color:#555;text-transform:uppercase;margin-bottom:2px;">Document</div><div style="font-weight:600;font-size:13px;color:#8b949e;text-transform:capitalize;">{{v.meta.docType}}</div></div>
                  <div *ngIf="v.meta?.nationality"><div style="font-size:10px;color:#555;text-transform:uppercase;margin-bottom:2px;">Nationality</div><div style="font-weight:600;font-size:13px;color:#8b949e;">{{v.meta.nationality}}</div></div>
                  <div><div style="font-size:10px;color:#555;text-transform:uppercase;margin-bottom:2px;">Submitted</div><div style="font-weight:600;font-size:13px;color:#8b949e;">{{v.createdAt|date:'mediumDate'}}</div></div>
                </div>
                <div style="height:4px;background:#21262d;border-radius:2px;overflow:hidden;margin-bottom:12px;"><div style="height:100%;border-radius:2px;" [style.width]="(v.confidence*100)+'%'" [style.background]="v.confidence>=0.9?'#22c55e':v.confidence>=0.6?'#b07800':'#ef4444'"></div></div>
                <div style="display:flex;gap:8px;">
                  <button *ngIf="v.status!=='approved'" style="padding:7px 18px;border-radius:8px;border:none;background:#22c55e;color:#fff;font-size:13px;font-weight:700;cursor:pointer;" (click)="approveVerification(v)">✓ Approve</button>
                  <button *ngIf="v.status!=='rejected'" style="padding:7px 18px;border-radius:8px;border:none;background:#ef4444;color:#fff;font-size:13px;font-weight:700;cursor:pointer;" (click)="rejectVerification(v)">✕ Reject</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Q&A ── -->
        <div *ngIf="tab==='questions'">
          <h2 style="font-size:22px;font-weight:800;margin-bottom:8px;color:#e6edf3;">Q&A Posts</h2>
          <p style="color:#8b949e;font-size:13px;margin-bottom:20px;">Review and remove inappropriate questions or answers.</p>
          <div *ngIf="qLoading" style="color:#8b949e;padding:40px;text-align:center;">Loading...</div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div *ngFor="let q of questions" style="background:#161b22;border:1px solid #21262d;border-radius:12px;padding:20px;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px;">
                <div style="flex:1;">
                  <div style="font-weight:700;color:#e6edf3;font-size:15px;margin-bottom:4px;">{{q.title}}</div>
                  <div style="font-size:12px;color:#555;">By {{q.authorId?.name||'User'}} · {{q.createdAt|date:'mediumDate'}} <span *ngIf="q.city" style="margin-left:8px;background:#21262d;padding:2px 8px;border-radius:50px;color:#8b949e;">📍 {{q.city}}</span></div>
                  <div *ngIf="q.body" style="font-size:13px;color:#8b949e;margin-top:6px;">{{q.body}}</div>
                </div>
                <button style="padding:5px 12px;border-radius:6px;border:none;background:#ef4444;color:#fff;font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0;" (click)="deleteQuestion(q)">Delete</button>
              </div>
              <!-- Answers -->
              <div *ngIf="q.answers?.length" style="margin-top:12px;padding-top:12px;border-top:1px solid #21262d;">
                <div style="font-size:11px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">{{q.answers.length}} Answer(s)</div>
                <div *ngFor="let a of q.answers" style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;padding:8px 12px;background:#0d1117;border-radius:8px;margin-bottom:6px;">
                  <div style="font-size:13px;color:#8b949e;flex:1;">{{a.text}}</div>
                  <button style="padding:3px 10px;border-radius:5px;border:none;background:#ef4444;color:#fff;font-size:11px;cursor:pointer;flex-shrink:0;" (click)="deleteAnswer(q,a)">Del</button>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="!qLoading&&questions.length===0" style="color:#555;text-align:center;padding:60px;"><div style="font-size:40px;margin-bottom:12px;">❓</div>No questions yet.</div>
        </div>

        <!-- ── REPORTS ── -->
        <div *ngIf="tab==='reports'">
          <h2 style="font-size:22px;font-weight:800;margin-bottom:8px;color:#e6edf3;">User Reports</h2>
          <p style="color:#8b949e;font-size:13px;margin-bottom:20px;">Review reports submitted by users against other users.</p>

          <div style="display:flex;gap:8px;margin-bottom:20px;">
            <button *ngFor="let f of ['all','pending','reviewed','dismissed']" (click)="rFilter=f"
              style="padding:6px 16px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;border:1px solid;"
              [style.background]="rFilter===f?'#e8472a':'transparent'"
              [style.border-color]="rFilter===f?'#e8472a':'#333'"
              [style.color]="rFilter===f?'#fff':'#8b949e'">
              {{f|titlecase}}
              <span *ngIf="f==='pending'&&pendingReports>0" style="margin-left:4px;background:rgba(255,255,255,0.25);padding:1px 6px;border-radius:50px;">{{pendingReports}}</span>
            </button>
          </div>

          <div *ngIf="rLoading" style="color:#8b949e;padding:40px;text-align:center;">Loading...</div>
          <div *ngIf="!rLoading&&filteredReports.length===0" style="color:#555;text-align:center;padding:60px;">
            <div style="font-size:40px;margin-bottom:12px;">🚩</div>No {{rFilter==='all'?'':rFilter}} reports.
          </div>

          <div style="display:flex;flex-direction:column;gap:10px;">
            <div *ngFor="let r of filteredReports" style="background:#161b22;border:1px solid #21262d;border-radius:12px;padding:18px 20px;display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap;">
              <div style="flex:1;min-width:200px;">
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
                  <span style="font-weight:800;color:#e6edf3;font-size:15px;">{{r.reportedUserId?.name || 'User'}}</span>
                  <span class="role-chip" [class]="r.reportedUserId?.role">{{r.reportedUserId?.role}}</span>
                  <span [class]="r.status==='pending'?'status-pending':r.status==='reviewed'?'verified-chip':'status-rejected'">{{r.status}}</span>
                </div>
                <div style="font-size:13px;color:#8b949e;margin-bottom:4px;">
                  <span style="color:#555;">Reported by:</span> {{r.reportedByUserId?.name}} ({{r.reportedByUserId?.email}})
                </div>
                <div style="font-size:13px;color:#e6edf3;margin-bottom:4px;">
                  <span style="color:#555;">Reason:</span> {{r.reason}}
                </div>
                <div style="font-size:11px;color:#555;">{{r.createdAt | date:'medium'}}</div>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;flex-shrink:0;">
                <button *ngIf="r.status==='pending'" style="padding:6px 14px;border-radius:8px;border:none;background:#22c55e;color:#fff;font-size:12px;font-weight:700;cursor:pointer;" (click)="resolveReport(r,'reviewed')">✓ Mark Reviewed</button>
                <button *ngIf="r.status==='pending'" style="padding:6px 14px;border-radius:8px;border:1px solid #333;background:transparent;color:#8b949e;font-size:12px;cursor:pointer;" (click)="resolveReport(r,'dismissed')">Dismiss</button>
                <button style="padding:6px 14px;border-radius:8px;border:none;background:#ef4444;color:#fff;font-size:12px;font-weight:700;cursor:pointer;" (click)="action(r.reportedUserId,'ban')">Ban User</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── FEEDBACK ── -->
        <div *ngIf="tab==='feedback'">
          <h2 style="font-size:22px;font-weight:800;margin-bottom:8px;color:#e6edf3;">User Feedback</h2>
          <p style="color:#8b949e;font-size:13px;margin-bottom:20px;">Messages sent by users through the feedback form.</p>

          <div style="display:flex;gap:8px;margin-bottom:20px;">
            <button *ngFor="let f of ['all','new','read','resolved']" (click)="fbFilter=f"
              style="padding:6px 16px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;border:1px solid;"
              [style.background]="fbFilter===f?'#3b82f6':'transparent'"
              [style.border-color]="fbFilter===f?'#3b82f6':'#333'"
              [style.color]="fbFilter===f?'#fff':'#8b949e'">
              {{f|titlecase}}
              <span *ngIf="f==='new'&&newFeedbackCount>0" style="margin-left:4px;background:rgba(255,255,255,0.25);padding:1px 6px;border-radius:50px;">{{newFeedbackCount}}</span>
            </button>
          </div>

          <div *ngIf="fbLoading" style="color:#8b949e;padding:40px;text-align:center;">Loading...</div>
          <div *ngIf="!fbLoading&&filteredFeedback.length===0" style="color:#555;text-align:center;padding:60px;">
            <div style="font-size:40px;margin-bottom:12px;">💬</div>No {{fbFilter==='all'?'':fbFilter}} feedback.
          </div>

          <div style="display:flex;flex-direction:column;gap:10px;">
            <div *ngFor="let f of filteredFeedback" style="background:#161b22;border:1px solid #21262d;border-radius:12px;padding:18px 20px;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:10px;">
                <div>
                  <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                    <span style="font-weight:700;color:#e6edf3;">{{f.userName || 'User'}}</span>
                    <span style="font-size:11px;color:#555;">{{f.email}}</span>
                    <span style="background:#21262d;color:#8b949e;padding:2px 8px;border-radius:50px;font-size:11px;font-weight:600;">{{f.category}}</span>
                  </div>
                  <div style="font-size:11px;color:#555;">{{f.createdAt | date:'medium'}}</div>
                </div>
                <span [class]="f.status==='new'?'status-pending':f.status==='resolved'?'verified-chip':'status-rejected'" style="flex-shrink:0;">{{f.status}}</span>
              </div>
              <div style="font-size:14px;color:#8b949e;line-height:1.6;margin-bottom:12px;background:#0d1117;border-radius:8px;padding:12px;">{{f.message}}</div>
              <div style="display:flex;gap:8px;">
                <button *ngIf="f.status==='new'" style="padding:6px 14px;border-radius:8px;border:none;background:#3b82f6;color:#fff;font-size:12px;font-weight:700;cursor:pointer;" (click)="updateFeedback(f,'read')">Mark Read</button>
                <button *ngIf="f.status!=='resolved'" style="padding:6px 14px;border-radius:8px;border:none;background:#22c55e;color:#fff;font-size:12px;font-weight:700;cursor:pointer;" (click)="updateFeedback(f,'resolved')">✓ Resolve</button>
                <button *ngIf="f.status==='resolved'" style="padding:6px 14px;border-radius:8px;border:1px solid #333;background:transparent;color:#555;font-size:12px;cursor:pointer;" (click)="updateFeedback(f,'new')">Reopen</button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>

    <!-- User Detail Modal -->
    <div *ngIf="selectedUser" style="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;" (click)="selectedUser=null">
      <div style="background:#161b22;border:1px solid #21262d;border-radius:16px;max-width:560px;width:100%;max-height:90vh;overflow-y:auto;animation:scaleIn 0.2s ease;" (click)="$event.stopPropagation()">
        <div style="padding:24px;border-bottom:1px solid #21262d;display:flex;justify-content:space-between;align-items:center;">
          <h3 style="font-weight:800;color:#e6edf3;font-size:18px;">User Details</h3>
          <button (click)="selectedUser=null" style="background:transparent;border:none;color:#555;font-size:20px;cursor:pointer;">✕</button>
        </div>
        <div style="padding:24px;" *ngIf="userDetail">
          <div style="display:flex;gap:16px;align-items:center;margin-bottom:20px;">
            <img *ngIf="userDetail.profile?.photo" [src]="userDetail.profile.photo" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid #e8472a;" alt="avatar" />
            <div *ngIf="!userDetail.profile?.photo" style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#e8472a,#ff7a5c);color:#fff;font-size:24px;font-weight:800;display:flex;align-items:center;justify-content:center;">{{userDetail.user.name?.charAt(0)}}</div>
            <div>
              <div style="font-size:18px;font-weight:800;color:#e6edf3;">{{userDetail.user.name}}</div>
              <div style="font-size:13px;color:#8b949e;">{{userDetail.user.email}}</div>
              <div style="display:flex;gap:6px;margin-top:6px;">
                <span class="role-chip" [class]="userDetail.user.role">{{userDetail.user.role}}</span>
                <span *ngIf="userDetail.user.isVerified" class="verified-chip">Verified</span>
                <span *ngIf="userDetail.user.isBlacklisted" class="status-rejected">Banned</span>
              </div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
            <div style="background:#0d1117;border-radius:8px;padding:12px;"><div style="font-size:10px;color:#555;text-transform:uppercase;margin-bottom:4px;">City</div><div style="color:#e6edf3;font-size:13px;">{{userDetail.profile?.city||'—'}}</div></div>
            <div style="background:#0d1117;border-radius:8px;padding:12px;"><div style="font-size:10px;color:#555;text-transform:uppercase;margin-bottom:4px;">Joined</div><div style="color:#e6edf3;font-size:13px;">{{userDetail.user.createdAt|date:'mediumDate'}}</div></div>
            <div style="background:#0d1117;border-radius:8px;padding:12px;"><div style="font-size:10px;color:#555;text-transform:uppercase;margin-bottom:4px;">Languages</div><div style="color:#e6edf3;font-size:13px;">{{userDetail.profile?.languages?.join(', ')||'—'}}</div></div>
            <div style="background:#0d1117;border-radius:8px;padding:12px;"><div style="font-size:10px;color:#555;text-transform:uppercase;margin-bottom:4px;">Verification</div><div style="color:#e6edf3;font-size:13px;">{{userDetail.user.verificationStatus}}</div></div>
          </div>
          <div *ngIf="userDetail.profile?.bio" style="background:#0d1117;border-radius:8px;padding:12px;margin-bottom:16px;"><div style="font-size:10px;color:#555;text-transform:uppercase;margin-bottom:4px;">Bio</div><div style="color:#8b949e;font-size:13px;line-height:1.6;">{{userDetail.profile.bio}}</div></div>
          <div *ngIf="userDetail.profile?.posts?.length" style="margin-bottom:16px;"><div style="font-size:11px;color:#555;text-transform:uppercase;margin-bottom:8px;">Photos ({{userDetail.profile.posts.length}})</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;"><img *ngFor="let p of userDetail.profile.posts.slice(0,8)" [src]="p" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;" alt="post" /></div></div>
          <div *ngIf="userDetail.verification" style="background:#0d1117;border-radius:8px;padding:12px;"><div style="font-size:10px;color:#555;text-transform:uppercase;margin-bottom:8px;">Verification Submission</div><div style="display:flex;gap:12px;align-items:center;"><img *ngIf="userDetail.verification.documentImage" [src]="userDetail.verification.documentImage" style="width:80px;height:56px;object-fit:cover;border-radius:6px;" alt="doc" /><div><div style="font-size:13px;color:#e6edf3;font-weight:600;">{{userDetail.verification.submittedName}}</div><div style="font-size:12px;color:#8b949e;margin-top:2px;">OCR: {{(userDetail.verification.confidence*100).toFixed(0)}}% · {{userDetail.verification.status}}</div></div></div></div>
        </div>
        <div *ngIf="!userDetail" style="padding:40px;text-align:center;color:#555;">Loading...</div>
      </div>
    </div>

    <!-- Doc preview -->
    <div *ngIf="previewDoc" style="position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:600;display:flex;align-items:center;justify-content:center;padding:20px;" (click)="previewDoc=null">
      <img [src]="previewDoc" style="max-width:90vw;max-height:90vh;border-radius:12px;object-fit:contain;" alt="document" />
      <button style="position:absolute;top:20px;right:20px;background:rgba(255,255,255,0.1);border:none;color:#fff;width:40px;height:40px;border-radius:50%;font-size:18px;cursor:pointer;">✕</button>
    </div>
  `,
  styles: [`:host{display:block;} @keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`]
})
export class AdminComponent implements OnInit {
  tab = 'overview';
  stats: any = null;
  users: any[] = [];
  search = ''; roleFilter = '';
  selectedUsers: string[] = [];
  verifications: any[] = [];
  vFilter = 'pending'; vLoading = false; pendingCount = 0;
  questions: any[] = []; qLoading = false;
  activity: any[] = []; activityLoading = false;
  selectedUser: any = null; userDetail: any = null;
  previewDoc: string | null = null;
  reports: any[] = []; rFilter = 'pending'; rLoading = false;
  feedbacks: any[] = []; fbFilter = 'new'; fbLoading = false;
  get pendingReports() { return this.reports.filter(r => r.status === 'pending').length; }
  get filteredReports() { return this.rFilter === 'all' ? this.reports : this.reports.filter(r => r.status === this.rFilter); }
  get newFeedbackCount() { return this.feedbacks.filter(f => f.status === 'new').length; }
  get filteredFeedback() { return this.fbFilter === 'all' ? this.feedbacks : this.feedbacks.filter(f => f.status === this.fbFilter); }

  readonly circumference = 2 * Math.PI * 54;
  get travelerDash() { return this.segDash(this.stats?.travelers); }
  get travelerOffset() { return this.circumference * 0.25; }
  get localDash() { return this.segDash(this.stats?.locals); }
  get localOffset() { return this.circumference - (this.stats?.travelers||0)/(this.stats?.total||1)*this.circumference + this.circumference*0.25; }
  get adminDash() { return this.segDash((this.stats?.total||0)-(this.stats?.locals||0)-(this.stats?.travelers||0)); }
  get adminOffset() { const u=(this.stats?.travelers||0)+(this.stats?.locals||0); return this.circumference - u/(this.stats?.total||1)*this.circumference + this.circumference*0.25; }
  segDash(val: number) { if(!this.stats?.total||!val) return '0 '+this.circumference; return (val/this.stats.total*this.circumference)+' '+this.circumference; }
  pct(val: number) { return this.stats?.total ? Math.round(val/this.stats.total*100) : 0; }
  get filteredVerifications() { return this.vFilter==='all' ? this.verifications : this.verifications.filter(v=>v.status===this.vFilter); }

  constructor(private http: HttpClient) {}

  ngOnInit() { this.loadStats(); this.loadUsers(); this.loadVerifications(); this.loadReports(); this.loadFeedback(); }

  loadStats() { this.http.get<any>(`${environment.apiUrl}/admin/stats`).subscribe(s => this.stats = s); }

  loadUsers() {
    const params: any = {};
    if (this.search) params.search = this.search;
    if (this.roleFilter) params.role = this.roleFilter;
    this.http.get<any[]>(`${environment.apiUrl}/admin/users`, { params }).subscribe(u => { this.users = u; this.selectedUsers = []; });
  }

  loadActivity() {
    this.activityLoading = true;
    this.http.get<any[]>(`${environment.apiUrl}/admin/activity`).subscribe({ next: a => { this.activity = a; this.activityLoading = false; }, error: () => this.activityLoading = false });
  }

  loadVerifications() {
    this.vLoading = true;
    this.http.get<any[]>(`${environment.apiUrl}/admin/verifications`).subscribe({ next: vs => { this.verifications = vs; this.pendingCount = vs.filter(v=>v.status==='pending').length; this.vLoading = false; }, error: () => this.vLoading = false });
  }

  loadQuestions() {
    this.qLoading = true;
    this.http.get<any[]>(`${environment.apiUrl}/admin/questions`).subscribe({ next: qs => { this.questions = qs; this.qLoading = false; }, error: () => this.qLoading = false });
  }

  action(user: any, act: string) {
    if (act === 'delete' && !confirm(`Delete ${user.name}?`)) return;
    this.http.patch(`${environment.apiUrl}/admin/users/${user._id}`, { action: act }).subscribe(() => this.loadUsers());
  }

  setRole(user: any) {
    this.http.patch(`${environment.apiUrl}/admin/users/${user._id}`, { action: 'setRole', role: user.role }).subscribe();
  }

  toggleSelect(id: string) {
    const idx = this.selectedUsers.indexOf(id);
    if (idx >= 0) this.selectedUsers.splice(idx, 1); else this.selectedUsers.push(id);
  }

  toggleAll(e: any) {
    this.selectedUsers = e.target.checked ? this.users.map(u => u._id) : [];
  }

  bulkBan() {
    if (!confirm(`Ban ${this.selectedUsers.length} users?`)) return;
    this.http.post(`${environment.apiUrl}/admin/users/bulk`, { userIds: this.selectedUsers, action: 'blacklist' }).subscribe(() => this.loadUsers());
  }

  bulkDelete() {
    if (!confirm(`Delete ${this.selectedUsers.length} users? This cannot be undone.`)) return;
    this.http.post(`${environment.apiUrl}/admin/users/bulk`, { userIds: this.selectedUsers, action: 'delete' }).subscribe(() => this.loadUsers());
  }

  exportCSV() {
    const headers = ['Name', 'Email', 'Role', 'Verified', 'Banned', 'Joined'];
    const rows = this.users.map(u => [u.name, u.email, u.role, u.isVerified, u.isBlacklisted, new Date(u.createdAt).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'users.csv'; a.click();
  }

  openUserDetail(user: any) {
    this.selectedUser = user; this.userDetail = null;
    this.http.get<any>(`${environment.apiUrl}/admin/users/${user._id}`).subscribe(d => this.userDetail = d);
  }

  approveVerification(v: any) {
    this.http.patch(`${environment.apiUrl}/admin/users/${v.userId}`, { action: 'approve' }).subscribe(() => { v.status = 'approved'; this.pendingCount = this.verifications.filter(x=>x.status==='pending').length; });
  }

  rejectVerification(v: any) {
    this.http.patch(`${environment.apiUrl}/admin/users/${v.userId}`, { action: 'reject' }).subscribe(() => { v.status = 'rejected'; this.pendingCount = this.verifications.filter(x=>x.status==='pending').length; });
  }

  loadReports() {
    this.rLoading = true;
    this.http.get<any[]>(`${environment.apiUrl}/admin/reports`).subscribe({
      next: rs => { this.reports = rs; this.rLoading = false; },
      error: () => { this.rLoading = false; }
    });
  }

  resolveReport(r: any, status: string) {
    this.http.patch(`${environment.apiUrl}/admin/reports/${r._id}`, { status }).subscribe(() => {
      r.status = status;
    });
  }

  loadFeedback() {
    this.fbLoading = true;
    this.http.get<any[]>(`${environment.apiUrl}/feedback`).subscribe({
      next: fb => { this.feedbacks = fb; this.fbLoading = false; },
      error: () => { this.fbLoading = false; }
    });
  }

  updateFeedback(f: any, status: string) {
    this.http.patch(`${environment.apiUrl}/feedback/${f._id}`, { status }).subscribe(() => { f.status = status; });
  }

  deleteQuestion(q: any) {
    if (!confirm('Delete this question and all its answers?')) return;
    this.http.delete(`${environment.apiUrl}/admin/questions/${q._id}`).subscribe(() => this.questions = this.questions.filter(x => x._id !== q._id));
  }

  deleteAnswer(q: any, a: any) {
    if (!confirm('Delete this answer?')) return;
    this.http.delete(`${environment.apiUrl}/admin/questions/${q._id}/answers/${a._id}`).subscribe(() => q.answers = q.answers.filter((x: any) => x._id !== a._id));
  }
}
