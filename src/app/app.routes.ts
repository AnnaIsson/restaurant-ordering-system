// ============================================================
// App Routes - Navigation configuration with lazy loading
// ============================================================
import { Routes } from '@angular/router';
import { CartGuard } from './guards/cart.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'menu',
    pathMatch: 'full'
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./components/menu-list/menu-list.component').then(m => m.MenuListComponent),
    title: 'Menu | Bella Vista'
  },
  {
    path: 'menu/:id',
    loadComponent: () =>
      import('./components/menu-detail/menu-detail.component').then(m => m.MenuDetailComponent),
    title: 'Item Details | Bella Vista'
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./components/cart/cart.component').then(m => m.CartComponent),
    title: 'Cart | Bella Vista'
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./components/order-form/order-form.component').then(m => m.OrderFormComponent),
    canActivate: [CartGuard],
    title: 'Checkout | Bella Vista'
  },
  {
    path: 'confirmation',
    loadComponent: () =>
      import('./components/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent),
    title: 'Order Confirmed | Bella Vista'
  },
  {
    path: '**',
    redirectTo: 'menu'
  }
];
