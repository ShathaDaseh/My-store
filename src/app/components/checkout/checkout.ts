import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../../services/cart.service';
import { Order } from '../../models/order';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, NgIf],
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

  submitOrder(form: NgForm) {
    if (form.invalid || this.items.length === 0) {
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
