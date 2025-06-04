import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product, ProductCreateRequest, ProductUpdateRequest } from '../models/product.model';

// Mock data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Smartphone X',
    description: 'Latest smartphone with amazing features.',
    price: 999.99,
    promotionPrice: 899.99,
    imageUrl: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Electronics',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: '2',
    title: 'Laptop Pro',
    description: 'Powerful laptop for professionals.',
    price: 1299.99,
    imageUrl: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600',
    category: 'Electronics',
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02')
  },
  {
    id: '3',
    title: 'Wireless Headphones',
    description: 'Premium sound quality with noise cancellation.',
    price: 299.99,
    promotionPrice: 249.99,
    imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Audio',
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-03')
  },
  {
    id: '4',
    title: 'Smartwatch',
    description: 'Track your fitness and stay connected.',
    price: 199.99,
    imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Wearables',
    createdAt: new Date('2023-01-04'),
    updatedAt: new Date('2023-01-04')
  }
];

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(MOCK_PRODUCTS).pipe(delay(500)); // Simulate network delay
  }

  getProductById(id: string): Observable<Product> {
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    
    if (product) {
      return of(product).pipe(delay(300));
    }
    
    return throwError(() => new Error('Product not found'));
  }

  getPromotedProducts(): Observable<Product[]> {
    const promotedProducts = MOCK_PRODUCTS.filter(p => p.promotionPrice !== undefined);
    return of(promotedProducts).pipe(delay(500));
  }

  searchProducts(query: string): Observable<Product[]> {
    if (!query.trim()) {
      return this.getProducts();
    }
    
    const filteredProducts = MOCK_PRODUCTS.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase())
    );
    
    return of(filteredProducts).pipe(delay(300));
  }

  createProduct(productData: ProductCreateRequest): Observable<Product> {
    const newProduct: Product = {
      id: Math.random().toString(36).substring(2, 9),
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    MOCK_PRODUCTS.push(newProduct);
    return of(newProduct).pipe(delay(500));
  }

  updateProduct(id: string, productData: ProductUpdateRequest): Observable<Product> {
    const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
    
    if (index !== -1) {
      const updatedProduct = {
        ...MOCK_PRODUCTS[index],
        ...productData,
        updatedAt: new Date()
      };
      
      MOCK_PRODUCTS[index] = updatedProduct;
      return of(updatedProduct).pipe(delay(500));
    }
    
    return throwError(() => new Error('Product not found'));
  }

  deleteProduct(id: string): Observable<boolean> {
    const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
    
    if (index !== -1) {
      MOCK_PRODUCTS.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    
    return throwError(() => new Error('Product not found'));
  }
}