import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ReactiveFormsModule, JsonPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {

  counterSignal = signal(0);

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required]),
  });

  // Signal to track form values
  formValuesSignal = signal(this.form.value);

  increment() {
    this.counterSignal.set(this.counterSignal() + 1);
  }

  decrement() {
    this.counterSignal.set(this.counterSignal() - 1);
  }

  // Update form values signal when form changes
  onFormChange() {
    this.formValuesSignal.set(this.form.value);
  }

  // Get form controls for template
  get nameControl() {
    return this.form.get('name');
  }

  get emailControl() {
    return this.form.get('email');
  }

  get messageControl() {
    return this.form.get('message');
  }
}
