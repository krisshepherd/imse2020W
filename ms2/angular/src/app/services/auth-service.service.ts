import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../dataclasses/user';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: User = new User();
  private loggedIn = new Subject<boolean>();

  loggedIn$ = this.loggedIn.asObservable();

  constructor(private backendService: BackendService) {
    this.loggedIn.next(false);
  }

  loginUser(email: String, password: String){
    this.backendService.getUserData(email, password).subscribe(data => {
      if(data){
        this.userData = data;
        this.loggedIn.next(true);
      } else {
        this.loggedIn.next(false);
      }
    });
  }

  logoutUser(){
    this.loggedIn.next(false);
    this.userData = new User();
  }
}
