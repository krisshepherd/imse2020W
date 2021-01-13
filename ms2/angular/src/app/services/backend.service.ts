import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Movie } from "../dataclasses/movie";
import { Onsite } from "../dataclasses/onsite";
import { Streaming } from '../dataclasses/streaming';
import { MOVIE } from '../mocks/movie.mock';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>('http://localhost:3000/api/movies');
  }

  getMovie(title: String, releseDate: number): Observable<Movie> {
    return of(MOVIE);
  }

  getOnsiteTickets(): Observable<Onsite[]>{
    return this.http.get<Onsite[]>('http://localhost:3000/api/onsitetickets');
  }
  
  getStreamingTickets(){
    return this.http.get<Streaming[]>('http://localhost:3000/api/streamtickets');
  }
}
