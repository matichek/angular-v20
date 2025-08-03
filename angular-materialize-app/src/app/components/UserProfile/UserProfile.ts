import { Component, signal, input } from "@angular/core";

@Component({
  selector: 'user-profile',
  template: `<h1>User Profil component test for {{userName()}}</h1>`
})
export class UserProfileComponent {
  userName = input.required<string>();
}
