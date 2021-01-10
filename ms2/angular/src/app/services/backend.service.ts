import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Movie } from "../dataclasses/movie";
import { MOVIE } from '../mocks/movie.mock';
import { MOVIES } from "../mocks/movies.mock";
import { ONSITE_TICKETS } from '../mocks/onsite.mock';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return of(MOVIES);
  }

  getMovie(title: String, releseDate: number): Observable<Movie> {
    return of(MOVIE);
  }

  getOnsiteTickets(){
    return of(ONSITE_TICKETS);
  }
}
