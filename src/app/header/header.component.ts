import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonGroupModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private router: Router) {}

  isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
  }
}
