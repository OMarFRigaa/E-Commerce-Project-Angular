import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Cart, CartItem } from '../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-container">
      <h1>Your Shopping Cart</h1>
      
      @if (cart.items.length === 0) {
        <div class="empty-cart">
          <p>Your cart is empty.</p>
          <a routerLink="/products" class="btn btn-primary">Continue Shopping</a>
        </div>
      } @else {
        <div class="cart-content">
          <div class="cart-items">
            @for (item of cart.items; track item.product.id) {
              <div class="cart-item">
                <div class="item-image">
                  <img [src]="item.product.imageUrl" [alt]="item.product.title" />
                </div>
                
                <div class="item-details">
                  <h3>{{ item.product.title }}</h3>
                  <p class="item-price">
                    {{ (item.product.promotionPrice || item.product.price).toFixed(2) }}
                  </p>
                </div>
                
                <div class="item-quantity">
                  <button 
                    class="quantity-btn" 
                    (click)="decreaseQuantity(item)"
                  >
                    -
                  </button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button 
                    class="quantity-btn" 
                    (click)="increaseQuantity(item)"
                  >
                    +
                  </button>
                </div>
                
                <div class="item-total">
                  {{ ((item.product.promotionPrice || item.product.price) * item.quantity).toFixed(2) }}
                </div>
                
                <button 
                  class="remove-btn" 
                  (click)="removeItem(item.product.id)"
                >
                  ✕
                </button>
              </div>
            }
          </div>
          
          <div class="cart-summary">
            <h2>Order Summary</h2>
            
            <div class="summary-item">
              <span>Subtotal</span>
              <span>{{ cart.totalPrice.toFixed(2) }}</span>
            </div>
            
            <div class="summary-item">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            
            <div class="summary-total">
              <span>Total</span>
              <span>{{ cart.totalPrice.toFixed(2) }}</span>
            </div>
            
            <a routerLink="/checkout" class="btn btn-primary checkout-btn">
              Proceed to Checkout
            </a>
            
            <a routerLink="/products" class="btn btn-outline continue-shopping-btn">
              Continue Shopping
            </a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    h1 {
      margin-bottom: 2rem;
      color: #333;
    }
    
    .empty-cart {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 3rem;
      text-align: center;
    }
    
    .empty-cart p {
      font-size: 1.25rem;
      color: #666;
      margin-bottom: 1.5rem;
    }
    
    .cart-content {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
    }
    
    .cart-items {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
    }
    
    .cart-item {
      display: flex;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .cart-item:last-child {
      border-bottom: none;
    }
    
    .item-image {
      width: 80px;
      height: 80px;
      margin-right: 1rem;
    }
    
    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .item-details {
      flex-grow: 1;
    }
    
    .item-details h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      color: #333;
    }
    
    .item-price {
      color: #666;
      font-size: 0.95rem;
    }
    
    .item-quantity {
      display: flex;
      align-items: center;
      margin: 0 1.5rem;
    }
    
    .quantity-btn {
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .quantity-btn:hover {
      background-color: #e0e0e0;
    }
    
    .quantity {
      margin: 0 0.75rem;
      font-size: 0.95rem;
      min-width: 20px;
      text-align: center;
    }
    
    .item-total {
      font-weight: 600;
      color: #333;
      width: 80px;
      text-align: right;
    }
    
    .remove-btn {
      background: none;
      border: none;
      color: #999;
      font-size: 1rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      margin-left: 1rem;
      transition: color 0.3s;
    }
    
    .remove-btn:hover {
      color: #e53935;
    }
    
    .cart-summary {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      height: fit-content;
    }
    
    .cart-summary h2 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      color: #333;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      color: #666;
    }
    
    .summary-total {
      display: flex;
      justify-content: space-between;
      margin: 1.5rem 0;
      padding-top: 1rem;
      border-top: 1px solid #eee;
      font-weight: 600;
      color: #333;
      font-size: 1.15rem;
    }
    
    .checkout-btn {
      display: block;
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1rem;
    }
    
    .continue-shopping-btn {
      display: block;
      width: 100%;
      padding: 0.75rem;
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
      .cart-content {
        grid-template-columns: 1fr;
      }
      
      .item-quantity {
        margin: 0 1rem;
      }
    }
    
    @media (max-width: 480px) {
      .cart-item {
        flex-wrap: wrap;
      }
      
      .item-details {
        width: calc(100% - 100px);
      }
      
      .item-quantity, .item-total {
        margin-top: 1rem;
      }
      
      .item-quantity {
        margin-left: 90px;
      }
      
      .item-total {
        margin-left: auto;
      }
      
      .remove-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [], totalPrice: 0 };

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    } else {
      this.removeItem(item.product.id);
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }
}