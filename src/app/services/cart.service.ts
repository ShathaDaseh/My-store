import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';

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
  }

  updateQuantity(productId: number, quantity: number): void {
    const normalized = Math.max(1, Number(quantity) || 1);
    const next = this.itemsSubject.value.map((item) =>
      item.product.id === productId ? { ...item, quantity: normalized } : item
    );
    this.itemsSubject.next(next);
  }

  removeItem(productId: number): void {
    const next = this.itemsSubject.value.filter((item) => item.product.id !== productId);
    this.itemsSubject.next(next);
  }

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  clearCart(): void {
    this.itemsSubject.next([]);
  }

  getTotal(): number {
    return this.itemsSubject.value.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  }

  getItemCount(): number {
    return this.itemsSubject.value.reduce((sum, item) => sum + item.quantity, 0);
  }
}
