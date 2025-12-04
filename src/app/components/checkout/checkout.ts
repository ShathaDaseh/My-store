import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgIf, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../../services/cart.service';
import { Order } from '../../models/order';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, NgIf, NgFor],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  name = '';
  address = '';
  card = '';

  items: CartItem[] = [];
  total = 0;
  submissionError = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    const normalized = Math.max(1, Number(quantity) || 1);
    this.cartService.updateQuantity(productId, normalized);
    this.total = this.cartService.getTotal();
  }

  submitOrder(form: NgForm) {
    this.submissionError = '';
    const digitsOnly = (this.card || '').replace(/\D/g, '').slice(0, 16);
    this.card = digitsOnly;

    if (this.items.length === 0) {
      this.submissionError = 'cart';
      form.control.markAllAsTouched();
      return;
    }

    if (!digitsOnly || digitsOnly.length !== 16) {
      this.submissionError = 'card';
      form.control.markAllAsTouched();
      return;
    }

    const order: Order = {
      name: this.name.trim(),
      address: this.address.trim(),
      card: this.card.trim(),
      total: this.total,
      items: this.items
    };

    this.orderService.createOrder(order).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.router.navigate(['/confirmation']);
      },
      error: (err) => {
        console.error(err);
        this.submissionError = 'Error submitting order. Please try again.';
      }
    });
  }
}
