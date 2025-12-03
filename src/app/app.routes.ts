import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { CheckoutComponent } from './components/checkout/checkout';
import { CartComponent } from './components/cart/cart';
import { ConfirmationComponent } from './components/confirmation/confirmation';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'cart', component: CartComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'products/:id', component: ProductDetailComponent }
];
