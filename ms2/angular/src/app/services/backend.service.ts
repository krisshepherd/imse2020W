import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Movie } from "../dataclasses/movie";
import { Onsite } from "../dataclasses/onsite";
import { Screening } from '../dataclasses/screening';
import { Streaming } from '../dataclasses/streaming';
import { User } from "../dataclasses/user";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.baseUrl + '/movies');
  }

  getMovie(title: string, releseDate: number): Observable<Movie> {
    const headers = new HttpHeaders({ 'title': title, 'release': releseDate.toString() });
    return this.http.get<Movie>(this.baseUrl + '/movie', { headers });
  }

  getOnsiteTickets(token: any): Observable<Onsite[]>{
    const headers = new HttpHeaders({ 'token': token });
    return this.http.get<Onsite[]>(this.baseUrl + '/onsitetickets', { headers });
  }
  
  getStreamingTickets(token: any): Observable<Streaming[]>{
    const headers = new HttpHeaders({ 'token': token });
    return this.http.get<Streaming[]>(this.baseUrl + '/streamtickets', { headers });
  }

  getDxSales(): Observable<any>{
    return this.http.get(this.baseUrl + '/onsitedxsales');
  }

  getAdultSales(): Observable<any>{
    return this.http.get(this.baseUrl + '/adultsales');
  }

  getScreenings(title: string, releseDate: number): Observable<Screening[]>{
    const headers = new HttpHeaders({ 'title': title, 'release': releseDate.toString() });
    return this.http.get<Screening[]>(this.baseUrl + '/screenings', { headers });
  }

  validateUser(email:string, password: string): Observable<null>{
    const headers = new HttpHeaders({ 'email': email, 'password': password });
    return this.http.get<null>(this.baseUrl + '/validateuser', { headers });
  }

  getUserData(token: any): Observable<User>{
    const headers = new HttpHeaders({ 'token': token});
    return this.http.get<User>(this.baseUrl + '/user', { headers} );
  }

  addCredit(email: string, credit: number): Observable<null>{
    return this.http.put<null>(this.baseUrl + '/uploadcredit', { email: email, credit: credit});
  }

  refundTicket(ticket: Onsite): Observable<null>{
    return this.http.post<null>(this.baseUrl + '/refund', { code: ticket.ticket_code });
  }

  buyOnsiteTicket(token: any, screening: Screening, row: number, seat: string): Observable<null>{
    return this.http.post<null>(this.baseUrl + '/buyOnsiteTicket', { token: token, screening: screening, row: row, seat: seat});
  }

  buyStreamTicket(token: any, screening: Screening): Observable<null>{
    return this.http.post<null>(this.baseUrl + '/buyStreamTicket', { token: token, screening: screening});
  }

  initDB(): Observable<null>{
    return this.http.post<null>(this.baseUrl + '/initdb', {});
  }
}
