// ============================================================
// MenuListComponent - Displays all menu items with filtering
// ============================================================
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MenuItem, Category } from '../../models/menu-item.model';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { FilterMenuPipe } from '../../pipes/filter-menu.pipe';
import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule, ReactiveFormsModule, CurrencyPipe,
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatInputModule, MatFormFieldModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatSliderModule, MatCheckboxModule, MatTooltipModule,
    FilterMenuPipe, HighlightDirective
  ],
  template: `
    <div class="menu-page">
      <!-- Hero Banner -->
      <div class="menu-hero">
        <div class="hero-content">
          <h1 class="hero-title">Our Menu</h1>
          <p class="hero-subtitle">Crafted with passion, served with love</p>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div class="filter-bar">
        <div class="search-wrap">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search dishes...</mat-label>
            <input matInput [formControl]="searchControl" placeholder="e.g. pasta, burger, vegan...">
            <mat-icon matPrefix>search</mat-icon>
            <button *ngIf="searchControl.value" matSuffix mat-icon-button (click)="searchControl.reset()">
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>
        </div>

        <div class="filter-toggles">
          <mat-checkbox [(ngModel)]="filterVeg" (change)="applyFilters()" color="primary">
            <mat-icon style="color:#16a34a;font-size:16px">eco</mat-icon> Veg
          </mat-checkbox>
          <mat-checkbox [(ngModel)]="filterVegan" (change)="applyFilters()" color="primary">
            <mat-icon style="color:#15803d;font-size:16px">spa</mat-icon> Vegan
          </mat-checkbox>
          <mat-checkbox [(ngModel)]="filterGF" (change)="applyFilters()" color="primary">
            <mat-icon style="color:#b45309;font-size:16px">grain</mat-icon> Gluten-Free
          </mat-checkbox>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="category-tabs">
        <button
          *ngFor="let cat of categories"
          class="cat-tab"
          [class.active]="selectedCategoryId === cat.id"
          (click)="selectCategory(cat.id)">
          <mat-icon>{{ cat.icon }}</mat-icon>
          <span>{{ cat.name }}</span>
        </button>
        <button class="cat-tab" [class.active]="selectedCategoryId === 0" (click)="selectCategory(0)">
          <mat-icon>grid_view</mat-icon>
          <span>All</span>
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-state">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Loading delicious menu...</p>
      </div>

      <!-- Results Count -->
      <div class="results-bar" *ngIf="!loading">
        <span class="results-count">
          {{ filteredItems.length }} item{{ filteredItems.length !== 1 ? 's' : '' }} found
        </span>
        <span class="category-label" *ngIf="selectedCategoryId !== 0">
          in {{ getCategoryName(selectedCategoryId) }}
        </span>
      </div>

      <!-- Menu Grid -->
      <div class="menu-grid" *ngIf="!loading">
        <mat-card
          *ngFor="let item of filteredItems; trackBy: trackById"
          class="menu-card"
          [appHighlight]="item.isRecommended ? 'recommended' : item.isDiscounted ? 'discounted' : ''"
          [isActive]="item.isRecommended || item.isDiscounted">

          <!-- Badges -->
          <div class="item-badges">
            <span *ngIf="item.isRecommended" class="badge badge-recommended">
              <mat-icon>star</mat-icon> Chef's Pick
            </span>
            <span *ngIf="item.isDiscounted" class="badge badge-discount">
              {{ item.discountPercent }}% OFF
            </span>
            <span *ngIf="!item.isAvailable" class="badge badge-unavailable">Unavailable</span>
          </div>

          <!-- Diet Icons -->
          <div class="diet-icons">
            <span *ngIf="item.isVegan" matTooltip="Vegan" class="diet-icon vegan">V</span>
            <span *ngIf="item.isVegetarian && !item.isVegan" matTooltip="Vegetarian" class="diet-icon veg">V</span>
            <span *ngIf="item.isGlutenFree" matTooltip="Gluten Free" class="diet-icon gf">GF</span>
          </div>

          <div class="card-img-wrap" [routerLink]="['/menu', item.id]">
            <img [src]="item.imageUrl" [alt]="item.name" class="card-img"
              onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'">
            <div class="img-overlay">
              <mat-icon>visibility</mat-icon>
              <span>View Details</span>
            </div>
          </div>

          <mat-card-content class="card-content">
            <div class="card-category">{{ item.categoryName }}</div>
            <h3 class="card-title" [routerLink]="['/menu', item.id]">{{ item.name }}</h3>
            <p class="card-desc">{{ item.description | slice:0:85 }}{{ item.description.length > 85 ? '...' : '' }}</p>

            <!-- Rating -->
            <div class="card-rating">
              <mat-icon class="star-icon">star</mat-icon>
              <span class="rating-val">{{ item.rating }}</span>
              <span class="review-count">({{ item.reviewCount }})</span>
              <span class="prep-time">
                <mat-icon>schedule</mat-icon> {{ item.preparationTime }}min
              </span>
            </div>

            <!-- Spice Level -->
            <div class="spice-row" *ngIf="item.spiceLevel">
              <span class="spice-label">Spice:</span>
              <span class="spice-badge" [ngClass]="'spice-' + item.spiceLevel">{{ item.spiceLevel }}</span>
            </div>
          </mat-card-content>

          <mat-card-actions class="card-actions">
            <div class="price-block">
              <span class="price-current">
                {{ getDiscountedPrice(item) | currency:'USD' }}
              </span>
              <span *ngIf="item.isDiscounted" class="price-original">
                {{ item.price | currency:'USD' }}
              </span>
            </div>
            <button
              mat-raised-button
              [color]="isInCart(item.id) ? 'accent' : 'primary'"
              (click)="addToCart(item)"
              [disabled]="!item.isAvailable"
              class="add-btn">
              <mat-icon>{{ isInCart(item.id) ? 'check' : 'add_shopping_cart' }}</mat-icon>
              {{ isInCart(item.id) ? 'Added' : 'Add to Cart' }}
            </button>
          </mat-card-actions>
        </mat-card>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="filteredItems.length === 0 && !loading">
          <mat-icon>search_off</mat-icon>
          <h3>No dishes found</h3>
          <p>Try adjusting your search or filters</p>
          <button mat-stroked-button (click)="clearFilters()">Clear All Filters</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .menu-page { min-height: 100vh; background: #faf7f4; }
    .menu-hero {
      background: linear-gradient(135deg, #1a0a00 0%, #3d1a00 60%, #78350f 100%);
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 70px;
    }
    .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: 48px;
      color: #fff;
      text-align: center;
      margin: 0;
    }
    .hero-subtitle { color: #f59e0b; text-align: center; margin: 8px 0 0; font-size: 16px; letter-spacing: 2px; text-transform: uppercase; }
    .filter-bar {
      background: #fff;
      padding: 20px 32px;
      display: flex;
      align-items: center;
      gap: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      flex-wrap: wrap;
    }
    .search-wrap { flex: 1; min-width: 250px; }
    .search-field { width: 100%; }
    .filter-toggles { display: flex; gap: 24px; align-items: center; flex-wrap: wrap; }
    .category-tabs {
      display: flex;
      gap: 8px;
      padding: 16px 32px;
      overflow-x: auto;
      background: #fff;
      border-bottom: 1px solid #e5e7eb;
      scrollbar-width: none;
    }
    .cat-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 20px;
      border: 2px solid #e5e7eb;
      border-radius: 50px;
      background: transparent;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #6b7280;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .cat-tab:hover { border-color: #f59e0b; color: #f59e0b; }
    .cat-tab.active { background: #1a0a00; border-color: #1a0a00; color: #f59e0b; }
    .loading-state { display: flex; flex-direction: column; align-items: center; padding: 80px; gap: 16px; color: #6b7280; }
    .results-bar { padding: 16px 32px; display: flex; gap: 8px; align-items: center; font-size: 14px; color: #6b7280; }
    .results-count { font-weight: 600; color: #1a0a00; }
    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      padding: 16px 32px 48px;
    }
    .menu-card {
      border-radius: 16px !important;
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
      position: relative;
      border: 1px solid #e5e7eb;
    }
    .menu-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important; }
    .item-badges { position: absolute; top: 12px; left: 12px; z-index: 10; display: flex; flex-direction: column; gap: 4px; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge mat-icon { font-size: 12px; height: 12px; width: 12px; }
    .badge-recommended { background: #1a0a00; color: #f59e0b; }
    .badge-discount { background: #dc2626; color: #fff; }
    .badge-unavailable { background: #6b7280; color: #fff; }
    .diet-icons { position: absolute; top: 12px; right: 12px; z-index: 10; display: flex; gap: 4px; }
    .diet-icon {
      width: 22px; height: 22px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 800;
    }
    .vegan { background: #16a34a; color: #fff; }
    .veg { background: #4ade80; color: #166534; }
    .gf { background: #f59e0b; color: #fff; }
    .card-img-wrap { position: relative; height: 200px; overflow: hidden; cursor: pointer; }
    .card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
    .img-overlay {
      position: absolute; inset: 0;
      background: rgba(26,10,0,0.5);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 8px; color: #fff; opacity: 0; transition: opacity 0.3s;
    }
    .card-img-wrap:hover .img-overlay { opacity: 1; }
    .card-img-wrap:hover .card-img { transform: scale(1.1); }
    .card-content { padding: 16px !important; }
    .card-category { font-size: 11px; color: #f59e0b; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
    .card-title { font-family: 'Playfair Display', serif; font-size: 18px; margin: 6px 0; cursor: pointer; color: #1a0a00; }
    .card-title:hover { color: #f59e0b; }
    .card-desc { font-size: 13px; color: #6b7280; line-height: 1.5; margin-bottom: 12px; }
    .card-rating { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #6b7280; }
    .star-icon { color: #f59e0b; font-size: 16px; height: 16px; width: 16px; }
    .rating-val { font-weight: 700; color: #1a0a00; }
    .prep-time { display: flex; align-items: center; gap: 2px; margin-left: auto; }
    .prep-time mat-icon { font-size: 14px; height: 14px; width: 14px; }
    .spice-row { display: flex; align-items: center; gap: 8px; margin-top: 8px; font-size: 12px; }
    .spice-badge { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
    .spice-mild { background: #d1fae5; color: #065f46; }
    .spice-medium { background: #fef3c7; color: #92400e; }
    .spice-hot { background: #fee2e2; color: #991b1b; }
    .spice-extra-hot { background: #dc2626; color: #fff; }
    .card-actions {
      display: flex !important;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px 16px !important;
      flex-wrap: wrap;
      gap: 8px;
    }
    .price-block { display: flex; flex-direction: column; }
    .price-current { font-size: 20px; font-weight: 800; color: #1a0a00; }
    .price-original { font-size: 13px; color: #9ca3af; text-decoration: line-through; }
    .add-btn { border-radius: 24px !important; }
    .empty-state {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px;
      gap: 16px;
      color: #6b7280;
    }
    .empty-state mat-icon { font-size: 64px; height: 64px; width: 64px; opacity: 0.3; }
    :global(.highlight-recommended) { box-shadow: 0 0 0 2px #f59e0b !important; }
    :global(.highlight-discounted) { box-shadow: 0 0 0 2px #dc2626 !important; }
    @media (max-width: 768px) {
      .filter-bar { padding: 16px; }
      .menu-grid { padding: 16px; }
      .category-tabs { padding: 12px 16px; }
    }
  `]
})
export class MenuListComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  categories: Category[] = [];
  selectedCategoryId = 0;
  searchControl = new FormControl('');
  filterVeg = false;
  filterVegan = false;
  filterGF = false;
  loading = true;
  cartItemIds = new Set<number>();

  private destroy$ = new Subject<void>();

  constructor(
    private menuService: MenuService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.menuService.getMenuItems().pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.menuItems = items;
      this.loading = false;
      this.applyFilters();
    });

    this.menuService.getCategories().pipe(takeUntil(this.destroy$)).subscribe(cats => {
      this.categories = cats;
    });

    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.cartItemIds = new Set(items.map(i => i.menuItem.id));
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.applyFilters());
  }

  selectCategory(id: number): void {
    this.selectedCategoryId = id;
    this.applyFilters();
  }

  applyFilters(): void {
    let items = [...this.menuItems];
    if (this.selectedCategoryId !== 0) {
      items = items.filter(i => i.categoryId === this.selectedCategoryId);
    }
    if (this.filterVeg) items = items.filter(i => i.isVegetarian);
    if (this.filterVegan) items = items.filter(i => i.isVegan);
    if (this.filterGF) items = items.filter(i => i.isGlutenFree);
    const term = this.searchControl.value?.toLowerCase().trim() || '';
    if (term) {
      items = items.filter(i =>
        i.name.toLowerCase().includes(term) ||
        i.description.toLowerCase().includes(term) ||
        i.tags.some(t => t.toLowerCase().includes(term))
      );
    }
    this.filteredItems = items;
  }

  clearFilters(): void {
    this.selectedCategoryId = 0;
    this.filterVeg = false;
    this.filterVegan = false;
    this.filterGF = false;
    this.searchControl.reset();
    this.applyFilters();
  }

  addToCart(item: MenuItem): void {
    if (!item.isAvailable) return;
    this.cartService.addToCart(item);
    this.snackBar.open(`${item.name} added to cart!`, 'View Cart', {
      duration: 3000,
      panelClass: ['success-snack']
    });
  }

  isInCart(id: number): boolean {
    return this.cartItemIds.has(id);
  }

  getDiscountedPrice(item: MenuItem): number {
    return this.menuService.getDiscountedPrice(item);
  }

  getCategoryName(id: number): string {
    return this.categories.find(c => c.id === id)?.name || '';
  }

  trackById(index: number, item: MenuItem): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
