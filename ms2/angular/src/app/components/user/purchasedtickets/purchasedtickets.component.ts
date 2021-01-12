import { Component, OnInit } from '@angular/core';
import { Onsite } from 'src/app/dataclasses/onsite';
import { Streaming } from 'src/app/dataclasses/streaming';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-purchasedtickets',
  templateUrl: './purchasedtickets.component.html',
  styleUrls: ['./purchasedtickets.component.scss']
})
export class PurchasedticketsComponent implements OnInit {

  onsiteTickets: Onsite[] = [];
  streamingTickets: Streaming[] = [];

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.getOnsiteTickets().subscribe(
      tickets => this.onsiteTickets = tickets
    )
    this.backendService.getStreamingTickets().subscribe(
      tickets => this.streamingTickets = tickets
    )
  }

}
