import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedticketsComponent } from './purchasedtickets.component';

describe('PurchasedticketsComponent', () => {
  let component: PurchasedticketsComponent;
  let fixture: ComponentFixture<PurchasedticketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasedticketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasedticketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
