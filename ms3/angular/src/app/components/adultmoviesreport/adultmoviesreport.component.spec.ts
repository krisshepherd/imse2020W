import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdultmoviesreportComponent } from './adultmoviesreport.component';

describe('AdultmoviesreportComponent', () => {
  let component: AdultmoviesreportComponent;
  let fixture: ComponentFixture<AdultmoviesreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdultmoviesreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdultmoviesreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
