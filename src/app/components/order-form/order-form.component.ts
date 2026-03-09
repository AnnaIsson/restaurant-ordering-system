// ============================================================
// OrderFormComponent - Checkout with reactive forms & validation
// ============================================================
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Cart } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/customer.model';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule, CurrencyPipe,
    MatStepperModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatRadioModule, MatSelectModule, MatCardModule,
    MatDividerModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="checkout-page">
      <div class="checkout-header">
        <h1 class="page-title">Checkout</h1>
        <p class="page-sub">Complete your order in just a few steps</p>
      </div>

      <div class="checkout-container">
        <div class="stepper-col">
          <mat-stepper [linear]="true" #stepper orientation="vertical">

            <!-- Step 1: Delivery Info -->
            <mat-step [stepControl]="deliveryForm" label="Delivery Information">
              <form [formGroup]="deliveryForm" class="step-form">
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>First Name</mat-label>
                    <input matInput formControlName="firstName" placeholder="John">
                    <mat-error *ngIf="deliveryForm.get('firstName')?.hasError('required')">First name is required</mat-error>
                    <mat-error *ngIf="deliveryForm.get('firstName')?.hasError('minlength')">At least 2 characters</mat-error>
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Last Name</mat-label>
                    <input matInput formControlName="lastName" placeholder="Doe">
                    <mat-error *ngIf="deliveryForm.get('lastName')?.hasError('required')">Last name is required</mat-error>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email Address</mat-label>
                  <input matInput formControlName="email" placeholder="john@example.com" type="email">
                  <mat-icon matSuffix>email</mat-icon>
                  <mat-error *ngIf="deliveryForm.get('email')?.hasError('required')">Email is required</mat-error>
                  <mat-error *ngIf="deliveryForm.get('email')?.hasError('email')">Enter a valid email</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Phone Number</mat-label>
                  <input matInput formControlName="phone" placeholder="+1 (555) 000-0000" type="tel">
                  <mat-icon matSuffix>phone</mat-icon>
                  <mat-error *ngIf="deliveryForm.get('phone')?.hasError('required')">Phone is required</mat-error>
                  <mat-error *ngIf="deliveryForm.get('phone')?.hasError('pattern')">Enter a valid phone number</mat-error>
                </mat-form-field>

                <div class="delivery-type-group">
                  <label class="radio-group-label">Delivery Type</label>
                  <mat-radio-group formControlName="deliveryType" class="radio-group">
                    <mat-radio-button value="delivery">
                      <mat-icon>delivery_dining</mat-icon> Home Delivery
                    </mat-radio-button>
                    <mat-radio-button value="pickup">
                      <mat-icon>store</mat-icon> Pickup
                    </mat-radio-button>
                    <mat-radio-button value="dine-in">
                      <mat-icon>restaurant</mat-icon> Dine-in
                    </mat-radio-button>
                  </mat-radio-group>
                </div>

                <ng-container *ngIf="deliveryForm.get('deliveryType')?.value === 'delivery'">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Street Address</mat-label>
                    <input matInput formControlName="street" placeholder="123 Main Street">
                    <mat-error *ngIf="deliveryForm.get('street')?.hasError('required')">Street address is required</mat-error>
                  </mat-form-field>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>City</mat-label>
                      <input matInput formControlName="city" placeholder="New York">
                      <mat-error *ngIf="deliveryForm.get('city')?.hasError('required')">City is required</mat-error>
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>ZIP Code</mat-label>
                      <input matInput formControlName="zipCode" placeholder="10001">
                      <mat-error *ngIf="deliveryForm.get('zipCode')?.hasError('required')">ZIP is required</mat-error>
                    </mat-form-field>
                  </div>
                </ng-container>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Special Instructions (Optional)</mat-label>
                  <textarea matInput formControlName="specialInstructions" rows="3"
                    placeholder="Any special requests or instructions for your order..."></textarea>
                </mat-form-field>

                <div class="step-actions">
                  <button mat-raised-button color="primary" matStepperNext
                    [disabled]="deliveryForm.invalid" class="next-btn">
                    Continue to Payment <mat-icon>arrow_forward</mat-icon>
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Step 2: Payment -->
            <mat-step [stepControl]="paymentForm" label="Payment Details">
              <form [formGroup]="paymentForm" class="step-form">
                <div class="payment-methods">
                  <label class="radio-group-label">Payment Method</label>
                  <mat-radio-group formControlName="method" class="payment-radio-group">
                    <div class="payment-option" *ngFor="let method of paymentMethods"
                      [class.selected]="paymentForm.get('method')?.value === method.value">
                      <mat-radio-button [value]="method.value">
                        <mat-icon>{{ method.icon }}</mat-icon>
                        <span>{{ method.label }}</span>
                      </mat-radio-button>
                    </div>
                  </mat-radio-group>
                </div>

                <ng-container *ngIf="paymentForm.get('method')?.value === 'credit-card' || paymentForm.get('method')?.value === 'debit-card'">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Card Holder Name</mat-label>
                    <input matInput formControlName="cardHolderName" placeholder="John Doe">
                    <mat-error *ngIf="paymentForm.get('cardHolderName')?.hasError('required')">Cardholder name required</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Card Number</mat-label>
                    <input matInput formControlName="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19">
                    <mat-icon matSuffix>credit_card</mat-icon>
                    <mat-error *ngIf="paymentForm.get('cardNumber')?.hasError('required')">Card number required</mat-error>
                    <mat-error *ngIf="paymentForm.get('cardNumber')?.hasError('pattern')">Enter a valid 16-digit card number</mat-error>
                  </mat-form-field>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Expiry Date (MM/YY)</mat-label>
                      <input matInput formControlName="expiryDate" placeholder="12/28" maxlength="5">
                      <mat-error *ngIf="paymentForm.get('expiryDate')?.hasError('required')">Expiry required</mat-error>
                      <mat-error *ngIf="paymentForm.get('expiryDate')?.hasError('pattern')">Format MM/YY</mat-error>
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>CVV</mat-label>
                      <input matInput formControlName="cvv" placeholder="123" type="password" maxlength="4">
                      <mat-error *ngIf="paymentForm.get('cvv')?.hasError('required')">CVV required</mat-error>
                      <mat-error *ngIf="paymentForm.get('cvv')?.hasError('pattern')">3-4 digits</mat-error>
                    </mat-form-field>
                  </div>
                </ng-container>

                <ng-container *ngIf="paymentForm.get('method')?.value === 'upi'">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>UPI ID</mat-label>
                    <input matInput formControlName="upiId" placeholder="yourname@upi">
                    <mat-error *ngIf="paymentForm.get('upiId')?.hasError('required')">UPI ID required</mat-error>
                    <mat-error *ngIf="paymentForm.get('upiId')?.hasError('pattern')">Invalid UPI ID format</mat-error>
                  </mat-form-field>
                </ng-container>

                <div class="step-actions">
                  <button mat-stroked-button matStepperPrevious>
                    <mat-icon>arrow_back</mat-icon> Back
                  </button>
                  <button mat-raised-button color="primary" matStepperNext
                    [disabled]="paymentForm.invalid" class="next-btn">
                    Review Order <mat-icon>arrow_forward</mat-icon>
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Step 3: Review & Confirm -->
            <mat-step label="Review & Place Order">
              <div class="review-section" *ngIf="(cart$ | async) as cart">
                <h3 class="review-title">Order Review</h3>

                <div class="review-items">
                  <div class="review-item" *ngFor="let item of cart.items">
                    <img [src]="item.menuItem.imageUrl" [alt]="item.menuItem.name" class="review-img"
                      onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'">
                    <span class="review-name">{{ item.menuItem.name }}</span>
                    <span class="review-qty">×{{ item.quantity }}</span>
                    <span class="review-subtotal">{{ item.subtotal | currency:'USD' }}</span>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="review-totals">
                  <div class="review-row">
                    <span>Subtotal</span><span>{{ cart.totalPrice | currency:'USD' }}</span>
                  </div>
                  <div class="review-row" *ngIf="cart.discount > 0">
                    <span>Discount</span><span class="save">-{{ cart.discount | currency:'USD' }}</span>
                  </div>
                  <div class="review-row">
                    <span>Delivery</span>
                    <span>{{ cart.finalPrice >= 30 ? 'FREE' : '$3.99' }}</span>
                  </div>
                  <mat-divider></mat-divider>
                  <div class="review-row total">
                    <span>Total</span>
                    <span>{{ (cart.finalPrice + (cart.finalPrice < 30 ? 3.99 : 0)) | currency:'USD' }}</span>
                  </div>
                </div>

                <div class="step-actions">
                  <button mat-stroked-button matStepperPrevious>
                    <mat-icon>arrow_back</mat-icon> Back
                  </button>
                  <button mat-raised-button color="primary" (click)="placeOrder()"
                    [disabled]="placing" class="place-btn">
                    <mat-spinner *ngIf="placing" diameter="20"></mat-spinner>
                    <mat-icon *ngIf="!placing">check_circle</mat-icon>
                    {{ placing ? 'Placing Order...' : 'Place Order' }}
                  </button>
                </div>
              </div>
            </mat-step>
          </mat-stepper>
        </div>

        <!-- Cart Summary Sidebar -->
        <div class="summary-sidebar" *ngIf="(cart$ | async) as cart">
          <h3 class="sidebar-title">Your Order</h3>
          <div class="sidebar-item" *ngFor="let item of cart.items">
            <span class="sidebar-qty">{{ item.quantity }}×</span>
            <span class="sidebar-name">{{ item.menuItem.name }}</span>
            <span class="sidebar-price">{{ item.subtotal | currency:'USD' }}</span>
          </div>
          <mat-divider></mat-divider>
          <div class="sidebar-total">
            <span>Total</span>
            <span>{{ (cart.finalPrice + (cart.finalPrice < 30 ? 3.99 : 0)) | currency:'USD' }}</span>
          </div>
          <a mat-button routerLink="/cart" class="edit-cart-link">
            <mat-icon>edit</mat-icon> Edit Cart
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page { min-height: 100vh; background: #faf7f4; padding-top: 90px; padding-bottom: 48px; }
    .checkout-header { text-align: center; padding: 24px 32px; }
    .page-title { font-family: 'Playfair Display', serif; font-size: 40px; color: #1a0a00; margin: 0; }
    .page-sub { color: #9ca3af; margin: 8px 0 0; }
    .checkout-container { display: grid; grid-template-columns: 1fr 320px; gap: 32px; padding: 0 32px; max-width: 1100px; margin: 0 auto; }
    .step-form { padding: 24px 0; display: flex; flex-direction: column; gap: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .full-width { width: 100%; }
    .delivery-type-group { padding: 8px 0; }
    .radio-group-label { display: block; font-size: 14px; color: #6b7280; margin-bottom: 8px; font-weight: 500; }
    .radio-group { display: flex; gap: 24px; flex-wrap: wrap; }
    .payment-radio-group { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .payment-option {
      border: 2px solid #e5e7eb; border-radius: 12px; padding: 12px 16px;
      cursor: pointer; transition: all 0.2s;
    }
    .payment-option.selected { border-color: #1a0a00; background: #faf7f4; }
    .payment-option mat-icon { margin-right: 8px; vertical-align: middle; }
    .step-actions { display: flex; gap: 12px; justify-content: flex-end; padding-top: 8px; }
    .next-btn { border-radius: 30px !important; padding: 8px 24px !important; }
    .review-section { padding: 16px 0; }
    .review-title { font-family: 'Playfair Display', serif; font-size: 22px; margin-bottom: 16px; color: #1a0a00; }
    .review-items { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
    .review-item { display: flex; align-items: center; gap: 12px; }
    .review-img { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; }
    .review-name { flex: 1; font-size: 14px; }
    .review-qty { color: #9ca3af; font-size: 14px; }
    .review-subtotal { font-weight: 700; color: #1a0a00; }
    .review-totals { display: flex; flex-direction: column; gap: 12px; padding: 16px 0; }
    .review-row { display: flex; justify-content: space-between; font-size: 15px; color: #4b5563; }
    .review-row.total { font-size: 20px; font-weight: 800; color: #1a0a00; padding-top: 8px; }
    .save { color: #16a34a; font-weight: 700; }
    .place-btn { border-radius: 30px !important; display: flex; align-items: center; gap: 8px; }
    .summary-sidebar {
      background: #fff; border-radius: 20px; padding: 24px; height: fit-content;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1); position: sticky; top: 90px;
      display: flex; flex-direction: column; gap: 12px;
    }
    .sidebar-title { font-family: 'Playfair Display', serif; font-size: 20px; color: #1a0a00; margin: 0; }
    .sidebar-item { display: flex; gap: 8px; align-items: center; font-size: 14px; }
    .sidebar-qty { color: #f59e0b; font-weight: 700; min-width: 24px; }
    .sidebar-name { flex: 1; }
    .sidebar-price { font-weight: 600; color: #1a0a00; }
    .sidebar-total { display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #1a0a00; padding-top: 8px; }
    .edit-cart-link { width: 100%; justify-content: center; color: #6b7280; }
    @media (max-width: 900px) {
      .checkout-container { grid-template-columns: 1fr; }
      .summary-sidebar { order: -1; position: static; }
      .form-row { grid-template-columns: 1fr; }
      .payment-radio-group { grid-template-columns: 1fr; }
    }
  `]
})
export class OrderFormComponent implements OnInit {
  deliveryForm!: FormGroup;
  paymentForm!: FormGroup;
  cart$!: Observable<Cart>;
  placing = false;

  paymentMethods = [
    { value: 'credit-card', label: 'Credit Card', icon: 'credit_card' },
    { value: 'debit-card', label: 'Debit Card', icon: 'payment' },
    { value: 'upi', label: 'UPI', icon: 'account_balance' },
    { value: 'cash', label: 'Cash on Delivery', icon: 'money' }
  ];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cart$ = this.cartService.getCart();
    this.buildForms();
  }

  private buildForms(): void {
    this.deliveryForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]{8,15}$/)]],
      deliveryType: ['delivery', Validators.required],
      street: [''],
      city: [''],
      zipCode: [''],
      specialInstructions: ['']
    });

    this.paymentForm = this.fb.group({
      method: ['credit-card', Validators.required],
      cardHolderName: [''],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      upiId: ['']
    });

    // Dynamic validation
    this.deliveryForm.get('deliveryType')?.valueChanges.subscribe(type => {
      if (type === 'delivery') {
        this.deliveryForm.get('street')?.setValidators(Validators.required);
        this.deliveryForm.get('city')?.setValidators(Validators.required);
        this.deliveryForm.get('zipCode')?.setValidators(Validators.required);
      } else {
        ['street', 'city', 'zipCode'].forEach(f => {
          this.deliveryForm.get(f)?.clearValidators();
          this.deliveryForm.get(f)?.updateValueAndValidity();
        });
      }
      this.deliveryForm.get('street')?.updateValueAndValidity();
      this.deliveryForm.get('city')?.updateValueAndValidity();
      this.deliveryForm.get('zipCode')?.updateValueAndValidity();
    });

    this.paymentForm.get('method')?.valueChanges.subscribe(method => {
      const card = ['credit-card', 'debit-card'].includes(method);
      const upi = method === 'upi';
      if (card) {
        this.paymentForm.get('cardHolderName')?.setValidators(Validators.required);
        this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^[\d\s]{16,19}$/)]);
        this.paymentForm.get('expiryDate')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
        this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
        this.paymentForm.get('upiId')?.clearValidators();
      } else if (upi) {
        this.paymentForm.get('upiId')?.setValidators([Validators.required, Validators.pattern(/^[\w.\-]+@[\w]+$/)]);
        ['cardHolderName', 'cardNumber', 'expiryDate', 'cvv'].forEach(f => this.paymentForm.get(f)?.clearValidators());
      } else {
        ['cardHolderName', 'cardNumber', 'expiryDate', 'cvv', 'upiId'].forEach(f => this.paymentForm.get(f)?.clearValidators());
      }
      ['cardHolderName', 'cardNumber', 'expiryDate', 'cvv', 'upiId'].forEach(f => this.paymentForm.get(f)?.updateValueAndValidity());
    });
  }

  placeOrder(): void {
    this.placing = true;
    this.cartService.getCart().pipe(take(1)).subscribe(cart => {
      const dv = this.deliveryForm.value;
      const pv = this.paymentForm.value;

      const order: Order = {
        customer: {
          firstName: dv.firstName,
          lastName: dv.lastName,
          email: dv.email,
          phone: dv.phone,
          address: dv.deliveryType === 'delivery' ? {
            street: dv.street, city: dv.city, state: '', zipCode: dv.zipCode, country: 'US'
          } : undefined
        },
        items: cart.items.map(i => ({
          menuItemId: i.menuItem.id,
          menuItemName: i.menuItem.name,
          quantity: i.quantity,
          price: i.menuItem.price,
          subtotal: i.subtotal,
          specialInstructions: i.specialInstructions
        })),
        totalAmount: cart.totalPrice,
        discount: cart.discount,
        finalAmount: cart.finalPrice + (cart.finalPrice < 30 ? 3.99 : 0),
        paymentInfo: { method: pv.method, cardNumber: pv.cardNumber, cardHolderName: pv.cardHolderName, expiryDate: pv.expiryDate, cvv: pv.cvv, upiId: pv.upiId },
        status: 'pending',
        orderDate: new Date(),
        specialInstructions: dv.specialInstructions,
        deliveryType: dv.deliveryType
      };

      this.orderService.placeOrder(order).subscribe(confirmed => {
        this.placing = false;
        this.cartService.clearCart();
        this.router.navigate(['/confirmation'], { state: { order: confirmed } });
      });
    });
  }
}
