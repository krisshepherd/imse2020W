import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password : string = '';
  showSpinner = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  loginUser(){
    this.authService.loginUser(this.email, this.password);
    this.router.navigate(['']);
  }

}
