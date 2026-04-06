import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = environment.apiUrl;
  notifications = signal<any[]>([]);
  unreadCount = signal(0);
  private interval: any;

  constructor(private http: HttpClient) {}

  start() {
    this.load();
    this.interval = setInterval(() => this.load(), 30000);
  }

  stop() { if (this.interval) clearInterval(this.interval); }

  load() {
    this.http.get<any[]>(`${this.api}/notifications`).subscribe({
      next: ns => {
        this.notifications.set(ns);
        this.unreadCount.set(ns.filter(n => !n.read).length);
      },
      error: () => {}
    });
  }

  markAllRead() {
    return this.http.post(`${this.api}/notifications/read-all`, {}).subscribe(() => {
      this.notifications.update(ns => ns.map(n => ({ ...n, read: true })));
      this.unreadCount.set(0);
    });
  }

  markRead(id: string) {
    return this.http.post(`${this.api}/notifications/${id}/read`, {}).subscribe(() => {
      this.notifications.update(ns => ns.map(n => n._id === id ? { ...n, read: true } : n));
      this.unreadCount.set(this.notifications().filter(n => !n.read).length);
    });
  }
}
