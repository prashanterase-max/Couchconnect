import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import { QuestionService } from '../../core/services/question.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, BackButtonComponent],
  template: `
    <app-navbar />
    <div style="padding-top:80px;max-width:860px;margin:0 auto;padding:80px 24px 60px;">
      <app-back-btn />
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
        <h1 style="font-size:24px;font-weight:800;">Community Q&A</h1>
        <button class="btn-primary" (click)="showForm=!showForm">{{ showForm ? 'Cancel' : '+ Ask Question' }}</button>
      </div>

      <!-- Ask form -->
      <div *ngIf="showForm" class="card" style="margin-bottom:24px;">
        <h3 style="font-weight:800;margin-bottom:16px;">Ask a Question</h3>
        <div class="form-group">
          <label>Title</label>
          <input [(ngModel)]="form.title" placeholder="What do you want to know?" />
        </div>
        <div class="form-group">
          <label>Details (optional)</label>
          <textarea [(ngModel)]="form.body" placeholder="Add more context..."></textarea>
        </div>
        <div class="form-group">
          <label>City Tag</label>
          <input [(ngModel)]="form.city" placeholder="e.g. Jaipur, Mumbai" />
        </div>
        <button class="btn-primary" (click)="submit()" [disabled]="submitting">{{ submitting ? 'Posting...' : 'Post Question' }}</button>
      </div>

      <!-- Filter -->
      <div style="display:flex;gap:10px;margin-bottom:20px;align-items:center;flex-wrap:wrap;">
        <input [(ngModel)]="filterCity" placeholder="Filter by city..." style="max-width:200px;margin:0;" (ngModelChange)="load()" />
        <button *ngIf="filterCity" class="btn-ghost" (click)="filterCity='';load()">Clear</button>
      </div>

      <div *ngIf="loading" style="color:#888;text-align:center;padding:40px;">Loading...</div>

      <div *ngFor="let q of questions" class="card" style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
          <h3 style="font-weight:700;font-size:16px;">{{ q.title }}</h3>
          <span *ngIf="q.city" style="background:#fff0ee;color:#e8472a;padding:3px 10px;border-radius:50px;font-size:11px;font-weight:700;">📍 {{ q.city }}</span>
        </div>
        <p *ngIf="q.body" style="color:#888;font-size:14px;margin-bottom:12px;">{{ q.body }}</p>
        <div style="font-size:12px;color:#bbb;margin-bottom:12px;">Asked by {{ q.authorId?.name || 'User' }} · {{ q.createdAt | date:'mediumDate' }}</div>

        <!-- Answers -->
        <div *ngFor="let a of q.answers" style="background:#f7f7f8;border-radius:8px;padding:12px;margin-bottom:8px;">
          <p style="font-size:14px;color:#333;">{{ a.text }}</p>
          <div style="font-size:11px;color:#bbb;margin-top:4px;">{{ a.createdAt | date:'mediumDate' }}</div>
        </div>

        <!-- Answer form -->
        <div style="display:flex;gap:8px;margin-top:8px;">
          <input [(ngModel)]="q._answerText" placeholder="Write an answer..." style="margin:0;" />
          <button class="btn-primary" style="padding:10px 16px;white-space:nowrap;" (click)="answer(q)">Answer</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    :host-context(body.dark) h1, :host-context(body.dark) h3 { color: #f0f0f0; }
    :host-context(body.dark) .card { background: #1a1a1a; border-color: #2a2a2a; }
    :host-context(body.dark) p { color: #aaa; }
    :host-context(body.dark) div[style*="background:#f7f7f8"] { background: #111 !important; }
    :host-context(body.dark) p[style*="color:#333"] { color: #ddd !important; }
  `]
})
export class QuestionsComponent implements OnInit {
  questions: any[] = [];
  loading = true;
  showForm = false;
  submitting = false;
  filterCity = '';
  form = { title: '', body: '', city: '' };

  constructor(private qSvc: QuestionService, public auth: AuthService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.qSvc.list(this.filterCity || undefined).subscribe(qs => {
      this.questions = qs;
      this.loading = false;
    });
  }

  submit() {
    if (!this.form.title.trim()) return;
    this.submitting = true;
    this.qSvc.create(this.form).subscribe(q => {
      this.questions.unshift(q);
      this.form = { title: '', body: '', city: '' };
      this.showForm = false;
      this.submitting = false;
    });
  }

  answer(q: any) {
    if (!q._answerText?.trim()) return;
    this.qSvc.answer(q._id, q._answerText).subscribe(updated => {
      const idx = this.questions.findIndex(x => x._id === q._id);
      if (idx >= 0) this.questions[idx] = { ...updated, _answerText: '' };
    });
  }
}
