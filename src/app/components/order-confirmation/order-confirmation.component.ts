// ============================================================
// OrderConfirmationComponent - Success page after order
// ============================================================
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Order } from '../../models/customer.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, CurrencyPipe, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule],
  template: `
    <div class="confirmation-page">
      <div class="confirmation-card" *ngIf="order; else noOrder">
        <!-- Success Animation -->
        <div class="success-icon-wrap">
          <div class="success-circle">
            <mat-icon>check</mat-icon>
          </div>
        </div>

        <h1 class="confirm-title">Order Confirmed!</h1>
        <p class="confirm-subtitle">Thank you, {{ order.customer.firstName }}! Your order has been placed successfully.</p>

        <div class="order-id-card">
          <span class="label">Order ID</span>
          <span class="order-id">{{ order.id }}</span>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <mat-icon>schedule</mat-icon>
            <div>
              <small>Estimated Delivery</small>
              <strong>{{ order.estimatedDelivery | date:'h:mm a' }}</strong>
            </div>
          </div>
          <div class="info-item">
            <mat-icon>receipt</mat-icon>
            <div>
              <small>Total Paid</small>
              <strong>{{ order.finalAmount | currency:'USD' }}</strong>
            </div>
          </div>
          <div class="info-item">
            <mat-icon>delivery_dining</mat-icon>
            <div>
              <small>Delivery Type</small>
              <strong class="capitalize">{{ order.deliveryType }}</strong>
            </div>
          </div>
          <div class="info-item">
            <mat-icon>payment</mat-icon>
            <div>
              <small>Payment</small>
              <strong class="capitalize">{{ order.paymentInfo.method.replace('-', ' ') }}</strong>
            </div>
          </div>
        </div>

        <mat-divider></mat-divider>

        <div class="order-items-list">
          <h3 class="items-title">Your Items</h3>
          <div class="order-item-row" *ngFor="let item of order.items">
            <span class="oi-qty">{{ item.quantity }}×</span>
            <span class="oi-name">{{ item.menuItemName }}</span>
            <span class="oi-price">{{ item.subtotal | currency:'USD' }}</span>
          </div>
        </div>

        <div class="status-track">
          <div class="track-step active">
            <div class="track-dot"></div>
            <span>Order Confirmed</span>
          </div>
          <div class="track-line"></div>
          <div class="track-step">
            <div class="track-dot"></div>
            <span>Preparing</span>
          </div>
          <div class="track-line"></div>
          <div class="track-step">
            <div class="track-dot"></div>
            <span>On the Way</span>
          </div>
          <div class="track-line"></div>
          <div class="track-step">
            <div class="track-dot"></div>
            <span>Delivered</span>
          </div>
        </div>

        <div class="confirm-actions">
          <button mat-raised-button color="primary" routerLink="/menu" class="action-btn">
            <mat-icon>menu_book</mat-icon> Order Again
          </button>
          <button mat-stroked-button routerLink="/" class="action-btn">
            <mat-icon>home</mat-icon> Back to Home
          </button>
        </div>
      </div>

      <ng-template #noOrder>
        <div class="no-order">
          <mat-icon>receipt_long</mat-icon>
          <h2>No order found</h2>
          <button mat-raised-button color="primary" routerLink="/menu">Browse Menu</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .confirmation-page {
      min-height: 100vh; background: linear-gradient(135deg, #1a0a00 0%, #3d1a00 100%);
      padding-top: 90px; display: flex; align-items: flex-start; justify-content: center; padding: 100px 16px 48px;
    }
    .confirmation-card {
      background: #fff; border-radius: 24px; padding: 48px;
      max-width: 600px; width: 100%; display: flex; flex-direction: column; gap: 24px;
      box-shadow: 0 40px 80px rgba(0,0,0,0.3);
    }
    .success-icon-wrap { display: flex; justify-content: center; }
    .success-circle {
      width: 96px; height: 96px; background: #16a34a; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 0 12px rgba(22,163,74,0.15);
      animation: pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
    }
    @keyframes pop {
      0% { transform: scale(0); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    .success-circle mat-icon { font-size: 48px; height: 48px; width: 48px; color: #fff; }
    .confirm-title { font-family: 'Playfair Display', serif; font-size: 36px; color: #1a0a00; text-align: center; margin: 0; }
    .confirm-subtitle { text-align: center; color: #6b7280; font-size: 16px; margin: 0; }
    .order-id-card { background: #1a0a00; border-radius: 12px; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
    .label { color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
    .order-id { color: #f59e0b; font-size: 18px; font-weight: 800; font-family: monospace; letter-spacing: 2px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .info-item { display: flex; align-items: center; gap: 12px; background: #faf7f4; padding: 12px 16px; border-radius: 12px; }
    .info-item mat-icon { color: #f59e0b; }
    .info-item div { display: flex; flex-direction: column; }
    .info-item small { font-size: 11px; color: #9ca3af; text-transform: uppercase; }
    .info-item strong { font-size: 15px; color: #1a0a00; }
    .capitalize { text-transform: capitalize; }
    .items-title { font-size: 16px; font-weight: 700; color: #1a0a00; margin-bottom: 12px; }
    .order-item-row { display: flex; gap: 12px; align-items: center; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #f3f4f6; }
    .order-item-row:last-child { border: none; }
    .oi-qty { color: #f59e0b; font-weight: 700; min-width: 28px; }
    .oi-name { flex: 1; }
    .oi-price { font-weight: 700; color: #1a0a00; }
    .status-track { display: flex; align-items: center; padding: 16px 0; }
    .track-step { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 60px; }
    .track-step span { font-size: 11px; color: #9ca3af; text-align: center; }
    .track-step.active .track-dot { background: #16a34a; box-shadow: 0 0 0 4px rgba(22,163,74,0.2); }
    .track-step.active span { color: #16a34a; font-weight: 700; }
    .track-dot { width: 16px; height: 16px; border-radius: 50%; background: #e5e7eb; }
    .track-line { flex: 1; height: 2px; background: #e5e7eb; }
    .confirm-actions { display: flex; gap: 12px; }
    .action-btn { flex: 1; border-radius: 30px !important; }
    .no-order { display: flex; flex-direction: column; align-items: center; gap: 16px; color: #fff; padding: 80px; }
    .no-order mat-icon { font-size: 80px; height: 80px; width: 80px; opacity: 0.5; }
    @media (max-width: 600px) {
      .confirmation-card { padding: 24px; }
      .info-grid { grid-template-columns: 1fr; }
      .confirm-actions { flex-direction: column; }
    }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    this.order = nav?.extras?.state?.['order'] || history.state?.order || null;
  }
}
