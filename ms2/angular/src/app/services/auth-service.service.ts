import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new Subject<boolean>();
  private token: any;

  loggedIn$ = this.loggedIn.asObservable();

  constructor(private backendService: BackendService) {
    this.loggedIn.next(false);
    this.token = null;
  }

  loginUser(email: string, password: string): void{
    this.backendService.validateUser(email, password).subscribe(data => {
      if(data){
        this.token = data;
        this.loggedIn.next(true);
      } else {
        this.loggedIn.next(false);
      }
    });
  }

  getToken(){
    return this.token;
  }

  logoutUser(): void{
    this.loggedIn.next(false);
    this.token = null;
  }
}
