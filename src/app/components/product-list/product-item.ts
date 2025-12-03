import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink, NgIf],
  styleUrls: ['./product-list.css'],
  template: `
    <article class="product-card" *ngIf="product">
      <a [routerLink]="['/products', product.id]" class="card-link">
        <div class="image-wrap">
          <img [src]="product.url" [alt]="product.name" loading="lazy">
        </div>
        <div class="card-body">
          <div class="card-top">
            <h3>{{ product.name }}</h3>
            <span class="price-tag">{{ product.price | currency }}</span>
          </div>
          <p class="muted">{{ product.description }}</p>
        </div>
      </a>

      <div class="qty-row">
        <label class="field-label" for="qty-{{ product.id }}">Qty</label>
        <input
          id="qty-{{ product.id }}"
          type="number"
          class="input small"
          [(ngModel)]="quantity"
          (ngModelChange)="onQuantityChange($event)"
          min="1"
        >
        <button class="btn primary" type="button" (click)="onAddToCart()">
          Add to Cart
        </button>
      </div>
    </article>
  `
})
export class ProductItemComponent {
  @Input({ required: true }) product?: Product;
  @Output() addToCart = new EventEmitter<{ product: Product; quantity: number }>();

  quantity = 1;

  onQuantityChange(value: number | null): void {
    // Keep quantity at 1 or more and coerce blank input to 1
    this.quantity = Math.max(1, Number(value) || 1);
  }

  onAddToCart(): void {
    if (!this.product) {
      return;
    }
    this.addToCart.emit({ product: this.product, quantity: this.quantity });
    this.quantity = 1;
  }
}
