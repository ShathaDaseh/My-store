import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { Order } from '../models/order';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private lastOrder: Order | null = null;
  private readonly ordersEndpoint = environment.apiUrl ? `${environment.apiUrl}/orders` : '';
  private readonly hasBackend = !!environment.apiUrl;

  constructor(private http: HttpClient) { }

  createOrder(order: Order) {
    this.lastOrder = order;
    if (!this.hasBackend || !this.ordersEndpoint) {
      return of(order);
    }
    return this.http.post<Order>(this.ordersEndpoint, order).pipe(
      tap(() => (this.lastOrder = order)),
      catchError(() => of(order))
    );
  }

  getLastOrder(): Order | null {
    return this.lastOrder;
  }
}
