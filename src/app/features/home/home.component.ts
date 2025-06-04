import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Welcome to Our Store</h1>
          <p>Discover amazing products at unbeatable prices</p>
          <div class="hero-buttons">
            <a routerLink="/products" class="btn btn-primary">Shop Now</a>
            <a routerLink="/about" class="btn btn-outline">Learn More</a>
          </div>
        </div>
      </section>
      
      <!-- Featured Products Section -->
      <section class="featured-products">
        <div class="section-header">
          <h2>Featured Products</h2>
          <p>Check out our special offers</p>
        </div>
        
        @if (loading) {
          <div class="loading-spinner">Loading products...</div>
        } @else if (promotedProducts.length === 0) {
          <p class="no-products">No promoted products available at the moment.</p>
        } @else {
          <div class="products-grid">
            @for (product of promotedProducts; track product.id) {
              <app-product-card [product]="product"></app-product-card>
            }
          </div>
        }
        
        <div class="view-all">
          <a routerLink="/products" class="btn btn-outline">View All Products</a>
        </div>
      </section>
      
      <!-- Categories Section -->
      <section class="categories">
        <div class="section-header">
          <h2>Shop by Category</h2>
          <p>Browse our wide selection of categories</p>
        </div>
        
        <div class="categories-grid">
          <div class="category-card">
            <div class="category-image">
              <!-- Placeholder image -->
              <div class="placeholder-image electronics"></div>
            </div>
            <h3>Electronics</h3>
            <a routerLink="/products" class="btn btn-sm btn-outline">Browse</a>
          </div>
          
          <div class="category-card">
            <div class="category-image">
              <!-- Placeholder image -->
              <div class="placeholder-image fashion"></div>
            </div>
            <h3>Fashion</h3>
            <a routerLink="/products" class="btn btn-sm btn-outline">Browse</a>
          </div>
          
          <div class="category-card">
            <div class="category-image">
              <!-- Placeholder image -->
              <div class="placeholder-image home"></div>
            </div>
            <h3>Home & Living</h3>
            <a routerLink="/products" class="btn btn-sm btn-outline">Browse</a>
          </div>
          
          <div class="category-card">
            <div class="category-image">
              <!-- Placeholder image -->
              <div class="placeholder-image sports"></div>
            </div>
            <h3>Sports</h3>
            <a routerLink="/products" class="btn btn-sm btn-outline">Browse</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    /* Hero Section */
    .hero {
      background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
      background-size: cover;
      background-position: center;
      color: white;
      padding: 5rem 2rem;
      border-radius: 8px;
      margin-bottom: 3rem;
      text-align: center;
    }
    
    .hero-content {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .hero p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    
    .hero-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    
    /* Section Styles */
    .section-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .section-header h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #333;
    }
    
    .section-header p {
      color: #666;
      font-size: 1.1rem;
    }
    
    /* Featured Products */
    .featured-products {
      padding: 2rem 0;
      margin-bottom: 3rem;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .loading-spinner, .no-products {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
    
    .view-all {
      text-align: center;
      margin-top: 2rem;
    }
    
    /* Categories */
    .categories {
      padding: 2rem 0;
      margin-bottom: 3rem;
    }
    
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 2rem;
    }
    
    .category-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      text-align: center;
      transition: transform 0.3s ease;
    }
    
    .category-card:hover {
      transform: translateY(-5px);
    }
    
    .category-image {
      margin-bottom: 1rem;
    }
    
    .placeholder-image {
      height: 120px;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    .electronics {
      background-color: #3498db;
    }
    
    .fashion {
      background-color: #e74c3c;
    }
    
    .home {
      background-color: #2ecc71;
    }
    
    .sports {
      background-color: #f39c12;
    }
    
    .category-card h3 {
      margin-bottom: 1rem;
      font-size: 1.25rem;
      color: #333;
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
      .hero {
        padding: 3rem 1rem;
      }
      
      .hero h1 {
        font-size: 2rem;
      }
      
      .hero p {
        font-size: 1rem;
      }
      
      .hero-buttons {
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .categories-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 480px) {
      .categories-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  promotedProducts: Product[] = [];
  loading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadPromotedProducts();
  }

  loadPromotedProducts(): void {
    this.productService.getPromotedProducts().subscribe({
      next: (products) => {
        this.promotedProducts = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading promoted products', error);
        this.loading = false;
      }
    });
  }
}