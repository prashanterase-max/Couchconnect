import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  list(city?: string) {
    const params: any = {};
    if (city) params.city = city;
    return this.http.get<any[]>(`${this.api}/questions`, { params });
  }
  create(data: any) { return this.http.post<any>(`${this.api}/questions`, data); }
  answer(id: string, text: string) { return this.http.post<any>(`${this.api}/questions/${id}/answer`, { text }); }
}
