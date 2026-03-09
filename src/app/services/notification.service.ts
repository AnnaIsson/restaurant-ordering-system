// ============================================================
// NotificationService - Centralized UI notifications
// ============================================================
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string, action = 'Dismiss', duration = 3000): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['success-snack'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  error(message: string, action = 'Dismiss', duration = 5000): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['error-snack'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  info(message: string, action = '', duration = 3000): void {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
