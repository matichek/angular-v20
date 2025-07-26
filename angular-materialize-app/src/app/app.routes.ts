import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { FormsComponent } from './pages/forms/forms';
import { FormAndTableComponent } from './pages/form-and-table/form-and-table';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'forms', component: FormsComponent },
  { path: 'form-and-table', component: FormAndTableComponent },
  { path: '**', redirectTo: '' } // Wildcard route for 404 page
];
