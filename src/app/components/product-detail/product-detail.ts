import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CurrencyPipe, RouterLink],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  qtyOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  quantity = 1;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) { }

  addToCart(): void {
    if (!this.product) {
      return;
    }
    this.cartService.addToCart(this.product, Math.max(1, this.quantity));
    this.quantity = 1;
    alert('Product added to cart');
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe({
      next: (p) => {
        this.product = p;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigateByUrl('/');
      }
    });
  }
}
