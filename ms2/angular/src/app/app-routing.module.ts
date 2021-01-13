import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdultmoviesreportComponent } from './components/adultmoviesreport/adultmoviesreport.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { DxreportComponent } from './components/dxreport/dxreport.component';
import { HomeComponent } from './components/home/home.component';
import { MoviedetailsComponent } from './components/moviedetails/moviedetails.component';
import { MoviesComponent } from './components/movies/movies.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { PurchasedticketsComponent } from './components/user/purchasedtickets/purchasedtickets.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  //{ path: '', component: LoginComponent, pathMatch: 'full' }
  { path: '', component: HomeComponent},
  { path: 'movies', component: MoviesComponent},
  { path: 'statistics', component: StatisticsComponent},
  { path: 'movies/moviedetails/:title/:releasedate', component: MoviedetailsComponent},
  { path: 'auth/login', component: LoginComponent},
  { path: 'auth/signup', component: SignupComponent},
  { path: 'user', component: UserComponent},
  { path: 'user/tickets', component: PurchasedticketsComponent},
  { path: 'adultsales', component: AdultmoviesreportComponent},
  { path: 'dxsales', component: DxreportComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
