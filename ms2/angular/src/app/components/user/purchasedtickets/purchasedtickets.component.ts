import { Component, OnInit } from '@angular/core';
import { Onsite } from 'src/app/dataclasses/onsite';
import { Streaming } from 'src/app/dataclasses/streaming';
import { AuthService } from 'src/app/services/auth-service.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-purchasedtickets',
  templateUrl: './purchasedtickets.component.html',
  styleUrls: ['./purchasedtickets.component.scss']
})
export class PurchasedticketsComponent implements OnInit {

  onsiteTickets: Onsite[] = [];
  streamingTickets: Streaming[] = [];

  constructor(private backendService: BackendService, private authService: AuthService) { }

  ngOnInit(): void {
    let token = this.authService.getToken();
    this.backendService.getOnsiteTickets(token).subscribe( tickets => this.onsiteTickets = tickets);
    this.backendService.getStreamingTickets(token).subscribe( tickets => this.streamingTickets = tickets);
  }

  refundTicket(ticket: Onsite){
    this.backendService.refundTicket(ticket).subscribe( ()=> {
      this.ngOnInit();
    });
  }
}
