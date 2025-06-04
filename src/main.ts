import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { App } from './app/app.component';
import { authGuard } from './app/core/guards/auth.guard';
import { adminGuard } from './app/core/guards/admin.guard';

const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./app/features/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'about', 
    loadComponent: () => import('./app/features/about/about.component').then(m => m.AboutComponent) 
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./app/features/auth/auth.routes').then(m => m.AUTH_ROUTES) 
  },
  { 
    path: 'products', 
    loadChildren: () => import('./app/features/products/products.routes').then(m => m.PRODUCTS_ROUTES),
    canActivate: [authGuard]
  },
  { 
    path: 'cart', 
    loadComponent: () => import('./app/features/cart/cart.component').then(m => m.CartComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'checkout', 
    loadComponent: () => import('./app/features/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./app/features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./app/features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [adminGuard]
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
}).catch(err => console.error(err));