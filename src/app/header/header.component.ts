import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, KENDO_BUTTONS, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router) {}
  
  isRouteActive(route: string): boolean {
    return route == this.router.url.split('/').pop();
  }

}
