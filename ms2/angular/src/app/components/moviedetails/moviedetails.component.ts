import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-moviedetails',
  templateUrl: './moviedetails.component.html',
  styleUrls: ['./moviedetails.component.scss']
})
export class MoviedetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backendService: BackendService) { }

  movie: Object;
  title: String;
  releaseDate: number;
  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => { this.title = params.get("title"); this.releaseDate = params.get("releasedate"); } )
    );
    this.backendService.getMovie(this.title, this.releaseDate).subscribe(
      movie => this.movie = movie
    );
  }
}
