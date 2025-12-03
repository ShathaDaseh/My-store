import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartItem, CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, CurrencyPipe, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
    this.total = this.cartService.getTotal();
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
    this.total = this.cartService.getTotal();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.total = 0;
  }
}
