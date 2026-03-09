// ============================================================
// FilterMenuPipe - Filters menu items by various criteria
// ============================================================
import { Pipe, PipeTransform } from '@angular/core';
import { MenuItem } from '../models/menu-item.model';

@Pipe({
  name: 'filterMenu',
  standalone: true,
  pure: false
})
export class FilterMenuPipe implements PipeTransform {
  transform(items: MenuItem[], categoryId?: number, searchTerm?: string): MenuItem[] {
    if (!items) return [];

    let filtered = [...items];

    if (categoryId && categoryId !== 0) {
      filtered = filtered.filter(item => item.categoryId === categoryId);
    }

    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.toLowerCase().includes(term)) ||
        item.categoryName.toLowerCase().includes(term)
      );
    }

    return filtered;
  }
}
