import { Product } from './product';

export interface Order {
  name: string;
  address: string;
  card: string;
  total: number;
  items: { product: Product; quantity: number }[];
}
