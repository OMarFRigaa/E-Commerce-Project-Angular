import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="product-list-container">
      <header class="product-list-header">
        <h1>All Products</h1>
        
        <div class="search-container">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (input)="onSearch()"
            placeholder="Search products..." 
            class="search-input"
          />
        </div>
      </header>
      
      @if (loading) {
        <app-loading-spinner></app-loading-spinner>
      } @else if (products.length === 0) {
        <div class="no-products">
          <p>No products found matching your search.</p>
        </div>
      } @else {
        <div class="products-grid">
          @for (product of products; track product.id) {
            <app-product-card [product]="product"></app-product-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .product-list-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .product-list-header {
      margin-bottom: 2rem;
      display: flex;
      flex-direction: column;
    }
    
    .product-list-header h1 {
      margin-bottom: 1rem;
      color: #333;
    }
    
    .search-container {
      width: 100%;
      max-width: 500px;
    }
    
    .search-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .search-input:focus {
      outline: none;
      border-color: #3366CC;
      box-shadow: 0 0 0 2px rgba(51, 102, 204, 0.25);
    }
    
    .no-products {
      text-align: center;
      padding: 3rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .no-products p {
      font-size: 1.1rem;
      color: #666;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
      }
    }
    
    @media (max-width: 480px) {
      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  searchQuery = '';
  searchTimeout: any;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    // Clear previous timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // Set new timeout to avoid too many API calls while typing
    this.searchTimeout = setTimeout(() => {
      this.loading = true;
      
      if (!this.searchQuery.trim()) {
        this.loadProducts();
        return;
      }
      
      this.productService.searchProducts(this.searchQuery).subscribe({
        next: (products) => {
          this.products = products;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching products', error);
          this.loading = false;
        }
      });
    }, 300);
  }
}