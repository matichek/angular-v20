import { Component, AfterViewInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

declare var M: any;

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements AfterViewInit {

  ngAfterViewInit() {
    // Initialize Materialize components
    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
  }
}
