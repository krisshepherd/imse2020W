import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {BackendService} from '../../services/backend.service';
import { Movie } from "../../dataclasses/movie";

interface Age {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  releaseYear = new FormControl();

  searchParamTitle: string = '';

  yearsList: Set<string> = new Set();
  selectedYear: string = '';
  ratingList: Set<string> = new Set();
  selectedRating: string = ''

  queriedMovies: Movie[] = [];
  filteredMovies: Movie[] = [];

  constructor(private backendService: BackendService ) { }

  ngOnInit(): void {
    this.backendService.getMovies().subscribe(movies => {
      this.queriedMovies = movies;
      this.filteredMovies = movies;
      for (let movie of this.queriedMovies){
        this.yearsList.add(movie.release_date);;
        this.ratingList.add(movie.rating);
      }
    });
  }

  selectYear(year: string){
    this.selectedYear = year;
  }

  selectRating(rating: string){
    this.selectedRating = rating;
  }

  setSearchFilters(){
    this.filteredMovies = [];
    for (let movie of this.queriedMovies){
      if((movie.release_date == this.selectedYear || this.selectedYear == '')
          && (movie.rating == this.selectedRating || this.selectedRating == ''))
        this.filteredMovies.push(movie);
    }
  }

  resetSearchFilters(){
    this.selectedYear = '';
    this.selectedRating = '';
    this.filteredMovies = this.queriedMovies;
  }
}

