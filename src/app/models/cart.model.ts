// ============================================================
// Cart Model - Shopping cart data structures
// ============================================================
import { MenuItem } from './menu-item.model';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  discount: number;
  finalPrice: number;
}
