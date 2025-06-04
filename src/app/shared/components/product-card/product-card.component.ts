import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="product-card">
      <div class="product-image">
        <a [routerLink]="['/products', product.id]">
          <img [src]="product.imageUrl" [alt]="product.title" />
        </a>
        @if (product.promotionPrice) {
          <div class="product-badge">Sale</div>
        }
      </div>
      
      <div class="product-info">
        <h3 class="product-title">
          <a [routerLink]="['/products', product.id]">{{ product.title }}</a>
        </h3>
        
        <div class="product-price">
          @if (product.promotionPrice) {
            <span class="promotion-price">{{ product.promotionPrice.toFixed(2) }}</span>
            <span class="original-price">{{ product.price.toFixed(2) }}</span>
          } @else {
            <span class="current-price">{{ product.price.toFixed(2) }}</span>
          }
        </div>
        
        <button class="btn btn-primary add-to-cart-btn" (click)="addToCart()">
          Add to Cart
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .product-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    
    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .product-card:hover .product-image img {
      transform: scale(1.05);
    }
    
    .product-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: #FF9900;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
    }
    
    .product-info {
      padding: 1.25rem;
    }
    
    .product-title {
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
      line-height: 1.3;
    }
    
    .product-title a {
      color: #333;
      text-decoration: none;
      transition: color 0.3s;
    }
    
    .product-title a:hover {
      color: #3366CC;
    }
    
    .product-price {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    
    .promotion-price {
      font-size: 1.1rem;
      font-weight: 600;
      color: #e53935;
    }
    
    .original-price {
      font-size: 0.95rem;
      color: #999;
      text-decoration: line-through;
    }
    
    .current-price {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
    }
    
    .add-to-cart-btn {
      width: 100%;
      padding: 0.75rem;
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private cartService: CartService) {}

  addToCart(): void {
    this.cartService.addToCart(this.product);
  }
}