import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MoviedetailsComponent } from './components/moviedetails/moviedetails.component';
import { MoviesComponent } from './components/movies/movies.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

const routes: Routes = [
  //{ path: '', component: LoginComponent, pathMatch: 'full' }
  { path: '', component: HomeComponent},
  { path: 'movies', component: MoviesComponent},
  { path: 'statistics', component: StatisticsComponent},
  { path: 'movies/moviedetails', component: MoviedetailsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
