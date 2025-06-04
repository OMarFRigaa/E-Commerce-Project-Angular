import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CartService } from "../../services/cart.service";
import { Cart } from "../../models/cart.model";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <a routerLink="/">E-commerce Friga Store</a>
        </div>

        <div class="navbar-links">
          <a
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            >Home</a
          >
          <a routerLink="/about" routerLinkActive="active">About</a>

          <!-- Links for authenticated users -->
          @if (isLoggedIn()) {
          <a routerLink="/products" routerLinkActive="active">Products</a>
          <a routerLink="/profile" routerLinkActive="active">Profile</a>
          <!-- Admin links -->
          @if (isAdmin()) {
          <a routerLink="/admin/products" routerLinkActive="active"
            >Manage Products</a
          >
          <a routerLink="/admin/orders" routerLinkActive="active"
            >Manage Orders</a
          >
          } }
        </div>

        <div class="navbar-actions">
          <!-- Cart button (for authenticated users) -->
          @if (isLoggedIn()) {
          <a routerLink="/cart" class="cart-icon" routerLinkActive="active">
            <span class="material-icons">shopping_cart</span>
            @if (cart && cart.items.length > 0) {
            <span class="cart-badge">{{ cart.items.length }}</span>
            }
          </a>
          }

          <!-- Authentication buttons -->
          @if (!isLoggedIn()) {
          <a routerLink="/auth/login" class="btn btn-primary btn-sm">Log In</a>
          <a routerLink="/auth/register" class="btn btn-outline btn-sm"
            >Register</a
          >
          } @else {
          <button class="btn btn-outline btn-sm" (click)="logout()">
            Log Out
          </button>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      .navbar {
        background-color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 1rem 0;
      }

      .navbar-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .navbar-brand a {
        font-size: 1.5rem;
        font-weight: 700;
        color: #333;
        text-decoration: none;
      }

      .navbar-links {
        display: flex;
        gap: 1.5rem;
      }

      .navbar-links a {
        color: #666;
        text-decoration: none;
        font-weight: 500;
        padding: 0.25rem 0;
        transition: color 0.3s;
        position: relative;
      }

      .navbar-links a:hover,
      .navbar-links a.active {
        color: #3366cc;
      }

      .navbar-links a.active::after {
        content: "";
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #3366cc;
      }

      .navbar-actions {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .btn-sm {
        padding: 0.25rem 0.75rem;
        font-size: 0.875rem;
      }

      .cart-icon {
        position: relative;
        margin-right: 1rem;
        color: #666;
        text-decoration: none;
      }

      .cart-icon:hover {
        color: #3366cc;
      }

      .cart-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background-color: #ff9900;
        color: white;
        border-radius: 50%;
        padding: 0.15rem 0.35rem;
        font-size: 0.75rem;
        font-weight: bold;
      }

      /* Material Icons placeholder - in a real app you'd import the actual icons */
      .material-icons {
        font-family: sans-serif;
        font-size: 1.5rem;
      }

      .material-icons:before {
        content: "🛒";
      }

      /* Responsive styles */
      @media (max-width: 768px) {
        .navbar-container {
          flex-direction: column;
          gap: 1rem;
        }

        .navbar-links {
          width: 100%;
          justify-content: space-between;
        }
      }
    `,
  ],
})
export class NavbarComponent {
  cart: Cart | null = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
  }
}
