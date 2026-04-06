import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { ChatService } from '../../core/services/chat.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar />
    <div style="padding-top:64px;min-height:100vh;">

      <!-- Skeleton -->
      <div *ngIf="loading" style="max-width:960px;margin:0 auto;padding:24px;">
        <div style="height:180px;background:#e0e0e0;border-radius:14px;margin-bottom:60px;animation:pulse 1.4s infinite;"></div>
        <div style="display:flex;gap:20px;">
          <div style="width:88px;height:88px;border-radius:50%;background:#e0e0e0;animation:pulse 1.4s infinite;flex-shrink:0;margin-top:-44px;"></div>
          <div style="flex:1;padding-top:8px;">
            <div style="height:18px;width:40%;background:#e0e0e0;border-radius:6px;margin-bottom:10px;animation:pulse 1.4s infinite;"></div>
            <div style="height:13px;width:25%;background:#e0e0e0;border-radius:6px;animation:pulse 1.4s infinite;"></div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && profile">

        <!-- Cover -->
        <div class="cover-wrap">
          <img *ngIf="profile.coverPhoto" [src]="profile.coverPhoto" class="cover-img" alt="cover" />
          <div *ngIf="!profile.coverPhoto" class="cover-default"></div>
          <!-- Back button overlaid on cover -->
          <button class="cover-back-btn" (click)="goBack()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <label *ngIf="isOwn && editing" class="cover-edit-btn">
            📷 Change Cover
            <input type="file" accept="image/*" style="display:none" (change)="onCoverChange($event)" />
          </label>
        </div>

        <div class="profile-container">

          <!-- Avatar + actions row -->
          <div class="avatar-actions-row">
            <div class="avatar-wrap">
              <img *ngIf="profile.photo" [src]="profile.photo" class="profile-avatar" alt="avatar" />
              <div *ngIf="!profile.photo" class="profile-avatar-init">
                {{profile.name?.charAt(0)?.toUpperCase()||'?'}}
              </div>
              <label *ngIf="isOwn && editing" class="avatar-edit-btn">
                📷<input type="file" accept="image/*" style="display:none" (change)="onPhotoChange($event)" />
              </label>
            </div>
            <div class="action-btns">
              <button *ngIf="isOwn && !editing" class="btn-primary" (click)="editing=true">✏️ Edit Profile</button>
              <button *ngIf="!isOwn" class="btn-primary" (click)="startChat()">💬 Message</button>
              <a *ngIf="!isOwn && authSvc.role==='traveler' && profile.role==='local'" [routerLink]="['/request-stay', profile.userId]" class="btn-outline">🏠 Request Stay</a>
              <button *ngIf="!isOwn" class="btn-outline report-btn" (click)="showReport=true">🚩 Report</button>
            </div>
          </div>

          <!-- Name + meta -->
          <div class="profile-meta">
            <div class="name-row">
              <h1 class="profile-name">{{profile.name||'No name'}}</h1>
              <span class="role-chip" [class]="profile.role">{{profile.role}}</span>
              <span *ngIf="user?.isVerified" class="verified-chip">✓ Verified</span>
            </div>
            <div class="meta-row">
              <span *ngIf="profile.city">📍 {{profile.city}}</span>
              <span *ngIf="user?.createdAt">📅 Member since {{user.createdAt | date:'MMM yyyy'}}</span>
              <span *ngIf="profile.ratingCount>0" class="rating-text">⭐ {{profile.rating}}/5 ({{profile.ratingCount}} reviews)</span>
            </div>
            <div *ngIf="profile.languages?.length" class="lang-row">
              <span *ngFor="let l of profile.languages" class="lang-chip">{{l}}</span>
            </div>
            <div class="social-row">
              <a *ngIf="profile.socialLinks?.instagram" [href]="'https://instagram.com/'+profile.socialLinks.instagram" target="_blank" class="social-icon" title="Instagram">📸</a>
              <a *ngIf="profile.socialLinks?.twitter" [href]="'https://twitter.com/'+profile.socialLinks.twitter" target="_blank" class="social-icon" title="Twitter">𝕏</a>
              <a *ngIf="profile.socialLinks?.linkedin" [href]="profile.socialLinks.linkedin" target="_blank" class="social-icon" title="LinkedIn">💼</a>
              <a *ngIf="profile.socialLinks?.website" [href]="profile.socialLinks.website" target="_blank" class="social-icon" title="Website">🌐</a>
            </div>
          </div>

          <!-- Completeness meter -->
          <div *ngIf="isOwn" class="completeness-bar">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span style="font-size:13px;font-weight:700;color:#555;">Profile Completeness</span>
              <span style="font-size:13px;font-weight:800;" [style.color]="completeness>=80?'#22c55e':completeness>=50?'#b07800':'#e8472a'">{{completeness}}%</span>
            </div>
            <div style="height:7px;background:#f0f0f0;border-radius:4px;overflow:hidden;margin-bottom:8px;">
              <div style="height:100%;border-radius:4px;transition:width 0.6s;" [style.width]="completeness+'%'" [style.background]="completeness>=80?'#22c55e':completeness>=50?'#b07800':'#e8472a'"></div>
            </div>
            <div *ngIf="completeness<100" style="font-size:12px;color:#888;">
              Missing: <span *ngFor="let m of missingFields; let last=last" style="color:#e8472a;font-weight:600;">{{m}}{{last?'':' · '}}</span>
            </div>
            <div *ngIf="completeness===100" style="font-size:12px;color:#22c55e;font-weight:700;">✓ Profile complete!</div>
          </div>

          <!-- 2-col body -->
          <div class="profile-body">

            <!-- Left -->
            <div class="profile-left">

              <!-- Bio -->
              <div *ngIf="profile.bio && !editing" class="pcard">
                <h3 class="pcard-title">About</h3>
                <p style="font-size:14px;line-height:1.8;color:#555;margin:0;">{{profile.bio}}</p>
              </div>

              <!-- Edit form -->
              <div *ngIf="isOwn && editing" class="pcard">
                <h3 class="pcard-title">Edit Profile</h3>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                  <div class="form-group"><label>Name</label><input [(ngModel)]="form.name" placeholder="Your name" /></div>
                  <div class="form-group"><label>City</label><input [(ngModel)]="form.city" placeholder="Where you live" /></div>
                </div>
                <div class="form-group"><label>Bio</label><textarea [(ngModel)]="form.bio" placeholder="Tell travelers about yourself..." style="min-height:100px;"></textarea></div>
                <div class="form-group"><label>Languages (comma separated)</label><input [(ngModel)]="langStr" placeholder="English, Hindi, Spanish" /></div>
                <div style="font-size:13px;font-weight:700;color:#555;margin:16px 0 12px;">Social Links</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                  <div class="form-group"><label>Instagram</label><input [(ngModel)]="form.socialLinks.instagram" placeholder="username" /></div>
                  <div class="form-group"><label>Twitter/X</label><input [(ngModel)]="form.socialLinks.twitter" placeholder="username" /></div>
                  <div class="form-group"><label>LinkedIn URL</label><input [(ngModel)]="form.socialLinks.linkedin" placeholder="https://..." /></div>
                  <div class="form-group"><label>Website</label><input [(ngModel)]="form.socialLinks.website" placeholder="https://..." /></div>
                </div>
                <div style="font-size:13px;font-weight:700;color:#555;margin:16px 0 12px;">Emergency Contact (private)</div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
                  <div class="form-group"><label>Name</label><input [(ngModel)]="form.emergencyContact.name" placeholder="Contact name" /></div>
                  <div class="form-group"><label>Phone</label><input [(ngModel)]="form.emergencyContact.phone" placeholder="+91..." /></div>
                  <div class="form-group"><label>Relation</label><input [(ngModel)]="form.emergencyContact.relation" placeholder="Parent..." /></div>
                </div>
                <div class="form-group"><label>Post Photos</label><input type="file" accept="image/*" multiple (change)="onPostsChange($event)" /></div>
                <div style="display:flex;gap:10px;margin-top:8px;">
                  <button class="btn-primary" (click)="save()" [disabled]="saving">{{saving?'Saving...':'Save Changes'}}</button>
                  <button class="btn-outline" (click)="editing=false">Cancel</button>
                </div>
              </div>

              <!-- Photos -->
              <div class="pcard">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                  <h3 class="pcard-title" style="margin:0;">Photos {{posts.length ? '(' + posts.length + ')' : ''}}</h3>
                  <label *ngIf="isOwn" style="font-size:12px;font-weight:700;color:#e8472a;cursor:pointer;display:flex;align-items:center;gap:4px;">
                    + Add Photo
                    <input type="file" accept="image/*" style="display:none" (change)="uploadPost($event)" />
                  </label>
                </div>

                <!-- Empty state -->
                <div *ngIf="!posts.length" style="text-align:center;padding:32px 16px;border:2px dashed #eee;border-radius:10px;">
                  <div style="font-size:36px;margin-bottom:10px;">🖼️</div>
                  <div style="font-size:14px;font-weight:600;color:#888;margin-bottom:4px;">No photos yet</div>
                  <div style="font-size:12px;color:#bbb;">{{isOwn ? 'Click "+ Add Photo" to share your travel moments' : 'This user hasn\'t added any photos yet'}}</div>
                </div>

                <!-- Posts feed -->
                <div *ngFor="let post of posts" class="post-item">
                  <!-- Post image -->
                  <div style="position:relative;cursor:pointer;" (click)="openLightboxPost(post)">
                    <img [src]="post.image" style="width:100%;max-height:400px;object-fit:cover;border-radius:10px;display:block;" alt="post" />
                    <button *ngIf="isOwn" (click)="deletePostById(post._id);$event.stopPropagation()"
                      style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.5);border:none;color:#fff;width:28px;height:28px;border-radius:50%;font-size:13px;cursor:pointer;backdrop-filter:blur(4px);">✕</button>
                  </div>

                  <!-- Caption -->
                  <div *ngIf="post.caption" style="font-size:13px;color:#555;padding:8px 4px 4px;line-height:1.5;">{{post.caption}}</div>

                  <!-- Like + comment bar -->
                  <div style="display:flex;align-items:center;gap:16px;padding:8px 4px;border-bottom:1px solid #f0f0f0;">
                    <button (click)="toggleLike(post)" class="action-btn" [class.liked]="isLiked(post)">
                      {{isLiked(post) ? '❤️' : '🤍'}} {{post.likes?.length || 0}}
                    </button>
                    <button (click)="post._showComments=!post._showComments" class="action-btn">
                      💬 {{post.comments?.length || 0}}
                    </button>
                    <span style="margin-left:auto;font-size:11px;color:#bbb;">{{post.createdAt | date:'mediumDate'}}</span>
                  </div>

                  <!-- Comments section -->
                  <div *ngIf="post._showComments" style="padding:8px 4px 4px;">
                    <!-- Existing comments -->
                    <div *ngFor="let c of post.comments" style="display:flex;gap:8px;margin-bottom:8px;align-items:flex-start;">
                      <a [routerLink]="['/profile', c.userId]" style="text-decoration:none;flex-shrink:0;" title="View profile">
                        <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#e8472a,#ff7a5c);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;transition:transform 0.2s;"
                          onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                          {{c.userName?.charAt(0)?.toUpperCase()}}
                        </div>
                      </a>
                      <div style="flex:1;background:#f7f7f8;border-radius:10px;padding:8px 10px;">
                        <a [routerLink]="['/profile', c.userId]" style="font-size:12px;font-weight:700;color:#e8472a;margin-bottom:2px;display:inline-block;text-decoration:none;"
                          onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
                          {{c.userName}}
                        </a>
                        <div style="font-size:13px;color:#555;">{{c.text}}</div>
                      </div>
                      <button *ngIf="c.userId===myId || isOwn" (click)="deleteComment(post, c._id)"
                        style="background:none;border:none;color:#ccc;cursor:pointer;font-size:14px;padding:4px;flex-shrink:0;">✕</button>
                    </div>

                    <!-- Add comment -->
                    <div style="display:flex;gap:8px;margin-top:6px;">
                      <input [(ngModel)]="post._commentText" placeholder="Add a comment..."
                        style="flex:1;padding:8px 12px;border:1px solid #eee;border-radius:50px;font-size:13px;outline:none;background:#f7f7f8;"
                        (keyup.enter)="addComment(post)" />
                      <button (click)="addComment(post)" class="action-btn" style="background:#e8472a;color:#fff;border-radius:50%;width:34px;height:34px;border:none;font-size:14px;cursor:pointer;flex-shrink:0;">➤</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reviews -->
              <div *ngIf="ratings.length" class="pcard">
                <h3 class="pcard-title">Reviews ({{ratings.length}})</h3>
                <div *ngFor="let r of ratings; let last=last" [style.border-bottom]="last?'none':'1px solid #f0f0f0'" style="padding:14px 0;">
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span style="font-weight:700;font-size:13px;">{{r.fromUserId?.name||'User'}}</span>
                    <span style="color:#b07800;font-size:13px;">{{starsStr(r.stars)}}</span>
                  </div>
                  <p *ngIf="r.comment" style="font-size:13px;color:#666;line-height:1.6;margin:0 0 4px;">{{r.comment}}</p>
                  <div style="font-size:11px;color:#bbb;">{{r.createdAt|date:'mediumDate'}}</div>
                </div>
              </div>
            </div>

            <!-- Right sidebar -->
            <div class="profile-right">
              <div class="pcard">
                <h3 class="pcard-title">Stats</h3>
                <div style="display:flex;flex-direction:column;gap:10px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:13px;color:#888;">Role</span><span class="role-chip" [class]="profile.role" style="font-size:11px;">{{profile.role}}</span></div>
                  <div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:13px;color:#888;">Rating</span><span style="font-weight:700;font-size:13px;" [style.color]="profile.ratingCount>0?'#b07800':'#bbb'">{{profile.ratingCount>0?(profile.rating+' ⭐'):'No reviews yet'}}</span></div>
                  <div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:13px;color:#888;">Photos</span><span style="font-weight:700;font-size:13px;">{{profile.posts?.length||0}}</span></div>
                  <div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:13px;color:#888;">Languages</span><span style="font-weight:700;font-size:13px;">{{profile.languages?.length||0}}</span></div>
                </div>
              </div>

              <div *ngIf="!isOwn && authSvc.role==='traveler' && profile.role==='local'" class="pcard">
                <h3 class="pcard-title">Leave a Review</h3>
                <div style="display:flex;gap:6px;margin-bottom:12px;">
                  <span *ngFor="let s of [1,2,3,4,5]"
                    (click)="ratingForm.stars = s"
                    class="star-btn"
                    [class.star-active]="s <= ratingForm.stars">★</span>
                </div>
                <textarea [(ngModel)]="ratingForm.comment" placeholder="Share your experience..." style="min-height:70px;margin-bottom:10px;font-size:13px;"></textarea>
                <button class="btn-primary" style="width:100%;padding:9px;" (click)="submitRating()" [disabled]="!ratingForm.stars || ratingSubmitted">
                  {{ratingSubmitted ? '✓ Review submitted' : 'Submit Review'}}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div *ngIf="lightboxPost" style="position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:400;display:flex;align-items:center;justify-content:center;" (click)="lightboxPost=null">
      <button (click)="lightboxPost=null" style="position:absolute;top:20px;right:20px;background:rgba(255,255,255,0.1);border:none;color:#fff;width:40px;height:40px;border-radius:50%;font-size:18px;cursor:pointer;">✕</button>
      <img [src]="lightboxPost.image" style="max-width:90vw;max-height:88vh;object-fit:contain;border-radius:8px;" (click)="$event.stopPropagation()" alt="photo" />
    </div>

    <!-- Report modal -->
    <div *ngIf="showReport" style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px;" (click)="showReport=false">
      <div style="background:#fff;border-radius:16px;padding:28px;max-width:400px;width:100%;animation:scaleIn 0.2s ease;" (click)="$event.stopPropagation()">
        <h3 style="font-weight:800;margin-bottom:16px;">Report User</h3>
        <select [(ngModel)]="reportReason" style="margin-bottom:16px;">
          <option value="">Select reason...</option>
          <option>Inappropriate content</option>
          <option>Fake profile</option>
          <option>Harassment</option>
          <option>Spam</option>
          <option>Other</option>
        </select>
        <div style="display:flex;gap:10px;">
          <button class="btn-primary" style="background:#ef4444;box-shadow:none;" (click)="submitReport()" [disabled]="!reportReason">Submit Report</button>
          <button class="btn-outline" (click)="showReport=false">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    /* Cover */
    .cover-wrap { position:relative;height:240px;overflow:hidden;background:linear-gradient(135deg,#1a1a2e,#16213e); }
    .cover-img { width:100%;height:100%;object-fit:cover;display:block; }
    .cover-default { position:absolute;inset:0;background:linear-gradient(135deg,#e8472a18,#3b82f625,#a855f715); }
    .cover-back-btn {
      position: absolute; top: 16px; left: 16px;
      display: flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 50px;
      background: rgba(0,0,0,0.5); backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.15);
      color: #fff; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
    }
    .cover-back-btn:hover { background: rgba(232,71,42,0.75); border-color: transparent; }
    .cover-edit-btn { position:absolute;bottom:14px;right:14px;background:rgba(0,0,0,0.55);color:#fff;padding:8px 16px;border-radius:50px;cursor:pointer;font-size:12px;font-weight:700;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.15); }

    /* Container */
    .profile-container { max-width:960px;margin:0 auto;padding:0 28px 60px; }

    /* Avatar row */
    .avatar-actions-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: -56px;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .avatar-wrap { position:relative;flex-shrink:0; }
    .profile-avatar { width:112px;height:112px;border-radius:50%;object-fit:cover;border:4px solid #fff;box-shadow:0 6px 24px rgba(0,0,0,0.2);display:block; }
    .profile-avatar-init { width:112px;height:112px;border-radius:50%;background:linear-gradient(135deg,#e8472a,#ff7a5c);display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:800;color:#fff;border:4px solid #fff;box-shadow:0 6px 24px rgba(0,0,0,0.2); }
    .avatar-edit-btn { position:absolute;bottom:4px;right:4px;width:28px;height:28px;border-radius:50%;background:#e8472a;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;border:2px solid #fff;box-shadow:0 2px 8px rgba(232,71,42,0.4); }
    .action-btns {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
      padding-top: 64px;
    }
    .report-btn { color:#ef4444 !important;border-color:#fca5a5 !important; }

    /* Stars */
    .star-btn { font-size:28px;cursor:pointer;color:#ddd;transition:color 0.15s,transform 0.15s;user-select:none;line-height:1; }
    .star-btn:hover { transform:scale(1.2); }
    .star-active { color:#f59e0b; }

    /* Posts */
    .post-item { border-bottom: 1px solid #f0f0f0; padding-bottom: 16px; margin-bottom: 16px; }
    .post-item:last-child { border-bottom: none; margin-bottom: 0; }
    .action-btn { background: none; border: none; cursor: pointer; font-size: 14px; font-weight: 700; color: #888; padding: 4px 8px; border-radius: 8px; transition: all 0.2s; display: flex; align-items: center; gap: 4px; }
    .action-btn:hover { background: #f5f5f5; color: #333; }
    .action-btn.liked { color: #e8472a; }
    :host-context(body.dark) .post-item { border-color: #2a2a2a; }
    :host-context(body.dark) .action-btn:hover { background: #2a2a2a; color: #f0f0f0; }
    :host-context(body.dark) div[style*="background:#f7f7f8"] { background: #111 !important; }
    :host-context(body.dark) div[style*="color:#333"] { color: #f0f0f0 !important; }
    :host-context(body.dark) div[style*="color:#555"] { color: #aaa !important; }

    /* Meta */
    .profile-meta { margin-bottom:24px; }
    .name-row { display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px; }
    .profile-name { font-size:24px;font-weight:900;margin:0;color:#1a1a1a;letter-spacing:-0.3px; }
    .meta-row { display:flex;gap:20px;flex-wrap:wrap;font-size:13px;color:#888;margin-bottom:10px;align-items:center; }
    .rating-text { color:#b07800;font-weight:600; }
    .lang-row { display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px; }
    .lang-chip { background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe;padding:4px 12px;border-radius:50px;font-size:12px;font-weight:700; }
    .social-row { display:flex;gap:8px;flex-wrap:wrap; }
    .social-icon { width:32px;height:32px;border-radius:8px;background:#f5f5f5;border:1px solid #eee;display:flex;align-items:center;justify-content:center;font-size:16px;text-decoration:none;transition:all 0.2s; }
    .social-icon:hover { background:#fff0ee;border-color:#e8472a;transform:translateY(-2px); }
    :host-context(body.dark) .social-icon { background:#1a1a1a;border-color:#2a2a2a; }

    /* Completeness */
    .completeness-bar {
      background: linear-gradient(135deg,#fff8f7,#fff);
      border: 1px solid #ffd0c8;
      border-radius: 14px;
      padding: 18px 22px;
      margin-bottom: 24px;
    }
    :host-context(body.dark) .completeness-bar { background: linear-gradient(135deg,#1a0f0d,#1a1a1a); border-color: #3a1a15; }

    /* Body grid */
    .profile-body { display:grid;grid-template-columns:1fr 280px;gap:20px;align-items:start; }
    .profile-left { display:flex;flex-direction:column;gap:16px; }
    .profile-right { display:flex;flex-direction:column;gap:16px; }

    /* Cards */
    .pcard {
      background: #fff;
      border: 1px solid #eee;
      border-radius: 14px;
      padding: 22px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }
    .pcard-title { font-size:14px;font-weight:800;margin:0 0 16px;color:#1a1a1a;text-transform:uppercase;letter-spacing:0.5px; }

    /* Dark mode */
    :host-context(body.dark) .profile-name { color:#f0f0f0; }
    :host-context(body.dark) .pcard { background:#1a1a1a;border-color:#2a2a2a;box-shadow:none; }
    :host-context(body.dark) .pcard-title { color:#f0f0f0; }
    :host-context(body.dark) .profile-avatar,:host-context(body.dark) .profile-avatar-init { border-color:#0f0f0f; }
    :host-context(body.dark) p { color:#aaa; }
    :host-context(body.dark) input,:host-context(body.dark) textarea { background:#111;border-color:#333;color:#f0f0f0; }

    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
    @media(max-width:768px) { .profile-body{grid-template-columns:1fr;} .avatar-actions-row{flex-direction:column;align-items:flex-start;} }
  `]
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  user: any = null;
  loading = true;
  editing = false;
  saving = false;
  isOwn = false;
  form: any = { socialLinks: {}, emergencyContact: {} };
  langStr = '';
  ratings: any[] = [];
  ratingForm = { stars: 0, comment: '' };
  ratingSubmitted = false;
  showReport = false;
  reportReason = '';
  lightboxPost: any = null;
  posts: any[] = [];
  get myId() { return this.authSvc.user()?._id; }

  constructor(
    private route: ActivatedRoute,
    private profileSvc: ProfileService,
    public authSvc: AuthService,
    private chatSvc: ChatService,
    private http: HttpClient,
    private router: Router,
    private location: Location
  ) {}

  goBack() { this.location.back(); }

  get completeness() {
    if (!this.profile) return 0;
    const checks = [!!this.profile.name, !!this.profile.bio, !!this.profile.city, this.profile.languages?.length>0, !!this.profile.photo, this.profile.posts?.length>0, !!(this.profile.socialLinks?.instagram||this.profile.socialLinks?.website)];
    return Math.round(checks.filter(Boolean).length / checks.length * 100);
  }

  get missingFields() {
    if (!this.profile) return [];
    const m: string[] = [];
    if (!this.profile.bio) m.push('Bio');
    if (!this.profile.city) m.push('City');
    if (!this.profile.languages?.length) m.push('Languages');
    if (!this.profile.photo) m.push('Photo');
    if (!this.profile.posts?.length) m.push('Photos');
    return m;
  }

  starsStr(n: number) { return '⭐'.repeat(Math.min(n, 5)); }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isOwn = !id;
    if (this.isOwn) {
      this.profileSvc.getMyProfile().subscribe({
        next: p => { this.profile = p; this.user = this.authSvc.user(); this.initForm(); this.loading = false; this.loadPosts(); },
        error: () => { this.profile = { name: this.authSvc.user()?.name||'', bio:'', city:'', languages:[], photo:'', posts:[], role: this.authSvc.user()?.role||'traveler', socialLinks:{}, emergencyContact:{} }; this.user = this.authSvc.user(); this.initForm(); this.loading = false; }
      });
    } else {
      this.profileSvc.getProfile(id!).subscribe({
        next: p => {
          this.profile = p; this.loading = false;
          this.http.get<any[]>(`${environment.apiUrl}/ratings/${p.userId}`).subscribe(r => this.ratings = r);
          this.loadPosts(p.userId);
        },
        error: () => this.loading = false
      });
    }
  }

  initForm() {
    this.form = { name: this.profile.name, bio: this.profile.bio, city: this.profile.city, socialLinks: { ...(this.profile.socialLinks||{}) }, emergencyContact: { ...(this.profile.emergencyContact||{}) } };
    this.langStr = (this.profile.languages||[]).join(', ');
  }

  async onPhotoChange(e: any) {
    const file = e.target.files[0]; if (!file) return;
    const c = await this.profileSvc.compressImage(file, 300);
    this.profile.photo = c; this.form.photo = c;
  }

  async onCoverChange(e: any) {
    const file = e.target.files[0]; if (!file) return;
    const c = await this.profileSvc.compressImage(file, 1200, 0.8);
    this.profile.coverPhoto = c; this.form.coverPhoto = c;
  }

  async onPostsChange(e: any) {
    const files: File[] = Array.from(e.target.files);
    const compressed = await Promise.all(files.map(f => this.profileSvc.compressImage(f, 600)));
    this.form.posts = [...(this.profile.posts||[]), ...compressed];
  }

  save() {
    this.saving = true;
    const data = { ...this.form, photo: this.form.photo||this.profile.photo, coverPhoto: this.form.coverPhoto||this.profile.coverPhoto, posts: this.form.posts||this.profile.posts, languages: this.langStr.split(',').map((l:string)=>l.trim()).filter(Boolean) };
    this.profileSvc.updateMyProfile(data).subscribe(p => { this.profile = p; this.editing = false; this.saving = false; this.profileSvc.clearCache(); });
  }

  startChat() {
    const myId = this.authSvc.user()?._id;
    this.router.navigate(['/messages', this.chatSvc.buildChatId(myId, this.profile.userId)]);
  }

  openLightboxPost(post: any) { this.lightboxPost = post; }

  loadPosts(userId?: string) {
    const url = userId ? `${environment.apiUrl}/posts/user/${userId}` : `${environment.apiUrl}/posts/me`;
    this.http.get<any[]>(url).subscribe(p => this.posts = p.map(post => ({ ...post, _showComments: false, _commentText: '' })));
  }

  async uploadPost(e: any) {
    const file = e.target.files[0]; if (!file) return;
    const image = await this.profileSvc.compressImage(file, 800, 0.85);
    const caption = prompt('Add a caption (optional):') || '';
    this.http.post<any>(`${environment.apiUrl}/posts`, { image, caption }).subscribe(post => {
      this.posts.unshift({ ...post, _showComments: false, _commentText: '' });
    });
  }

  deletePostById(id: string) {
    if (!confirm('Delete this photo?')) return;
    this.http.delete(`${environment.apiUrl}/posts/${id}`).subscribe(() => {
      this.posts = this.posts.filter(p => p._id !== id);
    });
  }

  isLiked(post: any) {
    return post.likes?.includes(this.myId) || post.likes?.some((l: any) => l === this.myId || l?._id === this.myId);
  }

  toggleLike(post: any) {
    this.http.post<any>(`${environment.apiUrl}/posts/${post._id}/like`, {}).subscribe(res => {
      post.likes = res.liked
        ? [...(post.likes || []), this.myId]
        : (post.likes || []).filter((l: any) => l !== this.myId && l?._id !== this.myId);
    });
  }

  addComment(post: any) {
    if (!post._commentText?.trim()) return;
    const text = post._commentText;
    post._commentText = '';
    this.http.post<any>(`${environment.apiUrl}/posts/${post._id}/comment`, { text }).subscribe(comment => {
      post.comments = [...(post.comments || []), comment];
    });
  }

  deleteComment(post: any, commentId: string) {
    this.http.delete(`${environment.apiUrl}/posts/${post._id}/comment/${commentId}`).subscribe(() => {
      post.comments = post.comments.filter((c: any) => c._id !== commentId);
    });
  }

  submitRating() {
    if (!this.ratingForm.stars) return;
    this.http.post(`${environment.apiUrl}/ratings`, { toUserId: this.profile.userId, stars: this.ratingForm.stars, comment: this.ratingForm.comment }).subscribe(() => {
      this.ratingSubmitted = true;
      this.http.get<any[]>(`${environment.apiUrl}/ratings/${this.profile.userId}`).subscribe(r => this.ratings = r);
    });
  }

  submitReport() {
    this.http.post(`${environment.apiUrl}/reports`, { userId: this.profile.userId, reason: this.reportReason }).subscribe(() => { this.showReport = false; alert('Report submitted. Thank you.'); });
  }
}
