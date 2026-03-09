// ============================================================
// OrderService - Handles order placement and management
// ============================================================
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Order } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'assets/data/db.json';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {}

  placeOrder(order: Order): Observable<Order> {
    // Simulate API POST - generate ID and confirmation
    const confirmedOrder: Order = {
      ...order,
      id: this.generateOrderId(),
      status: 'confirmed',
      orderDate: new Date(),
      estimatedDelivery: this.calculateEstimatedDelivery()
    };

    // In real app: return this.http.post<Order>('/api/orders', confirmedOrder);
    // Here we simulate:
    const currentOrders = this.ordersSubject.getValue();
    this.ordersSubject.next([...currentOrders, confirmedOrder]);

    return of(confirmedOrder);
  }

  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return of(this.ordersSubject.getValue().find(o => o.id === id));
  }

  private generateOrderId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  private calculateEstimatedDelivery(): Date {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 35);
    return now;
  }
}
