import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;
  user = signal<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.restoreSession();
  }

  restoreSession() {
    const token = localStorage.getItem('cc_token');
    if (token) {
      this.http.get(`${this.api}/auth/me`).subscribe({
        next: (u: any) => this.user.set(u),
        error: () => { localStorage.removeItem('cc_token'); }
      });
    }
  }

  signup(data: any) {
    return this.http.post<any>(`${this.api}/auth/signup`, data);
  }

  login(data: any) {
    return this.http.post<any>(`${this.api}/auth/login`, data).pipe(
      tap(res => { localStorage.setItem('cc_token', res.token); this.user.set(res.user); })
    );
  }

  logout() {
    this.http.post(`${this.api}/auth/logout`, {}).subscribe();
    localStorage.removeItem('cc_token');
    this.user.set(null);
    this.router.navigate(['/']);
  }

  get isLoggedIn() { return !!this.user(); }
  get role() { return this.user()?.role; }
}
