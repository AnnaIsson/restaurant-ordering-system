// ============================================================
// ErrorInterceptor - Centralized HTTP error handling
// ============================================================
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred.';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Client Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 0: errorMessage = 'Cannot connect to server. Please check your connection.'; break;
            case 400: errorMessage = 'Bad request. Please check your input.'; break;
            case 401: errorMessage = 'Unauthorized. Please login.'; break;
            case 403: errorMessage = 'Access forbidden.'; break;
            case 404: errorMessage = 'Resource not found.'; break;
            case 500: errorMessage = 'Server error. Please try again later.'; break;
            default: errorMessage = `Error ${error.status}: ${error.message}`;
          }
        }

        console.error('HTTP Error:', error);
        this.snackBar.open(errorMessage, 'Dismiss', {
          duration: 5000,
          panelClass: ['error-snack']
        });

        return throwError(() => error);
      })
    );
  }
}
