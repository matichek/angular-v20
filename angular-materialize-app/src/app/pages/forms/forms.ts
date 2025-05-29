import { Component, AfterViewInit } from '@angular/core';

declare var M: any;

@Component({
  selector: 'app-forms',
  imports: [],
  templateUrl: './forms.html',
  styleUrl: './forms.scss'
})
export class FormsComponent implements AfterViewInit {

  ngAfterViewInit() {
    // Initialize Materialize form components
    M.FormSelect.init(document.querySelectorAll('select'));
    M.Datepicker.init(document.querySelectorAll('.datepicker'));
    M.Timepicker.init(document.querySelectorAll('.timepicker'));

    // Set indeterminate checkbox
    const indeterminateCheckbox = document.getElementById('indeterminate-checkbox');
    if (indeterminateCheckbox) {
      (indeterminateCheckbox as HTMLInputElement).indeterminate = true;
    }
  }
}
