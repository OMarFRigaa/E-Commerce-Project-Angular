import { Routes } from '@angular/router';
import { AdminProductsComponent } from './products/admin-products.component';
import { AdminOrdersComponent } from './orders/admin-orders.component';

export const ADMIN_ROUTES: Routes = [
  { path: 'products', component: AdminProductsComponent },
  { path: 'orders', component: AdminOrdersComponent },
  { path: '', redirectTo: 'products', pathMatch: 'full' }
];