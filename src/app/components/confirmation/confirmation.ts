import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, CurrencyPipe],
  templateUrl: './confirmation.html',
  styleUrls: ['./confirmation.css']
})
export class ConfirmationComponent implements OnInit {
  order: Order | null = null;

  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.order = this.orderService.getLastOrder();
    if (!this.order) {
      this.router.navigate(['/']);
    }
  }
}
