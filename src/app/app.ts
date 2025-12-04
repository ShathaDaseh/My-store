import { Component, Optional, signal } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { map, of } from 'rxjs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
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
  protected readonly isAuthenticated$;
  protected readonly user$;

  constructor(
    private cartService: CartService,
    @Optional() private auth: AuthService | null
  ) {
    this.cartCount$ = this.cartService.items$.pipe(
      map(items => items.reduce((sum, item) => sum + item.quantity, 0))
    );
    this.isAuthenticated$ = this.auth ? this.auth.isAuthenticated$ : of(false);
    this.user$ = this.auth ? this.auth.user$ : of(null);
  }

  login(): void {
    if (this.auth) {
      this.auth.loginWithRedirect();
    }
  }

  logout(): void {
    if (this.auth) {
      this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
    }
  }
}
