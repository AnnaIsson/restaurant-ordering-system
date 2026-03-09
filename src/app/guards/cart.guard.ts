// ============================================================
// CartGuard - Prevents checkout access with empty cart
// ============================================================
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CartService } from '../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartGuard implements CanActivate {
  constructor(
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(): Observable<boolean> {
    return this.cartService.getItemCount().pipe(
      take(1),
      map(count => {
        if (count > 0) {
          return true;
        }
        this.snackBar.open(
          'Your cart is empty. Please add items before checking out.',
          'Browse Menu',
          { duration: 4000, panelClass: ['error-snack'] }
        );
        this.router.navigate(['/menu']);
        return false;
      })
    );
  }
}
