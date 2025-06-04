import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private initialCart: Cart = { items: [], totalPrice: 0 };
  private cartSubject = new BehaviorSubject<Cart>(this.initialCart);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    // Load cart from local storage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartSubject.next(JSON.parse(savedCart));
    }
  }

  getCart(): Cart {
    return this.cartSubject.getValue();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartSubject.getValue();
    const existingItem = currentCart.items.find(item => item.product.id === product.id);
    
    let updatedItems: CartItem[];
    
    if (existingItem) {
      // Update quantity of existing item
      updatedItems = currentCart.items.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      );
    } else {
      // Add new item
      updatedItems = [...currentCart.items, { product, quantity }];
    }
    
    const totalPrice = this.calculateTotalPrice(updatedItems);
    
    const updatedCart: Cart = {
      items: updatedItems,
      totalPrice
    };
    
    this.cartSubject.next(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }

  updateQuantity(productId: string, quantity: number): void {
    const currentCart = this.cartSubject.getValue();
    
    if (quantity <= 0) {
      // Remove item if quantity is zero or negative
      this.removeFromCart(productId);
      return;
    }
    
    const updatedItems = currentCart.items.map(item => 
      item.product.id === productId 
        ? { ...item, quantity } 
        : item
    );
    
    const totalPrice = this.calculateTotalPrice(updatedItems);
    
    const updatedCart: Cart = {
      items: updatedItems,
      totalPrice
    };
    
    this.cartSubject.next(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }

  removeFromCart(productId: string): void {
    const currentCart = this.cartSubject.getValue();
    const updatedItems = currentCart.items.filter(item => item.product.id !== productId);
    
    const totalPrice = this.calculateTotalPrice(updatedItems);
    
    const updatedCart: Cart = {
      items: updatedItems,
      totalPrice
    };
    
    this.cartSubject.next(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }

  clearCart(): void {
    this.cartSubject.next(this.initialCart);
    localStorage.removeItem('cart');
  }

  private calculateTotalPrice(items: CartItem[]): number {
    return items.reduce((total, item) => {
      const price = item.product.promotionPrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  }
}