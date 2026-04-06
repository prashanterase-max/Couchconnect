import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  buildChatId(a: string, b: string) { return [a, b].sort().join('_'); }
  getMessages(chatId: string) { return this.http.get<any[]>(`${this.api}/chat/${chatId}`); }
  sendMessage(chatId: string, text: string) { return this.http.post<any>(`${this.api}/chat/${chatId}`, { text }); }
  markSeen(chatId: string) { return this.http.post(`${this.api}/chat/${chatId}/seen`, {}); }
  getInbox() { return this.http.get<any[]>(`${this.api}/chat/inbox`); }
}
