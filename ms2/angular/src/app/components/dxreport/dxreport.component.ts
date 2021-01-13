import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-dxreport',
  templateUrl: './dxreport.component.html',
  styleUrls: ['./dxreport.component.scss']
})
export class DxreportComponent implements OnInit {

  total = 0;
  dxSales = 0;
  dxPercent = 0;
  nonDxSales = 0;
  nonDxPercent = 0;
  
  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.getDxSales().subscribe( result => {
      this.total = result["total"];
      this.dxSales = result["dxsales"];
      this.nonDxSales = result["total"]-result["dxsales"];
      this.dxPercent = this.dxSales/this.total * 100;
      this.nonDxPercent = this.nonDxSales/this.total * 100;
    });
  }

}
