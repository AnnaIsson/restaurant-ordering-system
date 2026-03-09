// ============================================================
// MenuService - Fetches and manages menu data
// ============================================================
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { MenuItem, Category, MenuFilter } from '../models/menu-item.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'assets/data/db.json';

  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  menuItems$ = this.menuItemsSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadMenuData();
  }

  private loadMenuData(): void {
    this.http.get<any>(this.apiUrl).pipe(
      tap(data => {
        this.menuItemsSubject.next(data.menuItems);
        this.categoriesSubject.next(data.categories);
      }),
      catchError(err => {
        console.error('Failed to load menu data', err);
        return of({ menuItems: [], categories: [] });
      })
    ).subscribe();
  }

  getMenuItems(): Observable<MenuItem[]> {
    return this.menuItems$;
  }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  getMenuItemById(id: number): Observable<MenuItem | undefined> {
    return this.menuItems$.pipe(
      map(items => items.find(item => item.id === id))
    );
  }

  getMenuItemsByCategory(categoryId: number): Observable<MenuItem[]> {
    return this.menuItems$.pipe(
      map(items => items.filter(item => item.categoryId === categoryId))
    );
  }

  filterMenuItems(filter: MenuFilter): Observable<MenuItem[]> {
    return this.menuItems$.pipe(
      map(items => {
        return items.filter(item => {
          if (filter.categoryId && item.categoryId !== filter.categoryId) return false;
          if (filter.minPrice !== undefined && item.price < filter.minPrice) return false;
          if (filter.maxPrice !== undefined && item.price > filter.maxPrice) return false;
          if (filter.isVegetarian && !item.isVegetarian) return false;
          if (filter.isVegan && !item.isVegan) return false;
          if (filter.isGlutenFree && !item.isGlutenFree) return false;
          if (filter.isRecommended && !item.isRecommended) return false;
          if (filter.searchTerm) {
            const term = filter.searchTerm.toLowerCase();
            return item.name.toLowerCase().includes(term) ||
              item.description.toLowerCase().includes(term) ||
              item.tags.some(tag => tag.toLowerCase().includes(term));
          }
          return true;
        });
      })
    );
  }

  getDiscountedPrice(item: MenuItem): number {
    if (item.isDiscounted && item.discountPercent) {
      return item.price * (1 - item.discountPercent / 100);
    }
    return item.price;
  }

  searchItems(term: string): Observable<MenuItem[]> {
    return this.filterMenuItems({ searchTerm: term });
  }
}
