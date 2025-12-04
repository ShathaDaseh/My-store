import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { ProductItemComponent } from './product-item';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgFor, NgIf, ProductItemComponent],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  handleAddToCart(event: { product: Product; quantity: number }) {
    this.cartService.addToCart(event.product, event.quantity);
    alert('Product added to cart');
  }
}
