import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header';

declare var M: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'angular-materialize-app';

  ngAfterViewInit() {
    // Initialize Materialize components
    M.AutoInit();
  }
}
