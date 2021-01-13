import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: String = '';
  password : String = '';
  showSpinner = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.loggedIn$.subscribe( value => {
      this.router.navigate(['']);
      this.showSpinner = false;
    });
  }

  ngOnInit(): void {
  }

  loginUser(){
    this.authService.loginUser(this.email, this.password);
    this.showSpinner = true;
  }

}
