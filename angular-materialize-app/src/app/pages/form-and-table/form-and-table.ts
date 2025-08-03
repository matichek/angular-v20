import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ExtrasService } from '../../services/extras.services';
import { Extra } from '../../models/extras.model';

declare var M: any;

interface Passenger {
  id: number;
  name: string;
  surname: string;
  email: string;
  address: string;
  postNumber: string;
  post: string;
  isFormHolder: boolean;
  assignedRoom?: number;
}

interface Room {
  id: number;
  bedCount: number;
  passengers: Passenger[];
}

@Component({
  selector: 'app-form-and-table',
  templateUrl: './form-and-table.html',
  styleUrls: ['./form-and-table.scss'],
  imports: [JsonPipe],
  providers: [ExtrasService]
})
export class FormAndTableComponent implements AfterViewInit {
  passengerCount = 0;
  roomCount = 0;
  passengers: Passenger[] = [];
  rooms: Room[] = [];
  debugData: any = {};
  usedIds = new Set<string>(); // Track used IDs to ensure uniqueness
  passengerIds = new Map<string, string>(); // Store passenger IDs by form element
  extras: Extra[] = [];
  passengerExtras: Map<string, Set<number>> = new Map(); // Track extras for each passenger

  constructor(private cdr: ChangeDetectorRef, private extrasService: ExtrasService) {}

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

    // Load extras automatically
    this.loadExtras();

    // Set up form change listeners for real-time updates
    this.setupFormListeners();

    // Initial debug data update
    this.updateDebugData();

