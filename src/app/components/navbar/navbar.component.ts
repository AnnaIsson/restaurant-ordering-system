// ============================================================
// NavbarComponent - App-wide navigation
// ============================================================
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, RouterLink, RouterLinkActive,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatBadgeModule, MatMenuModule
  ],
  template: `
    <mat-toolbar class="navbar">
      <div class="navbar-brand" routerLink="/menu">
        <mat-icon class="brand-icon">restaurant</mat-icon>
        <span class="brand-name">Bella Vista</span>
        <span class="brand-tagline">Kitchen & Bar</span>
      </div>

      <nav class="nav-links">
        <a mat-button routerLink="/menu" routerLinkActive="active-link">
          <mat-icon>menu_book</mat-icon> Menu
        </a>
        <a mat-button routerLink="/cart" routerLinkActive="active-link">
          <mat-icon [matBadge]="cartCount$ | async" matBadgeColor="warn"
            [matBadgeHidden]="(cartCount$ | async) === 0">
            shopping_cart
          </mat-icon>
          Cart
        </a>
        <a mat-raised-button color="accent" routerLink="/checkout" class="order-btn">
          <mat-icon>receipt_long</mat-icon> Order Now
        </a>
      </nav>

      <!-- Mobile Menu -->
      <div class="mobile-menu">
        <a mat-icon-button routerLink="/cart">
          <mat-icon [matBadge]="cartCount$ | async" matBadgeColor="warn"
            [matBadgeHidden]="(cartCount$ | async) === 0">shopping_cart</mat-icon>
        </a>
        <button mat-icon-button [matMenuTriggerFor]="mobileNav">
          <mat-icon>menu</mat-icon>
        </button>
      </div>

      <mat-menu #mobileNav="matMenu">
        <a mat-menu-item routerLink="/menu"><mat-icon>menu_book</mat-icon> Menu</a>
        <a mat-menu-item routerLink="/cart"><mat-icon>shopping_cart</mat-icon> Cart</a>
        <a mat-menu-item routerLink="/checkout"><mat-icon>receipt_long</mat-icon> Checkout</a>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: linear-gradient(135deg, #1a0a00 0%, #3d1a00 100%);
      height: 70px;
      padding: 0 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    }
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      text-decoration: none;
    }
    .brand-icon { color: #f59e0b; font-size: 32px; }
    .brand-name {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.5px;
    }
    .brand-tagline {
      font-size: 11px;
      color: #f59e0b;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 2px;
      display: block;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nav-links a { color: #e5e7eb; font-size: 14px; }
    .active-link { color: #f59e0b !important; }
    .order-btn { background: #f59e0b !important; color: #1a0a00 !important; font-weight: 700; }
    .mobile-menu { display: none; align-items: center; }
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .mobile-menu { display: flex; }
    }
  `]
})
export class NavbarComponent implements OnInit {
  cartCount$!: Observable<number>;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartCount$ = this.cartService.getItemCount();
  }
}
