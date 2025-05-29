import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { FormsComponent } from './pages/forms/forms';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'forms', component: FormsComponent },
  { path: '**', redirectTo: '' } // Wildcard route for 404 page
];
