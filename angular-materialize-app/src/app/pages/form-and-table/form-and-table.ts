import { Component, AfterViewInit } from '@angular/core';


declare var M: any;


@Component({
  selector: 'app-form-and-table',
  templateUrl: './form-and-table.html',
  styleUrls: ['./form-and-table.scss']
})
export class FormAndTableComponent implements AfterViewInit {
  passengerCount = 0;

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

  addPassenger() {
    this.passengerCount++;
    console.log('Adding passenger number:', this.passengerCount);

    // Create new passenger form
    const newForm = document.createElement('div');
    newForm.className = 'passenger-form card';
    newForm.innerHTML = `
      <div class="card-content">
        <span class="card-title">Passenger ${this.passengerCount}</span>
        <div class="row">
          <div class="input-field col s6">
            <input id="name-${this.passengerCount}" type="text" class="validate">
            <label for="name-${this.passengerCount}">Name</label>
          </div>
          <div class="input-field col s6">
            <input id="surname-${this.passengerCount}" type="text" class="validate">
            <label for="surname-${this.passengerCount}">Surname</label>
          </div>
          <div class="input-field col s12">
            <input id="email-${this.passengerCount}" type="email" class="validate">
            <label for="email-${this.passengerCount}">Email</label>
          </div>
          <div class="input-field col s12">
            <input id="address-${this.passengerCount}" type="text" class="validate">
            <label for="address-${this.passengerCount}">Address</label>
          </div>
          <div class="input-field col s12">
            <input id="post-number-${this.passengerCount}" type="text" class="validate">
            <label for="post-number-${this.passengerCount}">Post Number</label>
          </div>
          <div class="input-field col s12">
            <input id="post-${this.passengerCount}" type="text" class="validate">
            <label for="post-${this.passengerCount}">Post</label>
          </div>
          <div class="input-field col s12 mb-20">
            <label for="form-holder-${this.passengerCount}">
              <input id="form-holder-${this.passengerCount}" type="checkbox" class="validate">
              <span>Horm holder</span>
            </label>
          </div>
        </div>
      </div>
    `;

    // Add to form
    const form = document.getElementById('form');
    if (form) {
      form.appendChild(newForm);
      console.log('Passenger form added successfully');
    } else {
      console.error('Form element not found!');
    }
  }

  handleSubmit() {
    const passengers: any[] = [];

    // Get form holder data (first form)
    const formHolderData = this.getFormData('', true);
    if (formHolderData) {
      passengers.push(formHolderData);
    }

    // Get additional passengers data
    for (let i = 1; i <= this.passengerCount; i++) {
      const passengerData = this.getFormData(`-${i}`, false);
      if (passengerData) {
        passengers.push(passengerData);
      }
    }

    // Create final object
    const submitData = {
      totalPassengers: passengers.length,
      passengers: passengers
    };

    console.log('Form submission data:', submitData);
    return submitData;
  }

  private getFormData(suffix: string, isFormHolder: boolean) {
    const name = (document.getElementById(`name${suffix}`) as HTMLInputElement)?.value;
    const surname = (document.getElementById(`surname${suffix}`) as HTMLInputElement)?.value;
    const email = (document.getElementById(`email${suffix}`) as HTMLInputElement)?.value;
    const address = (document.getElementById(`address${suffix}`) as HTMLInputElement)?.value;
    const postNumber = (document.getElementById(`post-number${suffix}`) as HTMLInputElement)?.value;
    const post = (document.getElementById(`post${suffix}`) as HTMLInputElement)?.value;
    const isHormHolder = (document.getElementById(`form-holder${suffix}`) as HTMLInputElement)?.checked;

    // Only return data if at least name and surname are provided
    if (name && surname) {
      return {
        name: name,
        surname: surname,
        email: email || '',
        address: address || '',
        postNumber: postNumber || '',
        post: post || '',
        isHormHolder: isHormHolder || false,
        isFormHolder: isFormHolder
      };
    }

    return null;
  }
}
