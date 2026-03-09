// ============================================================
// PriceRangePipe - Filters menu items by price range
// ============================================================
import { Pipe, PipeTransform } from '@angular/core';
import { MenuItem } from '../models/menu-item.model';

@Pipe({
  name: 'priceRange',
  standalone: true,
  pure: false
})
export class PriceRangePipe implements PipeTransform {
  transform(items: MenuItem[], min?: number, max?: number): MenuItem[] {
    if (!items) return [];
    if (min === undefined && max === undefined) return items;

    return items.filter(item => {
      const price = item.isDiscounted && item.discountPercent
        ? item.price * (1 - item.discountPercent / 100)
        : item.price;
      if (min !== undefined && price < min) return false;
      if (max !== undefined && price > max) return false;
      return true;
    });
  }
}
