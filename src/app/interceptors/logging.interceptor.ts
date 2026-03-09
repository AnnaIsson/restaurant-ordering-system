// interceptors/logging.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const started = Date.now();
    let status: string;

    return next.handle(request).pipe(
      tap({
        next: event => {
          status = event instanceof HttpResponse ? 'succeeded' : '';
        },
        error: () => { status = 'failed'; }
      }),
      finalize(() => {
        const elapsed = Date.now() - started;
        const msg = `${request.method} "${request.urlWithParams}" ${status} in ${elapsed}ms`;
        console.log(`[LoggingInterceptor] ${msg}`);
      })
    );
  }
}
