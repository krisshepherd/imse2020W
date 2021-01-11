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
  searchParamYear: string = '';
  searchParamRating: string = '';

  yearsList: Set<string> = new Set();
  selectedYear: string = '';
  ratingList: Set<string> = new Set();
  selectedRating: string = ''

  movies: Movie[] = [];

  constructor(private backendService: BackendService ) {
  }

  ngOnInit(): void {
    this.backendService.getMovies().subscribe(movies => {
      this.movies = movies;
      for (let movie of movies){
        this.yearsList.add(movie.releaseDate);;
        this.ratingList.add(movie.rating);
      }
    });
  }

  selectYear(year: string){
    this.selectedYear = year;
    console.log(year);
  }

  selectRating(rating: string){
    this.selectedRating = rating;
    console.log(rating);
  }

  setDetailedSearchParams(){
    console.log("clicked!!")
    this.searchParamYear = this.selectedYear;
    this.searchParamRating = this.selectedRating;
    console.log(this.selectedYear);
    console.log(this.selectedRating);
  }
}

