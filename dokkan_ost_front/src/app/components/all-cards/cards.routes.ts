import { Route } from '@angular/router';
import { CardComponent } from '../../shared/card/card.component';
import { CardDetailsComponent } from './card-details/card-details.component';
import { CardsComponent } from './cards/card-list.component';

const CARDS_ROUTES: Route[] = [
  {
    path: '',
    component: CardsComponent,
  },
  {
    path: ':id',
    component: CardDetailsComponent,
  },
];

export default CARDS_ROUTES;
