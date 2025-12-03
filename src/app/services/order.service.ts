import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private lastOrder: Order | null = null;

  createOrder(order: Order) {
    this.lastOrder = order;
    // Simulate server latency while keeping the app self contained
    return of(order).pipe(delay(300));
  }

  getLastOrder(): Order | null {
    return this.lastOrder;
  }
}
