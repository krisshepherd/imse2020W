import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOVIE } from '../mocks/movie.mock';
import { MOVIES } from "../mocks/movies.mock";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Object[]> {
    return of(MOVIES);
  }

  getMovie(): Observable<Object> {
    return of(MOVIE);
  }
}
