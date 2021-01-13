import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Movie } from "../dataclasses/movie";
import { Onsite } from "../dataclasses/onsite";
import { Streaming } from '../dataclasses/streaming';
import { User } from '../dataclasses/user';
import { MOVIE } from '../mocks/movie.mock';
import { USER } from "../mocks/user.mock";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.baseUrl + '/movies');
  }

  getMovie(title: String, releseDate: number): Observable<Movie> {
    return of(MOVIE);
  }

  getOnsiteTickets(): Observable<Onsite[]>{
    return this.http.get<Onsite[]>(this.baseUrl + '/onsitetickets');
  }
  
  getStreamingTickets(){
    return this.http.get<Streaming[]>(this.baseUrl + '/streamtickets');
  }

  getDxSales(): Observable<any>{
    return this.http.get(this.baseUrl + '/onsitedxsales');
  }

  getAdultSales(): Observable<any>{
    return this.http.get(this.baseUrl + '/adultsales');
  }

  getUserData(email:string, password: string): Observable<any>{
    const headers = new HttpHeaders({ 'email': email, 'password': password });
    return this.http.get(this.baseUrl + '/validateUser', { headers });
  }
}
