import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private api = environment.apiUrl;
  private cache: any[] | null = null;

  constructor(private http: HttpClient) {}

  getMyProfile() { return this.http.get<any>(`${this.api}/profiles/me`); }
  updateMyProfile(data: any) { return this.http.put<any>(`${this.api}/profiles/me`, data); }
  getProfile(userId: string) { return this.http.get<any>(`${this.api}/profiles/${userId}`); }

  listProfiles(): Observable<any[]> {
    if (this.cache) return of(this.cache);
    return this.http.get<any[]>(`${this.api}/profiles`).pipe(
      tap((data: any[]) => this.cache = data)
    );
  }

  clearCache() { this.cache = null; }

  // Image compression via canvas
  compressImage(file: File, maxPx: number, quality = 0.7): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > maxPx || h > maxPx) {
            if (w > h) { h = Math.round(h * maxPx / w); w = maxPx; }
            else { w = Math.round(w * maxPx / h); h = maxPx; }
          }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = e.target!.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
