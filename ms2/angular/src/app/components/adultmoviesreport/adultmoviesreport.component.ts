import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-adultmoviesreport',
  templateUrl: './adultmoviesreport.component.html',
  styleUrls: ['./adultmoviesreport.component.scss']
})
export class AdultmoviesreportComponent implements OnInit {

  total = 0;
  onsiteSales = 0;
  streamSales = 0;
  onsitePercent = 0;
  streamPercent = 0;

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.getAdultSales().subscribe( result => {
      this.onsiteSales = result["onsite"];
      console.log(this.onsiteSales)
      this.streamSales = result["streaming"];
      console.log(this.streamSales)
      this.total = this.onsiteSales + this.streamSales;
      this.onsitePercent = this.onsiteSales/this.total * 100;
      this.streamPercent = this.streamSales/this.total * 100;
    });
  }

}
