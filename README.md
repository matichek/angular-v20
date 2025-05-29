# Angular v20 + Materialize CSS Setup

This workspace contains:
1. A working Angular v20 project with Materialize CSS (`angular-materialize-app/`)
2. A PowerShell script to create new Angular + Materialize projects (`create-angular-materialize-project.ps1`)

## Quick Start

### Option 1: Use the existing project
```bash
cd angular-materialize-app
ng serve
```

### Option 2: Create a new project
```powershell
.\create-angular-materialize-project.ps1 -ProjectName "my-new-app"
cd my-new-app
ng serve
```

## Project Features

### 🎯 Pages & Routing
- **Home Page** (`/`) - Welcome page with cards, quick form, and buttons
- **Forms Page** (`/forms`) - Comprehensive form component examples
- **Header Navigation** - Responsive nav with active route highlighting

### 🔧 Components Architecture
```
src/app/
├── header/                 # Navigation component
│   ├── header.ts          # RouterLink integration
│   ├── header.html        # Nav with dropdown
│   └── header.scss        # Active link styles
├── pages/
│   ├── home/              # Home page component
│   └── forms/             # Forms examples page
├── app.routes.ts          # Route configuration
└── app.ts                 # Main app component
```

### 🎨 Form Components Included

The **Forms page** showcases all Materialize CSS form elements:

#### Input Types
- Text inputs with floating labels
- Email validation with helper text
- Password fields
- Textarea with auto-resize

#### Selection Controls  
- Single & multiple select dropdowns
- Checkboxes (regular, filled-in, indeterminate)
- Radio buttons (regular & with-gap style)
- Toggle switches

#### Advanced Components
- **Date picker** - Calendar selection
- **Time picker** - Time selection  
- **Range sliders** - Numeric input
- **File upload** - Styled file input

#### Form Actions
- Submit buttons with icons
- Reset & cancel buttons
- Ripple wave effects

### 🧭 Navigation Features

#### Header Component
- **Brand logo** linking to home
- **Active route highlighting** with custom CSS
- **Dropdown menu** with Material icons
- **Responsive design** (collapses on mobile)

#### Routing
```typescript
Routes:
'/' → HomeComponent           // Landing page
'/forms' → FormsComponent     // Form examples
'/**' → redirect to home      // 404 handling
```

## Manual Setup (for reference)

If you want to set up Angular v20 with Materialize CSS manually:

1. **Create Angular project:**
   ```bash
   npx @angular/cli@20 new my-app --routing --style=scss --skip-git
   cd my-app
   ```

2. **Install Materialize CSS:**
   ```bash
   npm install materialize-css@next @types/materialize-css
   ```

3. **Configure `angular.json`:**
   Add to `styles` and `scripts` arrays in both `build` and `test` configurations:
   ```json
   "styles": [
     "node_modules/materialize-css/dist/css/materialize.min.css",
     "src/styles.scss"
   ],
   "scripts": [
     "node_modules/materialize-css/dist/js/materialize.min.js"
   ]
   ```

4. **Add Material Icons to `src/index.html`:**
   ```html
   <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
   ```

5. **Initialize Materialize in components:**
   ```typescript
   import { Component, AfterViewInit } from '@angular/core';
   declare var M: any;

   export class MyComponent implements AfterViewInit {
     ngAfterViewInit() {
       M.AutoInit(); // Initialize all components
       // Or specific components:
       M.FormSelect.init(document.querySelectorAll('select'));
       M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));
     }
   }
   ```

## Tech Stack

- ✅ **Angular v20** (with zoneless change detection)
- ✅ **Materialize CSS v2.x** (Material Design framework)
- ✅ **Material Icons** (Google's icon font)
- ✅ **SCSS** (Styling preprocessor)
- ✅ **TypeScript** (Type safety)
- ✅ **Angular Router** (Client-side routing)

## Component Initialization

### Automatic Initialization
```typescript
M.AutoInit(); // Initializes all Materialize components
```

### Manual Initialization (per component)
```typescript
// Forms page - specific component init
M.FormSelect.init(document.querySelectorAll('select'));
M.Datepicker.init(document.querySelectorAll('.datepicker'));
M.Timepicker.init(document.querySelectorAll('.timepicker'));

// Header - dropdown init
M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));
```

## Key Differences from Angular Material

- **Materialize CSS** is a standalone CSS framework based on Google's Material Design
- **Angular Material** is Angular-specific components with tight framework integration
- **Materialize advantages:**
  - More styling control and customization
  - Smaller bundle size
  - CSS-first approach
  - Works with any framework
  - Better for custom Material Design implementations

## TypeScript Integration

The setup includes TypeScript definitions for Materialize CSS:
```typescript
declare var M: any; // Global Materialize object

// Examples:
M.toast({html: 'Hello World'});
M.Modal.init(document.querySelectorAll('.modal'));
M.FormSelect.init(document.querySelectorAll('select'));
```

## Responsive Design

All components are fully responsive using Materialize's grid system:
- **Grid classes:** `s12` (small), `m6` (medium), `l4` (large)
- **Navigation:** Collapses to hamburger menu on mobile
- **Forms:** Stack vertically on smaller screens
- **Cards:** Responsive layout with proper spacing

## Development Notes

- **Angular v20** uses zoneless change detection by default (developer preview)
- **SSR disabled** for simpler setup and faster development
- **SCSS** used for styling consistency and customization
- **Component isolation** with proper imports and routing
- **Auto-initialization** handles all Materialize JavaScript components

## Project Structure

```
angular-materialize-app/
├── src/
│   ├── app/
│   │   ├── header/
│   │   │   ├── header.ts          # Navigation component
│   │   │   ├── header.html        # Nav template
│   │   │   └── header.scss        # Nav styles
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   │   ├── home.ts        # Home page component  
│   │   │   │   ├── home.html      # Home template
│   │   │   │   └── home.scss      # Home styles
│   │   │   └── forms/
│   │   │       ├── forms.ts       # Forms page component
│   │   │       ├── forms.html     # Forms template
│   │   │       └── forms.scss     # Forms styles
│   │   ├── app.ts                 # Root component
│   │   ├── app.html               # Root template
│   │   ├── app.routes.ts          # Route configuration
│   │   └── app.config.ts          # App configuration
│   ├── index.html                 # Material Icons included
│   └── styles.scss                # Global styles
├── angular.json                   # Materialize CSS/JS configured
└── package.json                   # Dependencies
```

## Getting Started

1. **Clone or download** this project
2. **Navigate** to `angular-materialize-app/`
3. **Install dependencies:** `npm install`
4. **Start dev server:** `ng serve`
5. **Open browser:** `http://localhost:4200`
6. **Navigate** between Home and Forms pages
7. **Explore** all the Materialize components and examples! 