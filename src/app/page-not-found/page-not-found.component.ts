import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  ngOnInit() {
    document.body.classList.add('page-not-found-active');
  }
  
  ngOnDestroy() {
    document.body.classList.remove('page-not-found-active');
  }
}
