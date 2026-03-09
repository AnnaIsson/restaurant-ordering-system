// ============================================================
// MenuDetailComponent - Shows full details of a menu item
// ============================================================
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenuItem } from '../../models/menu-item.model';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, CurrencyPipe,
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatSnackBarModule, MatDividerModule, MatTooltipModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="detail-page" *ngIf="!loading; else loadingTpl">
      <div class="back-bar">
        <button mat-button routerLink="/menu">
          <mat-icon>arrow_back</mat-icon> Back to Menu
        </button>
      </div>

      <div class="detail-container" *ngIf="item; else notFound">
        <div class="detail-img-col">
          <div class="img-wrapper">
            <img [src]="item.imageUrl" [alt]="item.name" class="detail-img"
              onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'">
            <div class="img-badges">
              <span *ngIf="item.isRecommended" class="badge-lg recommended">
                <mat-icon>star</mat-icon> Chef's Recommendation
              </span>
              <span *ngIf="item.isDiscounted" class="badge-lg discount">
                <mat-icon>local_offer</mat-icon> {{ item.discountPercent }}% OFF Today
              </span>
            </div>
          </div>
        </div>

        <div class="detail-info-col">
          <div class="item-category">{{ item.categoryName }}</div>
          <h1 class="item-title">{{ item.name }}</h1>

          <!-- Rating -->
          <div class="rating-row">
            <div class="stars">
              <mat-icon *ngFor="let s of getStars(item.rating)" class="star-icon">
                {{ s === 'full' ? 'star' : s === 'half' ? 'star_half' : 'star_border' }}
              </mat-icon>
            </div>
            <span class="rating-num">{{ item.rating }}</span>
            <span class="review-num">({{ item.reviewCount }} reviews)</span>
          </div>

          <p class="item-description">{{ item.description }}</p>

          <!-- Info Grid -->
          <div class="info-grid">
            <div class="info-chip">
              <mat-icon>schedule</mat-icon>
              <span>{{ item.preparationTime }} min</span>
              <small>Prep Time</small>
            </div>
            <div class="info-chip">
              <mat-icon>local_fire_department</mat-icon>
              <span>{{ item.calories }}</span>
              <small>Calories</small>
            </div>
            <div class="info-chip" *ngIf="item.spiceLevel">
              <mat-icon>whatshot</mat-icon>
              <span class="spice-badge" [ngClass]="'spice-' + item.spiceLevel">{{ item.spiceLevel }}</span>
              <small>Spice Level</small>
            </div>
          </div>

          <!-- Dietary Badges -->
          <div class="dietary-row">
            <span *ngIf="item.isVegan" class="diet-badge vegan">
              <mat-icon>spa</mat-icon> Vegan
            </span>
            <span *ngIf="item.isVegetarian" class="diet-badge veg">
              <mat-icon>eco</mat-icon> Vegetarian
            </span>
            <span *ngIf="item.isGlutenFree" class="diet-badge gf">
              <mat-icon>grain</mat-icon> Gluten-Free
            </span>
          </div>

          <!-- Tags -->
          <div class="tags-row">
            <span *ngFor="let tag of item.tags" class="tag-chip"># {{ tag }}</span>
          </div>

          <mat-divider></mat-divider>

          <!-- Ingredients -->
          <div class="ingredients-section">
            <h3 class="section-title"><mat-icon>restaurant_menu</mat-icon> Ingredients</h3>
            <div class="ingredients-list">
              <span *ngFor="let ing of item.ingredients" class="ingredient-chip">{{ ing }}</span>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Quantity and Add to Cart -->
          <div class="cart-section">
            <div class="price-display">
              <span class="final-price">{{ getDiscountedPrice() | currency:'USD' }}</span>
              <span *ngIf="item.isDiscounted" class="original-price">
                {{ item.price | currency:'USD' }}
              </span>
              <span *ngIf="item.isDiscounted" class="savings-text">
                You save {{ item.price - getDiscountedPrice() | currency:'USD' }}
              </span>
            </div>

            <div class="quantity-selector">
              <button mat-icon-button (click)="decreaseQty()" [disabled]="quantity <= 1">
                <mat-icon>remove</mat-icon>
              </button>
              <span class="qty-display">{{ quantity }}</span>
              <button mat-icon-button (click)="increaseQty()">
                <mat-icon>add</mat-icon>
              </button>
            </div>

            <div class="action-btns">
              <button
                mat-raised-button
                color="primary"
                class="add-cart-btn"
                (click)="addToCart()"
                [disabled]="!item.isAvailable">
                <mat-icon>add_shopping_cart</mat-icon>
                {{ item.isAvailable ? 'Add to Cart — ' + (getDiscountedPrice() * quantity | currency:'USD') : 'Unavailable' }}
              </button>
              <button mat-stroked-button color="primary" routerLink="/cart">
                <mat-icon>shopping_cart</mat-icon> View Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <ng-template #notFound>
        <div class="not-found">
          <mat-icon>no_meals</mat-icon>
          <h2>Item not found</h2>
          <button mat-raised-button color="primary" routerLink="/menu">Back to Menu</button>
        </div>
      </ng-template>
    </div>

    <ng-template #loadingTpl>
      <div class="loading-state">
        <mat-spinner diameter="60"></mat-spinner>
      </div>
    </ng-template>
  `,
  styles: [`
    .detail-page { min-height: 100vh; background: #faf7f4; padding-top: 70px; }
    .back-bar { padding: 16px 32px; }
    .detail-container { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; padding: 0 32px 48px; max-width: 1200px; margin: 0 auto; }
    .img-wrapper { position: relative; border-radius: 24px; overflow: hidden; height: 500px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
    .detail-img { width: 100%; height: 100%; object-fit: cover; }
    .img-badges { position: absolute; bottom: 24px; left: 24px; display: flex; flex-direction: column; gap: 8px; }
    .badge-lg {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 24px; font-size: 13px; font-weight: 700;
    }
    .badge-lg mat-icon { font-size: 16px; height: 16px; width: 16px; }
    .recommended { background: rgba(26,10,0,0.9); color: #f59e0b; }
    .discount { background: rgba(220,38,38,0.9); color: #fff; }
    .detail-info-col { padding: 8px 0; display: flex; flex-direction: column; gap: 20px; }
    .item-category { font-size: 12px; color: #f59e0b; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }
    .item-title { font-family: 'Playfair Display', serif; font-size: 38px; color: #1a0a00; margin: 0; line-height: 1.2; }
    .rating-row { display: flex; align-items: center; gap: 8px; }
    .stars { display: flex; }
    .star-icon { color: #f59e0b; font-size: 20px; height: 20px; width: 20px; }
    .rating-num { font-size: 18px; font-weight: 800; color: #1a0a00; }
    .review-num { font-size: 14px; color: #9ca3af; }
    .item-description { font-size: 16px; color: #4b5563; line-height: 1.7; margin: 0; }
    .info-grid { display: flex; gap: 16px; }
    .info-chip {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      padding: 12px 20px; background: #fff; border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08); min-width: 90px;
    }
    .info-chip mat-icon { color: #f59e0b; }
    .info-chip span { font-weight: 700; font-size: 15px; }
    .info-chip small { font-size: 11px; color: #9ca3af; text-transform: uppercase; }
    .spice-badge { padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
    .spice-mild { background: #d1fae5; color: #065f46; }
    .spice-medium { background: #fef3c7; color: #92400e; }
    .spice-hot { background: #fee2e2; color: #991b1b; }
    .dietary-row { display: flex; gap: 8px; flex-wrap: wrap; }
    .diet-badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;
    }
    .diet-badge mat-icon { font-size: 16px; height: 16px; width: 16px; }
    .vegan { background: #dcfce7; color: #166534; }
    .veg { background: #bbf7d0; color: #14532d; }
    .gf { background: #fef3c7; color: #92400e; }
    .tags-row { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag-chip { background: #f3f4f6; color: #6b7280; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .ingredients-section h3 { margin-bottom: 12px; }
    .section-title { display: flex; align-items: center; gap: 8px; color: #1a0a00; font-family: 'Playfair Display', serif; }
    .ingredients-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .ingredient-chip { background: #1a0a00; color: #f59e0b; padding: 4px 14px; border-radius: 20px; font-size: 13px; }
    .cart-section { display: flex; flex-direction: column; gap: 16px; }
    .price-display { display: flex; align-items: baseline; gap: 12px; }
    .final-price { font-size: 36px; font-weight: 900; color: #1a0a00; }
    .original-price { font-size: 20px; color: #9ca3af; text-decoration: line-through; }
    .savings-text { font-size: 13px; color: #16a34a; font-weight: 600; }
    .quantity-selector { display: flex; align-items: center; gap: 16px; }
    .qty-display { font-size: 24px; font-weight: 800; color: #1a0a00; min-width: 40px; text-align: center; }
    .action-btns { display: flex; gap: 12px; flex-wrap: wrap; }
    .add-cart-btn { flex: 1; min-width: 200px; border-radius: 30px !important; font-size: 15px !important; padding: 8px 24px !important; }
    .not-found, .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 16px; }
    .not-found mat-icon { font-size: 80px; height: 80px; width: 80px; color: #e5e7eb; }
    @media (max-width: 768px) {
      .detail-container { grid-template-columns: 1fr; padding: 0 16px 32px; }
      .img-wrapper { height: 300px; }
    }
  `]
})
export class MenuDetailComponent implements OnInit {
  item: MenuItem | null = null;
  quantity = 1;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.menuService.getMenuItemById(id).subscribe(item => {
      this.item = item || null;
      this.loading = false;
    });
  }

  addToCart(): void {
    if (!this.item) return;
    this.cartService.addToCart(this.item, this.quantity);
    this.snackBar.open(`${this.item.name} (×${this.quantity}) added to cart!`, 'View Cart', {
      duration: 3000, panelClass: ['success-snack']
    });
  }

  getDiscountedPrice(): number {
    if (!this.item) return 0;
    return this.menuService.getDiscountedPrice(this.item);
  }

  increaseQty(): void { this.quantity++; }
  decreaseQty(): void { if (this.quantity > 1) this.quantity--; }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++) stars.push('full');
    if (half) stars.push('half');
    while (stars.length < 5) stars.push('empty');
    return stars;
  }
}
