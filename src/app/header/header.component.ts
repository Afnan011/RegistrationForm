import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { NavigationEnd, Router, RouterLink } from '@angular/router';


import { filter, Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, KENDO_BUTTONS, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {


  activeRoute: string = 'register'; 
  private routeSubscription: Subscription = new Subscription();

  constructor(private router: Router) {}
  
  ngOnInit(): void {
    const currentUrl = this.router.url.split('/').pop() || 'register';
    this.activeRoute = currentUrl;
    
    this.routeSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        this.activeRoute = url.split('/').pop() || 'register';
      });
  }
  
  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  
  isRouteActive(route: string): boolean {
    return this.activeRoute === route;
  }

}