    // Expose component to window for script access
    (window as any).angularComponent = this;
  }

  setupFormListeners() {
    // Listen for changes in the main form
    const form = document.getElementById('form');
    if (form) {
      form.addEventListener('input', () => {
        this.updateDebugData();
      });
      form.addEventListener('change', () => {
        this.updateDebugData();
      });
    }
  }

    addPassenger() {
    this.passengerCount++;
    console.log('Adding passenger number:', this.passengerCount);

    // Generate extras checkboxes dynamically only if extras are loaded
    const extrasCheckboxes = this.extras.length > 0 ? this.extras.map(extra => `
      <p>
        <label>
          <input type="checkbox" id="extra-${extra.id}-${this.passengerCount}" class="filled-in"
                 onchange="document.dispatchEvent(new CustomEvent('togglePassengerExtra', {detail: {passengerId: 'passenger-${this.passengerCount}', extraId: ${extra.id}}}))" />
          <span>${extra.name} - $${extra.price}</span>
        </label>
      </p>
    `).join('') : '<p>Loading extras...</p>';

    // Create new passenger form
    const newForm = document.createElement('div');
    newForm.className = 'passenger-form card';
        newForm.innerHTML = `
      <div class="card-content">
        <div class="card-title">
          <span><i class="material-icons">person</i> Passenger ${this.passengerCount}</span>
          <button class="btn-small red waves-effect waves-light" onclick="document.dispatchEvent(new CustomEvent('removePassenger', {detail: ${this.passengerCount}}))">
            <i class="material-icons">delete</i>
          </button>
        </div>
        <div class="row">
          <div class="input-field col s6">
            <i class="material-icons prefix">person</i>
            <input id="name-${this.passengerCount}" type="text" class="validate">
            <label for="name-${this.passengerCount}">Name</label>
          </div>
          <div class="input-field col s6">
            <i class="material-icons prefix">person_outline</i>
            <input id="surname-${this.passengerCount}" type="text" class="validate">
            <label for="surname-${this.passengerCount}">Surname</label>
          </div>
          <div class="input-field col s12">
            <i class="material-icons prefix">email</i>
            <input id="email-${this.passengerCount}" type="email" class="validate">
            <label for="email-${this.passengerCount}">Email</label>
          </div>
          <div class="input-field col s12">
            <i class="material-icons prefix">location_on</i>
            <input id="address-${this.passengerCount}" type="text" class="validate">
            <label for="address-${this.passengerCount}">Address</label>
          </div>
          <div class="input-field col s6">
            <i class="material-icons prefix">markunread_mailbox</i>
            <input id="post-number-${this.passengerCount}" type="text" class="validate">
            <label for="post-number-${this.passengerCount}">Post Number</label>
          </div>
          <div class="input-field col s6">
            <i class="material-icons prefix">business</i>
            <input id="post-${this.passengerCount}" type="text" class="validate">
            <label for="post-${this.passengerCount}">Post</label>
          </div>
          <div class="input-field col s12 mb-20">
            <label for="form-holder-${this.passengerCount}">
              <input id="form-holder-${this.passengerCount}" type="checkbox" class="filled-in validate">
              <span><i class="material-icons tiny">verified_user</i> Form holder</span>
            </label>
          </div>

          <div class="input-field col s12">
            <i class="material-icons prefix">attach_money</i>
            <div class="passenger-extras">
              <label>Select Extras:</label>
              <div class="extras-checkboxes">
                ${extrasCheckboxes}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add to form
    const form = document.getElementById('form');
    if (form) {
      form.appendChild(newForm);
      console.log('Passenger form added successfully');

      // Initialize Materialize components for the new form
      M.updateTextFields();

      // Add event listeners to the new form
      this.addFormListeners(newForm);

      // Update debug data
      this.updateDebugData();

      // Refresh room dropdowns to include new passenger
      this.refreshRoomDropdowns();
    } else {
      console.error('Form element not found!');
    }
  }

  private refreshRoomDropdowns() {
    // Find all room cards and update their passenger assignment dropdowns
    const roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach((roomCard, roomIndex) => {
      const roomNumber = roomIndex + 1;
      const passengerSelect = roomCard.querySelector(`#passenger-assignment-${roomNumber}`) as HTMLSelectElement;
      if (passengerSelect) {
        const passengerOptions = this.getPassengerOptions();
        passengerSelect.innerHTML = `
          <option value="" disabled>Assign passengers</option>
          ${passengerOptions}
        `;
        // Reinitialize Materialize select
        M.FormSelect.init(passengerSelect);
      }
    });
  }

    loadExtras() {
    this.extrasService.getExtras().subscribe({
      next: (extras: Extra[]) => {
        this.extras = extras;
        console.log('Extras loaded automatically:', extras);
        this.cdr.detectChanges();

        // Refresh extras display for existing passengers
        this.refreshPassengerExtras();
      },
      error: (error) => {
        console.error('Error loading extras:', error);
        // Fallback to static extras if HTTP request fails
        this.extras = [
          { id: 1, name: "Extra 1", description: "Description 1", price: 100 },
          { id: 2, name: "Extra 2", description: "Description 2", price: 200 },
          { id: 3, name: "Extra 3", description: "Description 3", price: 300 }
        ];
        this.cdr.detectChanges();
        this.refreshPassengerExtras();
      }
    });
  }

  private refreshPassengerExtras() {
    // Find all passenger forms and update their extras sections
    const passengerForms = document.querySelectorAll('.passenger-form');
    passengerForms.forEach((form, index) => {
      const extrasContainer = form.querySelector('.extras-checkboxes');
      if (extrasContainer && this.extras.length > 0) {
        // Extract the actual passenger number from the form's input IDs
        const nameInput = form.querySelector('input[id^="name-"]') as HTMLInputElement;
        let passengerNumber = 1; // default
        if (nameInput) {
          const match = nameInput.id.match(/name-(\d+)/);
          if (match) {
            passengerNumber = parseInt(match[1]);
          }
        }

        const newExtrasCheckboxes = this.extras.map(extra => `
          <p>
            <label>
              <input type="checkbox" id="extra-${extra.id}-${passengerNumber}" class="filled-in"
                     onchange="document.dispatchEvent(new CustomEvent('togglePassengerExtra', {detail: {passengerId: 'passenger-${passengerNumber}', extraId: ${extra.id}}}))" />
              <span>${extra.name} - $${extra.price}</span>
            </label>
          </p>
        `).join('');
        extrasContainer.innerHTML = newExtrasCheckboxes;
      }
    });
  }

  listExtras() {
    this.loadExtras();
  }

    togglePassengerExtra(passengerId: string, extraId: number) {
    // Normalize passenger ID to match the format used in getFormData
    let normalizedPassengerId: string;
    if (passengerId === 'form-holder') {
      normalizedPassengerId = 'form-holder';
    } else {
      // Extract passenger number from format like 'passenger-1'
      const match = passengerId.match(/passenger-(\d+)/);
      if (match) {
        normalizedPassengerId = `passenger-${match[1]}`;
      } else {
        normalizedPassengerId = passengerId;
      }
    }

    if (!this.passengerExtras.has(normalizedPassengerId)) {
      this.passengerExtras.set(normalizedPassengerId, new Set());
    }

    const passengerExtraSet = this.passengerExtras.get(normalizedPassengerId)!;
    if (passengerExtraSet.has(extraId)) {
      passengerExtraSet.delete(extraId);
    } else {
      passengerExtraSet.add(extraId);
    }

    console.log(`Passenger ${normalizedPassengerId} extras:`, Array.from(passengerExtraSet));
    this.updateDebugData();
  }



  isPassengerExtraSelected(passengerId: string, extraId: number): boolean {
    const passengerExtraSet = this.passengerExtras.get(passengerId);
    return passengerExtraSet ? passengerExtraSet.has(extraId) : false;
  }

  removePassenger(passengerId: number) {
    // Find the passenger form by looking for the specific passenger number in the card content
    const passengerForms = document.querySelectorAll('.passenger-form');
    let passengerFormToRemove: Element | null = null;

    for (const form of passengerForms) {
      const cardTitle = form.querySelector('.card-title');
      if (cardTitle && cardTitle.textContent?.includes(`Passenger ${passengerId}`)) {
        passengerFormToRemove = form;
        break;
      }
    }

    if (passengerFormToRemove) {
      passengerFormToRemove.remove();
      console.log(`Passenger ${passengerId} removed`);

      // We don't need to decrement passengerCount as we are now relying on querying the DOM
      // this.passengerCount = Math.max(0, this.passengerCount - 1);

      // Update debug data
      this.updateDebugData();

      // Refresh room dropdowns to remove the deleted passenger
      this.refreshRoomDropdowns();
    } else {
      console.error(`Passenger ${passengerId} not found for removal`);
    }
  }

  addRoom() {
    this.roomCount++;
    console.log('Adding room number:', this.roomCount);

    // Get all passenger names for the dropdown
    const passengerOptions = this.getPassengerOptions();

    // Create new room card
    const newRoom = document.createElement('div');
    newRoom.className = 'room-card card';
    newRoom.innerHTML = `
      <div class="card-content">
        <div class="card-title">
          <span><i class="material-icons">hotel</i> Room ${this.roomCount}</span>
          <button class="btn-small red waves-effect waves-light" onclick="document.dispatchEvent(new CustomEvent('removeRoom', {detail: ${this.roomCount}}))">
            <i class="material-icons">delete</i>
          </button>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <i class="material-icons prefix">bed</i>
            <select id="bed-count-${this.roomCount}" class="validate">
              <option value="" disabled selected>Choose bed count</option>
              <option value="1">1 Bed</option>
              <option value="2">2 Beds</option>
              <option value="3">3 Beds</option>
            </select>
            <label for="bed-count-${this.roomCount}">Bed Count</label>
          </div>
          <div class="input-field col s12">
            <i class="material-icons prefix">group</i>
            <select id="passenger-assignment-${this.roomCount}" class="validate" multiple>
              <option value="" disabled>Assign passengers</option>
              ${passengerOptions}
            </select>
            <label for="passenger-assignment-${this.roomCount}">Assign Passengers</label>
          </div>
        </div>
          </div>
        `;

    // Add to rooms container
    const roomsContainer = document.getElementById('rooms-container');
    if (roomsContainer) {
      roomsContainer.appendChild(newRoom);
      console.log('Room card added successfully');

      // Initialize Materialize select for the new room
      M.FormSelect.init(newRoom.querySelectorAll('select'));

      // Add event listeners to the new room
      this.addRoomListeners(newRoom);

      // Update debug data
      this.updateDebugData();
    } else {
      console.error('Rooms container not found!');
    }
  }

  removeRoom(roomId: number) {
    // Find the room card by looking for the specific room ID in the card content
    const roomCards = document.querySelectorAll('.room-card');
    let roomCardToRemove: Element | null = null;

    for (const card of roomCards) {
      const cardTitle = card.querySelector('.card-title');
      if (cardTitle && cardTitle.textContent?.includes(`Room ${roomId}`)) {
        roomCardToRemove = card;
        break;
      }
    }

    if (roomCardToRemove) {
      roomCardToRemove.remove();
      console.log(`Room ${roomId} removed`);
      this.updateDebugData();
    } else {
      console.error(`Room ${roomId} not found for removal`);
    }
  }

  addFormListeners(element: HTMLElement) {
    element.addEventListener('input', () => {
      this.updateDebugData();
    });
    element.addEventListener('change', () => {
      this.updateDebugData();
    });

    // Also listen for checkbox changes specifically
    const checkboxes = element.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateDebugData();
      });
    });
  }

  addRoomListeners(element: HTMLElement) {
    element.addEventListener('change', () => {
      this.updateDebugData();
    });

    // Listen for select changes specifically
    const selects = element.querySelectorAll('select');
    selects.forEach(select => {
      select.addEventListener('change', () => {
        this.updateDebugData();
      });
    });
  }

  updateDebugData() {
    this.debugData = this.handleSubmit();
    console.log('Debug data updated:', this.debugData);

    // Force change detection
    this.cdr.detectChanges();
  }

  handleSubmit() {
    const passengers: any[] = [];

    // Get form holder data (first form)
    const formHolderData = this.getFormData('', true);
    if (formHolderData) {
      passengers.push(formHolderData);
    }

    // Get data from dynamically added passenger forms
    const passengerForms = document.querySelectorAll('.passenger-form');
    passengerForms.forEach(form => {
      // Extract the actual passenger number from the form's input ID to ensure we get the right one
      const nameInput = form.querySelector('input[id^="name-"]') as HTMLInputElement;
      if (nameInput) {
        const match = nameInput.id.match(/name-(\d+)/);
        if (match) {
          const passengerNumber = match[1];
          const suffix = `-${passengerNumber}`;
          const passengerData = this.getFormData(suffix, false);
          if (passengerData) {
            passengers.push(passengerData);
          }
        }
      }
    });

    // Get room assignments with passenger IDs
    const rooms = this.getRoomDataWithPassengerIds(passengers);

    // Create final object
    const submitData = {
      totalPassengers: passengers.length,
      passengers: passengers,
      rooms: rooms
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

    // Only return data if at least name and surname are provided
    if (name && surname) {
      // Get or generate consistent passenger ID
      const passengerId = this.getOrCreatePassengerId(suffix, isFormHolder);

      // Get passenger extras - handle both form holder and added passengers
      let passengerKey: string;
      if (isFormHolder) {
        passengerKey = 'form-holder';
      } else {
        // For added passengers, extract the passenger number from the suffix
        const passengerNumber = suffix.replace('-', '');
        passengerKey = `passenger-${passengerNumber}`;
      }

      const passengerExtras = this.passengerExtras.get(passengerKey) || new Set();
      const selectedExtras = this.extras.filter(extra => passengerExtras.has(extra.id));

      return {
        id: passengerId,
        name: name,
        surname: surname,
        email: email || '',
        address: address || '',
        postNumber: postNumber || '',
        post: post || '',
        isFormHolder: isFormHolder,
        selectedExtras: selectedExtras,
        extrasTotal: selectedExtras.reduce((sum, extra) => sum + extra.price, 0)
      };
    }

    return null;
  }

  private getOrCreatePassengerId(suffix: string, isFormHolder: boolean): string {
    const key = isFormHolder ? 'form-holder' : `passenger${suffix}`;

    // Check if we already have an ID for this passenger
    if (this.passengerIds.has(key)) {
      return this.passengerIds.get(key)!;
    }

    // Generate new unique ID
    const newId = this.generateUniqueId();
    this.passengerIds.set(key, newId);
    this.usedIds.add(newId);

    return newId;
  }

  private generateUniqueId(): string {
    let newId: string;
    do {
      newId = Math.floor(Math.random() * 100000000).toString(); // Generate a random 8-digit number
    } while (this.usedIds.has(newId)); // Ensure it's unique
    return newId;
  }

  private getRoomDataWithPassengerIds(passengers: any[]) {
    const rooms: any[] = [];

    for (let i = 1; i <= this.roomCount; i++) {
      const bedCountSelect = document.getElementById(`bed-count-${i}`) as HTMLSelectElement;
      const passengerSelect = document.getElementById(`passenger-assignment-${i}`) as HTMLSelectElement;

      if (bedCountSelect && bedCountSelect.value) {
        // Get assigned passenger IDs
        const assignedPassengerIds: string[] = [];
        if (passengerSelect) {
          const selectedOptions = Array.from(passengerSelect.selectedOptions);
          selectedOptions.forEach(option => {
            if (option.value && option.value !== '') {
              assignedPassengerIds.push(option.value);
            }
          });
        }

        const room = {
          roomId: i,
          bedCount: parseInt(bedCountSelect.value),
          assignedPassengers: assignedPassengerIds
        };
        rooms.push(room);
      }
    }

    return rooms;
  }

  private getPassengerOptions(): string {
    let options = '';

    // Get all currently assigned passengers
    const assignedPassengers = this.getAssignedPassengers();

    // Add form holder (first passenger) if not already assigned
    const formHolderName = (document.getElementById('name') as HTMLInputElement)?.value;
    const formHolderSurname = (document.getElementById('surname') as HTMLInputElement)?.value;
    if (formHolderName && formHolderSurname) {
      // Get consistent form holder ID
      const formHolderId = this.getOrCreatePassengerId('', true);
      if (!assignedPassengers.includes(formHolderId)) {
        options += `<option value="${formHolderId}">${formHolderName} ${formHolderSurname} (Form Holder)</option>`;
      }
    }

    // Add additional passengers if not already assigned
    const passengerForms = document.querySelectorAll('.passenger-form');
    passengerForms.forEach(form => {
      const nameInput = form.querySelector('input[id^="name-"]') as HTMLInputElement;
      const surnameInput = form.querySelector('input[id^="surname-"]') as HTMLInputElement;

      if (nameInput && surnameInput && nameInput.value && surnameInput.value) {
        const match = nameInput.id.match(/name-(\d+)/);
        if (match) {
          const passengerNumber = match[1];
          const suffix = `-${passengerNumber}`;
          const passengerId = this.getOrCreatePassengerId(suffix, false);
          if (!assignedPassengers.includes(passengerId)) {
            options += `<option value="${passengerId}">${nameInput.value} ${surnameInput.value} (Passenger ${passengerNumber})</option>`;
          }
        }
      }
    });

    return options;
  }

  private getAssignedPassengers(): string[] {
    const assignedPassengers: string[] = [];

    // Check all existing rooms for assigned passengers
    for (let i = 1; i <= this.roomCount; i++) {
      const passengerSelect = document.getElementById(`passenger-assignment-${i}`) as HTMLSelectElement;
      if (passengerSelect) {
        const selectedOptions = Array.from(passengerSelect.selectedOptions);
        selectedOptions.forEach(option => {
          if (option.value && option.value !== '') {
            assignedPassengers.push(option.value);
          }
        });
      }
    }

    return assignedPassengers;
  }
}
