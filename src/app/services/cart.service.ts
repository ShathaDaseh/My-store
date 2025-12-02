import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    items: { product: Product, quantity: number }[] = [];

    addToCart(product: Product, quantity: number) {
        this.items.push({ product, quantity });
    }

    getItems() {
        return this.items;
    }

    clearCart() {
        this.items = [];
        return this.items;
    }

    getTotal() {
        return this.items.reduce((sum, item) => {
            return sum + item.product.price * item.quantity;
        }, 0);
    }
}
