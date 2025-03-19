import { Component, inject } from '@angular/core';
import { CardsService } from '../../../services/cards/cards.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs';
import { keysToCamel } from '../../../helpers/helpers';
import { AsyncPipe } from '@angular/common';
import { CardComponent } from '../../../shared/card/card.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [AsyncPipe, CardComponent, RouterOutlet],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss',
})
export class CardsComponent {
  private readonly cardService = inject(CardsService);
  private readonly spinnerService = inject(NgxSpinnerService);
  cards$ = this.cardService.getCards().pipe(
    map((cards) => {
      this.spinnerService.show('loader');
      cards = cards.map((c) => keysToCamel(c));
      return cards;
    })
  );
}
