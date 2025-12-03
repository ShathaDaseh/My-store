import { Component, signal } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { map } from 'rxjs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AsyncPipe, NgIf],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('mystore');

  protected readonly cartCount$;

  constructor(private cartService: CartService) {
    this.cartCount$ = this.cartService.items$.pipe(
      map(items => items.reduce((sum, item) => sum + item.quantity, 0))
    );
  }
}
