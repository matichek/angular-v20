param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectName
)

Write-Host "Creating Angular v20 project with Materialize CSS..." -ForegroundColor Green

# Create Angular project
npx @angular/cli@20 new $ProjectName --routing --style=scss --skip-git

# Navigate to project directory
Set-Location $ProjectName

# Install Materialize CSS
npm install materialize-css@next @types/materialize-css

Write-Host "Configuring Materialize CSS..." -ForegroundColor Yellow

# Update angular.json to include Materialize CSS
$angularJson = Get-Content "angular.json" | ConvertFrom-Json
$angularJson.projects.$ProjectName.architect.build.options.styles = @(
    "node_modules/materialize-css/dist/css/materialize.min.css",
    "src/styles.scss"
)
$angularJson.projects.$ProjectName.architect.build.options.scripts = @(
    "node_modules/materialize-css/dist/js/materialize.min.js"
)
$angularJson.projects.$ProjectName.architect.test.options.styles = @(
    "node_modules/materialize-css/dist/css/materialize.min.css",
    "src/styles.scss"
)
$angularJson.projects.$ProjectName.architect.test.options.scripts = @(
    "node_modules/materialize-css/dist/js/materialize.min.js"
)
$angularJson | ConvertTo-Json -Depth 10 | Set-Content "angular.json"

# Update index.html to include Material Icons
$indexHtml = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>$($ProjectName)</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
</body>
</html>
"@
$indexHtml | Set-Content "src/index.html"

# Update app component
$appComponent = @"
import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

declare var M: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements AfterViewInit {
  title = '$ProjectName';

  ngAfterViewInit() {
    // Initialize Materialize components
    M.AutoInit();
  }
}
"@
$appComponent | Set-Content "src/app/app.ts"

# Update main.ts to fix import
$mainTs = @"
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
"@
$mainTs | Set-Content "src/main.ts"

# Create demo template
$appTemplate = @"
<nav class="blue">
  <div class="nav-wrapper container">
    <a href="#" class="brand-logo">{{ title }}</a>
    <ul id="nav-mobile" class="right hide-on-med-and-down">
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </div>
</nav>

<div class="container" style="margin-top: 2rem;">
  <div class="row">
    <div class="col s12">
      <h1>Welcome to Angular v20 with Materialize CSS</h1>
      <p class="flow-text">This is a demo showcasing Materialize components in Angular v20.</p>
    </div>
  </div>

  <div class="row">
    <div class="col s12 m6">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">Card Title</span>
          <p>I am a very simple card. I am good at containing small bits of information.</p>
        </div>
        <div class="card-action">
          <a href="#" class="yellow-text">This is a link</a>
          <a href="#" class="yellow-text">This is a link</a>
        </div>
      </div>
    </div>
    <div class="col s12 m6">
      <div class="card teal">
        <div class="card-content white-text">
          <span class="card-title">Another Card</span>
          <p>Materialize CSS provides a beautiful Material Design framework.</p>
        </div>
        <div class="card-action">
          <a href="#" class="yellow-text">Action 1</a>
          <a href="#" class="yellow-text">Action 2</a>
        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col s12">
      <h4>Form Example</h4>
      <div class="row">
        <form class="col s12">
          <div class="row">
            <div class="input-field col s6">
              <input id="first_name" type="text" class="validate">
              <label for="first_name">First Name</label>
            </div>
            <div class="input-field col s6">
              <input id="last_name" type="text" class="validate">
              <label for="last_name">Last Name</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input id="email" type="email" class="validate">
              <label for="email">Email</label>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <button class="btn waves-effect waves-light" type="submit">
                Submit
                <i class="material-icons right">send</i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col s12">
      <h4>Buttons</h4>
      <a class="waves-effect waves-light btn">button</a>
      <a class="waves-effect waves-light btn red">red</a>
      <a class="waves-effect waves-light btn green">green</a>
      <a class="waves-effect waves-light btn purple">purple</a>
    </div>
  </div>
</div>

<router-outlet></router-outlet>
"@
$appTemplate | Set-Content "src/app/app.html"

Write-Host "Angular v20 project with Materialize CSS created successfully!" -ForegroundColor Green
Write-Host "Run 'ng serve' to start the development server." -ForegroundColor Cyan 