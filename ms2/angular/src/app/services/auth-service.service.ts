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

  loginUser(email: string, password: string){
    this.backendService.getUserData(email, password).subscribe(data => {
      console.log(data);
      if(data[0]){
        this.userData.email = data[0].email;
        this.userData.first_name = data[0].first_name;
        this.userData.family_name = data[0].family_name;
        this.userData.birthdate = data[0].birthdate;
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
