import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly dataUrl = '/data.json';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<{ products: Product[] }>(this.dataUrl).pipe(
      map((res) => res.products ?? [])
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.getProducts().pipe(
      map((products) => {
        const found = products.find((p) => p.id === id);
        if (!found) {
          throw new Error(`Product with id ${id} not found`);
        }
        return found;
      })
    );
  }
}
