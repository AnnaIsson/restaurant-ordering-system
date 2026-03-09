// pipes/discount-price.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { MenuItem } from '../models';

/**
 * DiscountPricePipe — returns the effective price after discount.
 * Usage: item | discountPrice
 *        price | discountPrice:discountPercent
 */
@Pipe({ name: 'discountPrice' })
export class DiscountPricePipe implements PipeTransform {
  transform(item: MenuItem | number, discountPercent?: number): number {
    if (typeof item === 'number') {
      const pct = discountPercent ?? 0;
      return item * (1 - pct / 100);
    }
    if (item.isDiscounted && item.discountPercent > 0) {
      return item.price * (1 - item.discountPercent / 100);
    }
    return item.price;
  }
}
