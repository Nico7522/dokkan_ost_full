import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Card, CardDetails } from '../../models/card';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private readonly _httpClient = inject(HttpClient);
  constructor() {}

  getCards(): Observable<Card[]> {
    return this._httpClient.get<Card[]>('http://localhost:3000/cards');
  }

  getCardById(id: number) {
    return this._httpClient.get<CardDetails>(
      'http://localhost:3200/cards/' + id
    );
  }
}
