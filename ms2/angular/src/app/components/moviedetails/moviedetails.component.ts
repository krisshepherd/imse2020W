import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { Movie } from 'src/app/dataclasses/movie';


@Component({
  selector: 'app-moviedetails',
  templateUrl: './moviedetails.component.html',
  styleUrls: ['./moviedetails.component.scss']
})
export class MoviedetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService) { }

  movie: Movie = new Movie();

  ngOnInit(): void {
    let title: any = this.route.snapshot.paramMap.get('title');
    let releaseDate: any = this.route.snapshot.paramMap.get('releasedate');
    console.log(title)
    console.log(releaseDate)

    this.backendService.getMovie(title, releaseDate).subscribe( movie => this.movie = movie);    
  }
}
