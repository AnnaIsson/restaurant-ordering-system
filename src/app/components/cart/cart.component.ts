// ============================================================
// CartComponent - View and manage cart items
// ============================================================
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Cart, CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, RouterLink, CurrencyPipe, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule, MatDividerModule,
    MatSnackBarModule, MatDialogModule, MatInputModule, MatFormFieldModule
  ],
  template: `
    <div class="cart-page">
      <div class="cart-header">
        <h1 class="page-title">Your Cart</h1>
        <p class="page-sub" *ngIf="(cart$ | async) as cart">
          {{ cart.totalItems }} item{{ cart.totalItems !== 1 ? 's' : '' }}
        </p>
      </div>

      <ng-container *ngIf="(cart$ | async) as cart">
        <!-- Empty Cart -->
        <div class="empty-cart" *ngIf="cart.items.length === 0">
          <div class="empty-illustration">
            <mat-icon>shopping_cart</mat-icon>
          </div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious dishes to get started!</p>
          <button mat-raised-button color="primary" routerLink="/menu" class="browse-btn">
            <mat-icon>menu_book</mat-icon> Browse Menu
          </button>
        </div>

        <!-- Cart Content -->
        <div class="cart-content" *ngIf="cart.items.length > 0">
          <div class="cart-items">
            <div class="cart-item" *ngFor="let item of cart.items; trackBy: trackById">
              <img [src]="item.menuItem.imageUrl" [alt]="item.menuItem.name" class="item-img"
                onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'">
              <div class="item-info">
                <div class="item-category">{{ item.menuItem.categoryName }}</div>
                <h3 class="item-name">{{ item.menuItem.name }}</h3>
                <p class="item-price-unit">{{ item.menuItem.price | currency:'USD' }} each</p>
                <div class="special-instructions" *ngIf="editingId === item.menuItem.id">
                  <mat-form-field appearance="outline" class="instructions-field">
                    <mat-label>Special instructions</mat-label>
                    <input matInput [(ngModel)]="tempInstructions" placeholder="e.g. no onions, extra spicy...">
                  </mat-form-field>
                  <button mat-stroked-button (click)="saveInstructions(item)">Save</button>
                </div>
                <button mat-button *ngIf="editingId !== item.menuItem.id" (click)="editInstructions(item)" class="instructions-btn">
                  <mat-icon>edit_note</mat-icon>
                  {{ item.specialInstructions ? item.specialInstructions : 'Add instructions' }}
                </button>
              </div>
              <div class="item-controls">
                <div class="qty-control">
                  <button mat-icon-button (click)="decrease(item)" class="qty-btn">
                    <mat-icon>{{ item.quantity === 1 ? 'delete' : 'remove' }}</mat-icon>
                  </button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button mat-icon-button (click)="increase(item)" class="qty-btn">
                    <mat-icon>add</mat-icon>
                  </button>
                </div>
                <div class="item-subtotal">{{ item.subtotal | currency:'USD' }}</div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="order-summary">
            <h2 class="summary-title">Order Summary</h2>

            <div class="summary-row">
              <span>Subtotal ({{ cart.totalItems }} items)</span>
              <span>{{ cart.totalPrice | currency:'USD' }}</span>
            </div>

            <div class="summary-row discount" *ngIf="cart.discount > 0">
              <span><mat-icon>local_offer</mat-icon> Discounts</span>
              <span class="save-text">-{{ cart.discount | currency:'USD' }}</span>
            </div>

            <div class="summary-row">
              <span>Delivery Fee</span>
              <span class="free-text" *ngIf="cart.finalPrice >= 30">FREE</span>
              <span *ngIf="cart.finalPrice < 30">{{ 3.99 | currency:'USD' }}</span>
            </div>

            <div class="free-delivery-notice" *ngIf="cart.finalPrice < 30">
              Add {{ (30 - cart.finalPrice) | currency:'USD' }} more for free delivery!
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="(cart.finalPrice / 30) * 100"></div>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="summary-row total">
              <span>Total</span>
              <span>{{ (cart.finalPrice + (cart.finalPrice < 30 ? 3.99 : 0)) | currency:'USD' }}</span>
            </div>

            <button mat-raised-button color="primary" routerLink="/checkout" class="checkout-btn">
              <mat-icon>lock</mat-icon>
              Proceed to Checkout
            </button>

            <button mat-stroked-button routerLink="/menu" class="continue-btn">
              <mat-icon>arrow_back</mat-icon>
              Continue Shopping
            </button>

            <button mat-button color="warn" (click)="clearCart()" class="clear-btn">
              <mat-icon>delete_sweep</mat-icon>
              Clear Cart
            </button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .cart-page { min-height: 100vh; background: #faf7f4; padding-top: 90px; padding-bottom: 48px; }
    .cart-header { text-align: center; padding: 24px 32px; }
    .page-title { font-family: 'Playfair Display', serif; font-size: 40px; color: #1a0a00; margin: 0; }
    .page-sub { color: #9ca3af; font-size: 16px; margin: 8px 0 0; }
    .empty-cart { display: flex; flex-direction: column; align-items: center; padding: 80px 32px; gap: 16px; }
    .empty-illustration mat-icon { font-size: 100px; height: 100px; width: 100px; color: #e5e7eb; }
    .empty-cart h2 { font-size: 28px; color: #1a0a00; margin: 0; }
    .empty-cart p { color: #9ca3af; font-size: 16px; }
    .browse-btn { border-radius: 30px !important; padding: 8px 32px !important; font-size: 16px !important; }
    .cart-content { display: grid; grid-template-columns: 1fr 380px; gap: 32px; padding: 0 32px; max-width: 1200px; margin: 0 auto; }
    .cart-items { display: flex; flex-direction: column; gap: 16px; }
    .cart-item {
      display: flex; gap: 16px; background: #fff; border-radius: 16px;
      padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); align-items: flex-start;
    }
    .item-img { width: 90px; height: 90px; object-fit: cover; border-radius: 12px; flex-shrink: 0; }
    .item-info { flex: 1; }
    .item-category { font-size: 11px; color: #f59e0b; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
    .item-name { font-family: 'Playfair Display', serif; font-size: 17px; color: #1a0a00; margin: 4px 0; }
    .item-price-unit { font-size: 13px; color: #9ca3af; margin: 2px 0 8px; }
    .instructions-btn { font-size: 12px !important; color: #6b7280 !important; padding: 0 !important; }
    .instructions-field { width: 100%; }
    .item-controls { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
    .qty-control { display: flex; align-items: center; gap: 8px; background: #f9fafb; border-radius: 30px; padding: 4px 8px; }
    .qty-btn { width: 32px !important; height: 32px !important; }
    .qty-value { font-size: 16px; font-weight: 700; min-width: 24px; text-align: center; }
    .item-subtotal { font-size: 18px; font-weight: 800; color: #1a0a00; }
    .order-summary {
      background: #fff; border-radius: 20px; padding: 28px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1); height: fit-content;
      position: sticky; top: 90px; display: flex; flex-direction: column; gap: 16px;
    }
    .summary-title { font-family: 'Playfair Display', serif; font-size: 22px; color: #1a0a00; margin: 0; }
    .summary-row { display: flex; justify-content: space-between; align-items: center; font-size: 15px; color: #4b5563; }
    .summary-row.total { font-size: 20px; font-weight: 800; color: #1a0a00; padding-top: 8px; }
    .summary-row.discount { color: #16a34a; }
    .summary-row.discount mat-icon { font-size: 16px; height: 16px; width: 16px; margin-right: 4px; }
    .save-text { color: #16a34a; font-weight: 700; }
    .free-text { color: #16a34a; font-weight: 700; }
    .free-delivery-notice { background: #fef3c7; padding: 12px 16px; border-radius: 10px; font-size: 13px; color: #92400e; }
    .progress-bar { background: #e5e7eb; height: 6px; border-radius: 3px; margin-top: 8px; }
    .progress-fill { background: #f59e0b; height: 100%; border-radius: 3px; transition: width 0.3s; }
    .checkout-btn { width: 100%; border-radius: 30px !important; padding: 12px !important; font-size: 16px !important; }
    .continue-btn { width: 100%; border-radius: 30px !important; }
    .clear-btn { width: 100%; }
    @media (max-width: 900px) {
      .cart-content { grid-template-columns: 1fr; }
      .order-summary { position: static; }
    }
  `]
})
export class CartComponent implements OnInit {
  cart$!: Observable<Cart>;
  editingId: number | null = null;
  tempInstructions = '';

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cart$ = this.cartService.getCart();
  }

  increase(item: CartItem): void {
    this.cartService.updateQuantity(item.menuItem.id, item.quantity + 1);
  }

  decrease(item: CartItem): void {
    if (item.quantity === 1) {
      this.cartService.removeFromCart(item.menuItem.id);
      this.snackBar.open(`${item.menuItem.name} removed from cart`, '', { duration: 2000 });
    } else {
      this.cartService.updateQuantity(item.menuItem.id, item.quantity - 1);
    }
  }

  editInstructions(item: CartItem): void {
    this.editingId = item.menuItem.id;
    this.tempInstructions = item.specialInstructions || '';
  }

  saveInstructions(item: CartItem): void {
    this.editingId = null;
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.snackBar.open('Cart cleared', '', { duration: 2000 });
  }

  trackById(index: number, item: CartItem): number {
    return item.menuItem.id;
  }
}
