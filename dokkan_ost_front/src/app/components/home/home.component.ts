import { Component, inject } from '@angular/core';

import { CardsComponent } from '../all-cards/cards/card-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
