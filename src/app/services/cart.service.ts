// ============================================================
// CartService - Manages shopping cart state
// ============================================================
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, Cart } from '../models/cart.model';
import { MenuItem } from '../models/menu-item.model';
import { MenuService } from './menu.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private menuService: MenuService) {}

  getCart(): Observable<Cart> {
    return this.cart$.pipe(
      map(items => this.buildCart(items))
    );
  }

  private buildCart(items: CartItem[]): Cart {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
    const discount = items.reduce((sum, item) => {
      if (item.menuItem.isDiscounted && item.menuItem.discountPercent) {
        const originalPrice = item.menuItem.price * item.quantity;
        const discountedPrice = this.menuService.getDiscountedPrice(item.menuItem) * item.quantity;
        return sum + (originalPrice - discountedPrice);
      }
      return sum;
    }, 0);
    const finalPrice = totalPrice - discount;

    return { items, totalItems, totalPrice, discount, finalPrice };
  }

  addToCart(menuItem: MenuItem, quantity: number = 1, specialInstructions?: string): void {
    const currentItems = this.cartSubject.getValue();
    const existingIndex = currentItems.findIndex(i => i.menuItem.id === menuItem.id);
    const price = this.menuService.getDiscountedPrice(menuItem);

    if (existingIndex >= 0) {
      const updated = [...currentItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity,
        subtotal: (updated[existingIndex].quantity + quantity) * price
      };
      this.cartSubject.next(updated);
    } else {
      const newItem: CartItem = {
        menuItem,
        quantity,
        specialInstructions,
        subtotal: quantity * price
      };
      this.cartSubject.next([...currentItems, newItem]);
    }
  }

  removeFromCart(menuItemId: number): void {
    const updated = this.cartSubject.getValue().filter(i => i.menuItem.id !== menuItemId);
    this.cartSubject.next(updated);
  }

  updateQuantity(menuItemId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(menuItemId);
      return;
    }
    const updated = this.cartSubject.getValue().map(item => {
      if (item.menuItem.id === menuItemId) {
        const price = this.menuService.getDiscountedPrice(item.menuItem);
        return { ...item, quantity, subtotal: quantity * price };
      }
      return item;
    });
    this.cartSubject.next(updated);
  }

  clearCart(): void {
    this.cartSubject.next([]);
  }

  getItemCount(): Observable<number> {
    return this.cart$.pipe(map(items => items.reduce((sum, i) => sum + i.quantity, 0)));
  }

  isInCart(menuItemId: number): Observable<boolean> {
    return this.cart$.pipe(map(items => items.some(i => i.menuItem.id === menuItemId)));
  }
}
