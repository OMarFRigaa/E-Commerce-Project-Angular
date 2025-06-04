import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="product-detail-container">
      @if (loading) {
        <app-loading-spinner></app-loading-spinner>
      } @else if (product) {
        <div class="product-detail">
          <div class="product-image">
            <img [src]="product.imageUrl" [alt]="product.title" />
          </div>
          
          <div class="product-info">
            <h1 class="product-title">{{ product.title }}</h1>
            
            <div class="product-price">
              @if (product.promotionPrice) {
                <p class="promotion-price">{{ product.promotionPrice.toFixed(2) }}</p>
                <p class="original-price">{{ product.price.toFixed(2) }}</p>
              } @else {
                <p class="current-price">{{ product.price.toFixed(2) }}</p>
              }
            </div>
            
            <div class="product-description">
              <h3>Description</h3>
              <p>{{ product.description }}</p>
            </div>
            
            <div class="product-actions">
              <div class="quantity-selector">
                <button 
                  class="quantity-btn" 
                  (click)="decreaseQuantity()" 
                  [disabled]="quantity <= 1"
                >
                  -
                </button>
                <span class="quantity">{{ quantity }}</span>
                <button 
                  class="quantity-btn" 
                  (click)="increaseQuantity()"
                >
                  +
                </button>
              </div>
              
              <button 
                class="btn btn-primary add-to-cart-btn" 
                (click)="addToCart()"
              >
                Add to Cart
              </button>
            </div>
            
            @if (addedToCart) {
              <div class="alert alert-success mt-3">
                Item added to cart successfully!
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="product-not-found">
          <h2>Product Not Found</h2>
          <p>The requested product could not be found.</p>
          <button class="btn btn-primary" (click)="goBack()">Back to Products</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-detail-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    .product-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }
    
    .product-image {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .product-image img {
      max-width: 100%;
      max-height: 400px;
      object-fit: contain;
      border-radius: 4px;
    }
    
    .product-info {
      display: flex;
      flex-direction: column;
    }
    
    .product-title {
      font-size: 1.75rem;
      margin-bottom: 1rem;
      color: #333;
    }
    
    .product-price {
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .promotion-price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #e53935;
    }
    
    .original-price {
      font-size: 1.25rem;
      color: #999;
      text-decoration: line-through;
    }
    
    .current-price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
    }
    
    .product-description {
      margin-bottom: 2rem;
    }
    
    .product-description h3 {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
      color: #333;
    }
    
    .product-description p {
      color: #666;
      line-height: 1.6;
    }
    
    .product-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: auto;
    }
    
    .quantity-selector {
      display: flex;
      align-items: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .quantity-btn {
      background-color: #f5f5f5;
      border: none;
      padding: 0.5rem 1rem;
      font-size: 1.25rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .quantity-btn:hover:not(:disabled) {
      background-color: #e0e0e0;
    }
    
    .quantity-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .quantity {
      padding: 0 1.5rem;
      font-size: 1rem;
      font-weight: 500;
      min-width: 50px;
      text-align: center;
    }
    
    .add-to-cart-btn {
      flex-grow: 1;
      padding: 0.75rem 1.5rem;
    }
    
    .product-not-found {
      text-align: center;
      padding: 3rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .product-not-found h2 {
      margin-bottom: 1rem;
      color: #333;
    }
    
    .product-not-found p {
      margin-bottom: 1.5rem;
      color: #666;
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
      .product-detail {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .product-image {
        margin-bottom: 1rem;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  quantity = 1;
  addedToCart = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    
    if (!productId) {
      this.loading = false;
      return;
    }
    
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product', error);
        this.loading = false;
      }
    });
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.addedToCart = true;
      
      // Reset addedToCart flag after 3 seconds
      setTimeout(() => {
        this.addedToCart = false;
      }, 3000);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}