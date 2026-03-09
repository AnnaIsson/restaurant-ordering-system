import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartGuard } from './guards/cart.guard';

const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  {
    path: 'menu',
    loadChildren: () =>
      import('./components/menu-list/menu-list.module').then(m => m.MenuListModule)
  },
  {
    path: 'menu/:id',
    loadChildren: () =>
      import('./components/menu-detail/menu-detail.module').then(m => m.MenuDetailModule)
  },
  { path: 'cart', loadChildren: () =>
      import('./components/cart/cart.module').then(m => m.CartModule)
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./components/order-form/order-form.module').then(m => m.OrderFormModule),
    canActivate: [CartGuard]
  },
  {
    path: 'confirmation/:orderId',
    loadChildren: () =>
      import('./components/order-confirmation/order-confirmation.module')
        .then(m => m.OrderConfirmationModule)
  },
  { path: '**', redirectTo: 'menu' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
