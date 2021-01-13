import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/dataclasses/user';
import { AuthService } from 'src/app/services/auth-service.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userData: User = new User();
  credit: number;

  constructor(private authService: AuthService, private backendService: BackendService) {
    this.credit = 0;
  }

  ngOnInit(): void {
    this.userData = this.authService.getUserDetails()
  }

  uploadCredit(){
    if(this.credit != 0){
      this.backendService.addCredit(this.userData.email, this.credit).subscribe( result => {
        this.credit = 0;
        this.userData.discount = result.discount;
      });
    }
  }

}
