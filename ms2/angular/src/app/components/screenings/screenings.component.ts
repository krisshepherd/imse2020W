import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Screening } from 'src/app/dataclasses/screening';
import { AuthService } from 'src/app/services/auth-service.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-screenings',
  templateUrl: './screenings.component.html',
  styleUrls: ['./screenings.component.scss']
})
export class ScreeningsComponent implements OnInit {

  screenings: Screening[] = [];
  userLoggedIn: boolean = false;
  selectedRow: number = 0;
  selectedSeat: string = '';

  constructor(private route: ActivatedRoute,
              private backendService:BackendService,
              private authService: AuthService,
              private router:Router) {
    this.authService.loggedIn$.subscribe( value => {
      this.userLoggedIn = value;
    });
  }

  ngOnInit(): void {
    let title: any = this.route.snapshot.paramMap.get('title');
    let releaseDate: any = this.route.snapshot.paramMap.get('releasedate');
    this.backendService.getScreenings(title, releaseDate).subscribe( screenings => {
      this.screenings = screenings;
    });
  }

  selectRow(row: number){
    this.selectedRow = row;
  }

  selectSeat(seat: string){
    this.selectedSeat = seat;
  }

  buyOnsiteTicket(screening: Screening){
    let token = this.authService.getToken();
    this.backendService.buyOnsiteTicket(token, screening, this.selectedRow, this.selectedSeat)
      .subscribe( () => this.router.navigate(['/user/profile']));
  }

  buyStreamTicket(screening: Screening){
    let token = this.authService.getToken();
    this.backendService.buyStreamTicket(token, screening)
      .subscribe( () => this.router.navigate(['/user/profile']));
  }

}
