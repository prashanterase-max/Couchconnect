import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StayService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  sendRequest(data: any) { return this.http.post<any>(`${this.api}/stay`, data); }
  myRequests() { return this.http.get<any[]>(`${this.api}/stay/my`); }
  localRequests() { return this.http.get<any[]>(`${this.api}/stay/local`); }
  respond(id: string, status: string) { return this.http.patch<any>(`${this.api}/stay/${id}`, { status }); }
}
