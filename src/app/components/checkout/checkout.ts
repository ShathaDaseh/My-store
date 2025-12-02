import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './checkout.html'
})
export class CheckoutComponent implements OnInit {

  name: string = '';
  address: string = '';
  card: string = '';

  items: { product: Product; quantity: number }[] = [];
  total = 0;

  constructor(
    private cartService: CartService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();
  }

  submitOrder() {
    const order = {
      customerName: this.name,
      customerAddress: this.address,
      total: this.total,
      items: this.items
    };

    this.http.post('http://localhost:3000/orders', order).subscribe(() => {
      alert("Order complete!");
    });
  }
}
