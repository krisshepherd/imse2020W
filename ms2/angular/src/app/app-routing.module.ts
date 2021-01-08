import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MoviedetailsComponent } from './moviedetails/moviedetails.component';
import { MoviesComponent } from './movies/movies.component';
import { StatisticsComponent } from './statistics/statistics.component';

const routes: Routes = [
  //{ path: '', component: LoginComponent, pathMatch: 'full' }
  { path: '', component: HomeComponent},
  { path: 'movies', component: MoviesComponent},
  { path: 'statistics', component: StatisticsComponent},
  { path: 'moviedetails', component: MoviedetailsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
