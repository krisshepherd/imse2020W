import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

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
  yearsList: string[] = ['2007', '2008', '2012', '2014', '2018', '2020'];
  ages: Age[] = [
    {value: '12A-0', viewValue: '12A'},
    {value: '14A-1', viewValue: '14A'},
    {value: '16A-2', viewValue: '16A'},
    {value: '18A-2', viewValue: '18A'}
  ];
  movies = [
    { name: 'Iron Man', releaseDate: '2008', runtime: '02:06:00', director: 'Jon Favreau', rating: '12A'},
    { name: 'Iron Man 2', releaseDate: '2010', runtime: '02:06:00', director: 'Jon Favreau', rating: '12A'},
    { name: 'Iron Man 3', releaseDate: '2012', runtime: '02:06:00', director: 'Jon Favreau', rating: '12A'},
    { name: 'The Avengers', releaseDate: '2014', runtime: '02:06:00', director: 'Jon Favreau', rating: '12A'}
  ]
  constructor() { }

  ngOnInit(): void {
  }

}

