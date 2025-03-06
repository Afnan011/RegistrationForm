import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  onClick() {
    console.log('Button clicked!');
  }
  title = 'RegistrationForm';
}
