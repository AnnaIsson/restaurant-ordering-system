// pipes/menu-filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { MenuItem } from '../models';

/**
 * MenuFilterPipe — filters menu items by category and/or search query.
 * Usage: menuItems | menuFilter:categoryId:searchQuery
 */
@Pipe({
  name: 'menuFilter',
  pure: false // impure so it reacts to array mutations
})
export class MenuFilterPipe implements PipeTransform {
  transform(items: MenuItem[], categoryId?: number, searchQuery?: string, priceMax?: number): MenuItem[] {
    if (!items) return [];

    let filtered = [...items];

    // Filter by category
    if (categoryId && categoryId > 0) {
      filtered = filtered.filter(item => item.categoryId === categoryId);
    }

    // Filter by search query
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.ingredients.some(ing => ing.toLowerCase().includes(q))
      );
    }

    // Filter by max price
    if (priceMax && priceMax > 0) {
      filtered = filtered.filter(item => item.price <= priceMax);
    }

    return filtered;
  }
}
