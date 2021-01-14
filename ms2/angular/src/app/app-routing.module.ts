import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdultmoviesreportComponent } from './components/adultmoviesreport/adultmoviesreport.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { DxreportComponent } from './components/dxreport/dxreport.component';
import { HomeComponent } from './components/home/home.component';
import { MoviedetailsComponent } from './components/moviedetails/moviedetails.component';
import { MoviesComponent } from './components/movies/movies.component';
import { ScreeningsComponent } from './components/screenings/screenings.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { PurchasedticketsComponent } from './components/user/purchasedtickets/purchasedtickets.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'movies', component: MoviesComponent},
  { path: 'statistics', component: StatisticsComponent},
  { path: 'moviedetails/:title/:releasedate', component: MoviedetailsComponent},
  { path: 'screenings/:title/:releasedate', component: ScreeningsComponent},
  { path: 'auth/login', component: LoginComponent},
  { path: 'auth/signup', component: SignupComponent},
  { path: 'user/profile', component: UserComponent},
  { path: 'user/tickets', component: PurchasedticketsComponent},
  { path: 'reports/adultsales', component: AdultmoviesreportComponent},
  { path: 'reports/dxsales', component: DxreportComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
