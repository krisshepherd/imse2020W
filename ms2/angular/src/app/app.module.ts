import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {MatToolbarModule} from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MoviesComponent } from './components/movies/movies.component';
import { HeaderComponent } from './components/header/header.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { MoviedetailsComponent } from './components/moviedetails/moviedetails.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SignupComponent } from './components/auth/signup/signup.component';
import { UserComponent } from './components/user/user.component';
import { PurchasedticketsComponent } from './components/user/purchasedtickets/purchasedtickets.component';
import { AdultmoviesreportComponent } from './components/adultmoviesreport/adultmoviesreport.component';
import { DxreportComponent } from './components/dxreport/dxreport.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MoviesComponent,
    HeaderComponent,
    StatisticsComponent,
    MoviedetailsComponent,
    LoginComponent,
    SignupComponent,
    UserComponent,
    PurchasedticketsComponent,
    AdultmoviesreportComponent,
    DxreportComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatExpansionModule,
    MatSelectModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
