import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly dataUrl = `${environment.apiUrl}/products`;
  private products$?: Observable<Product[]>;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    if (!this.products$) {
      this.products$ = this.http.get<Product[]>(this.dataUrl).pipe(
        map((res) => res ?? []),
        catchError(() =>
          this.http.get<{ products: Product[] }>('/data.json').pipe(
            map((res) => res.products ?? []),
          )
        ),
        shareReplay(1),
      );
    }
    return this.products$;
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
