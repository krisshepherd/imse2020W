import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DxreportComponent } from './dxreport.component';

describe('DxreportComponent', () => {
  let component: DxreportComponent;
  let fixture: ComponentFixture<DxreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DxreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DxreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
