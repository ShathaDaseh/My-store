import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NgIf, FormsModule, CurrencyPipe],
  templateUrl: './product-detail.html'
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  quantity = 1;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) { }

  addToCart() {
    this.cartService.addToCart(this.product, this.quantity);
    alert("Product added to cart!");
  }


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe(p => {
      this.product = p;
    });
  }
}
