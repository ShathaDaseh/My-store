import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this.itemsSubject.asObservable();
  private readonly storageKey = 'mystore_cart';
  private readonly cartEndpoint = environment.apiUrl ? `${environment.apiUrl}/cart` : '';
  private readonly hasBackend = !!environment.apiUrl;

  constructor(private http: HttpClient) {
    this.restoreFromStorage();
    this.loadFromBackend();
  }

  addToCart(product: Product, quantity: number): void {
    const normalized = Math.max(1, Number(quantity) || 1);
    const items = [...this.itemsSubject.value];
    const existing = items.find((i) => i.product.id === product.id);

    if (existing) {
      existing.quantity += normalized;
    } else {
      items.push({ product, quantity: normalized });
    }

    this.itemsSubject.next(items);
    this.persist();
  }

  updateQuantity(productId: number, quantity: number): void {
    const normalized = Math.max(1, Number(quantity) || 1);
    const next = this.itemsSubject.value.map((item) =>
      item.product.id === productId ? { ...item, quantity: normalized } : item
    );
    this.itemsSubject.next(next);
    this.persist();
  }

  removeItem(productId: number): void {
    const next = this.itemsSubject.value.filter((item) => item.product.id !== productId);
    this.itemsSubject.next(next);
    this.persist();
  }

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  clearCart(): void {
    this.itemsSubject.next([]);
    this.persist();
  }

  getTotal(): number {
    return this.itemsSubject.value.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  }

  getItemCount(): number {
    return this.itemsSubject.value.reduce((sum, item) => sum + item.quantity, 0);
  }

  private persist(): void {
    this.persistToStorage();
    this.syncToBackend();
  }

  private persistToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.itemsSubject.value));
    } catch {
      // ignore storage errors
    }
  }

  private restoreFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.itemsSubject.next(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }

  private loadFromBackend(): void {
    if (!this.hasBackend || !this.cartEndpoint) {
      return;
    }
    this.http.get<{ items?: CartItem[] } | CartItem[]>(this.cartEndpoint).pipe(
      catchError(() => of(null))
    ).subscribe((res) => {
      const incoming = Array.isArray(res) ? res : res?.items;
      if (incoming && incoming.length) {
        this.itemsSubject.next(incoming);
        this.persistToStorage();
      }
    });
  }

  private syncToBackend(): void {
    if (!this.hasBackend || !this.cartEndpoint) {
      return;
    }
    const payload = { items: this.itemsSubject.value };
    this.http.put(this.cartEndpoint, payload).pipe(
      catchError(() => of(null))
    ).subscribe();
  }
}
