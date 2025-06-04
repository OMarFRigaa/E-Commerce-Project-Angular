import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="admin-container">
      <h1>Manage Products</h1>
      
      <div class="admin-actions">
        <button 
          class="btn btn-primary" 
          (click)="showProductForm('create')"
        >
          Add New Product
        </button>
      </div>
      
      <!-- Success and Error Messages -->
      @if (successMessage) {
        <div class="alert alert-success">{{ successMessage }}</div>
      }
      
      @if (errorMessage) {
        <div class="alert alert-danger">{{ errorMessage }}</div>
      }
      
      <!-- Product Form (Create/Edit) -->
      @if (showForm) {
        <div class="product-form-container">
          <h2>{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h2>
          
          <form [formGroup]="productForm" (ngSubmit)="saveProduct()">
            <div class="form-group">
              <label for="title">Product Title</label>
              <input 
                type="text" 
                id="title" 
                formControlName="title" 
                class="form-control"
              />
              @if (title?.invalid && (title?.dirty || title?.touched)) {
                <div class="form-error">
                  @if (title?.errors?.['required']) {
                    <span>Title is required</span>
                  }
                </div>
              }
            </div>
            
            <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                formControlName="description" 
                class="form-control" 
                rows="4"
              ></textarea>
              @if (description?.invalid && (description?.dirty || description?.touched)) {
                <div class="form-error">
                  @if (description?.errors?.['required']) {
                    <span>Description is required</span>
                  }
                </div>
              }
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="price">Price</label>
                <input 
                  type="number" 
                  id="price" 
                  formControlName="price" 
                  class="form-control"
                  step="0.01"
                  min="0"
                />
                @if (price?.invalid && (price?.dirty || price?.touched)) {
                  <div class="form-error">
                    @if (price?.errors?.['required']) {
                      <span>Price is required</span>
                    }
                    @if (price?.errors?.['min']) {
                      <span>Price must be greater than 0</span>
                    }
                  </div>
                }
              </div>
              
              <div class="form-group">
                <label for="promotionPrice">Promotion Price (optional)</label>
                <input 
                  type="number" 
                  id="promotionPrice" 
                  formControlName="promotionPrice" 
                  class="form-control"
                  step="0.01"
                  min="0"
                />
                @if (promotionPrice?.invalid && (promotionPrice?.dirty || promotionPrice?.touched)) {
                  <div class="form-error">
                    @if (promotionPrice?.errors?.['min']) {
                      <span>Promotion price must be greater than 0</span>
                    }
                  </div>
                }
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="category">Category</label>
                <input 
                  type="text" 
                  id="category" 
                  formControlName="category" 
                  class="form-control"
                />
                @if (category?.invalid && (category?.dirty || category?.touched)) {
                  <div class="form-error">
                    @if (category?.errors?.['required']) {
                      <span>Category is required</span>
                    }
                  </div>
                }
              </div>
              
              <div class="form-group">
                <label for="imageUrl">Image URL</label>
                <input 
                  type="text" 
                  id="imageUrl" 
                  formControlName="imageUrl" 
                  class="form-control"
                />
                @if (imageUrl?.invalid && (imageUrl?.dirty || imageUrl?.touched)) {
                  <div class="form-error">
                    @if (imageUrl?.errors?.['required']) {
                      <span>Image URL is required</span>
                    }
                  </div>
                }
              </div>
            </div>
            
            <div class="form-actions">
              <button 
                type="button" 
                class="btn btn-secondary" 
                (click)="hideProductForm()"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary" 
                [disabled]="productForm.invalid || isSubmitting"
              >
                {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product') }}
              </button>
            </div>
          </form>
        </div>
      }
      
      <!-- Products Table -->
      <div class="products-table-container">
        @if (loading) {
          <div class="loading">Loading products...</div>
        } @else if (products.length === 0) {
          <div class="no-products">
            <p>No products found.</p>
          </div>
        } @else {
          <table class="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (product of products; track product.id) {
                <tr>
                  <td>
                    <img [src]="product.imageUrl" [alt]="product.title" class="product-thumbnail" />
                  </td>
                  <td>{{ product.title }}</td>
                  <td>
                    @if (product.promotionPrice) {
                      <div class="price-with-promotion">
                        <span class="promotion-price">{{ product.promotionPrice.toFixed(2) }}</span>
                        <span class="original-price">{{ product.price.toFixed(2) }}</span>
                      </div>
                    } @else {
                      {{ product.price.toFixed(2) }}
                    }
                  </td>
                  <td>{{ product.category }}</td>
                  <td>
                    <div class="action-buttons">
                      <button 
                        class="btn btn-sm btn-outline" 
                        (click)="editProduct(product)"
                      >
                        Edit
                      </button>
                      <button 
                        class="btn btn-sm btn-danger" 
                        (click)="deleteProduct(product.id)"
                        [disabled]="isDeleting"
                      >
                        {{ isDeleting && deletingProductId === product.id ? 'Deleting...' : 'Delete' }}
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    h1 {
      margin-bottom: 2rem;
      color: #333;
    }
    
    .admin-actions {
      margin-bottom: 2rem;
    }
    
    .product-form-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      margin-bottom: 2rem;
    }
    
    .product-form-container h2 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      color: #333;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .form-group {
      margin-bottom: 1.25rem;
    }
    
    .form-error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }
    
    .products-table-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      overflow-x: auto;
    }
    
    .loading, .no-products {
      text-align: center;
      padding: 2rem 0;
      color: #666;
    }
    
    .products-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .products-table th {
      text-align: left;
      padding: 1rem;
      border-bottom: 2px solid #eee;
      color: #333;
      font-weight: 600;
    }
    
    .products-table td {
      padding: 1rem;
      border-bottom: 1px solid #eee;
      vertical-align: middle;
    }
    
    .product-thumbnail {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .price-with-promotion {
      display: flex;
      flex-direction: column;
    }
    
    .promotion-price {
      color: #e53935;
      font-weight: 500;
    }
    
    .original-price {
      color: #999;
      text-decoration: line-through;
      font-size: 0.9rem;
    }
    
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    
    .btn-sm {
      padding: 0.25rem 0.75rem;
      font-size: 0.875rem;
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .products-table th:nth-child(4),
      .products-table td:nth-child(4) {
        display: none;
      }
    }
    
    @media (max-width: 480px) {
      .products-table th:nth-child(2),
      .products-table td:nth-child(2) {
        display: none;
      }
      
      .action-buttons {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  productForm: FormGroup;
  loading = true;
  showForm = false;
  isEditing = false;
  isSubmitting = false;
  isDeleting = false;
  successMessage = '';
  errorMessage = '';
  editingProductId: string | null = null;
  deletingProductId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.createProductForm();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  get title() { return this.productForm.get('title'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get promotionPrice() { return this.productForm.get('promotionPrice'); }
  get category() { return this.productForm.get('category'); }
  get imageUrl() { return this.productForm.get('imageUrl'); }

  createProductForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      promotionPrice: [null, [Validators.min(0.01)]],
      category: ['', Validators.required],
      imageUrl: ['', Validators.required]
    });
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
        this.errorMessage = 'Failed to load products. Please try again.';
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  showProductForm(mode: 'create' | 'edit'): void {
    this.isEditing = mode === 'edit';
    this.showForm = true;
    
    if (mode === 'create') {
      this.productForm.reset();
      this.editingProductId = null;
    }
    
    // Clear any messages
    this.successMessage = '';
    this.errorMessage = '';
  }

  hideProductForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.editingProductId = null;
  }

  editProduct(product: Product): void {
    this.productForm.patchValue({
      title: product.title,
      description: product.description,
      price: product.price,
      promotionPrice: product.promotionPrice || null,
      category: product.category,
      imageUrl: product.imageUrl
    });
    
    this.editingProductId = product.id;
    this.showProductForm('edit');
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    const productData = this.productForm.value;
    
    // Convert empty string to null for optional fields
    if (productData.promotionPrice === '') {
      productData.promotionPrice = null;
    }
    
    if (this.isEditing && this.editingProductId) {
      // Update existing product
      this.productService.updateProduct(this.editingProductId, productData).subscribe({
        next: (updatedProduct) => {
          this.isSubmitting = false;
          this.successMessage = 'Product updated successfully!';
          
          // Update product in the list
          const index = this.products.findIndex(p => p.id === updatedProduct.id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
          
          this.hideProductForm();
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.message || 'Failed to update product. Please try again.';
        }
      });
    } else {
      // Create new product
      this.productService.createProduct(productData).subscribe({
        next: (newProduct) => {
          this.isSubmitting = false;
          this.successMessage = 'Product created successfully!';
          
          // Add new product to the list
          this.products.push(newProduct);
          
          this.hideProductForm();
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.message || 'Failed to create product. Please try again.';
        }
      });
    }
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.isDeleting = true;
      this.deletingProductId = productId;
      this.successMessage = '';
      this.errorMessage = '';
      
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.isDeleting = false;
          this.deletingProductId = null;
          this.successMessage = 'Product deleted successfully!';
          
          // Remove product from the list
          this.products = this.products.filter(p => p.id !== productId);
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.isDeleting = false;
          this.deletingProductId = null;
          this.errorMessage = error.message || 'Failed to delete product. Please try again.';
        }
      });
    }
  }
}