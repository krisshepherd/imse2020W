import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userLoggedIn: boolean = false;

  constructor(private authService: AuthService) {
    this.authService.loggedIn$.subscribe( value => {
      this.userLoggedIn = value;
    });
  }

  ngOnInit(): void {
  }

  logOut(){
    this.authService.logoutUser();
  }

}
