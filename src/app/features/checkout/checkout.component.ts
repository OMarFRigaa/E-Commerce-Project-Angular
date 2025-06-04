import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { Cart } from '../../core/models/cart.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="checkout-container">
      <h1>Checkout</h1>
      
      @if (cart.items.length === 0) {
        <div class="empty-cart">
          <p>Your cart is empty. Add some products before checkout.</p>
          <a routerLink="/products" class="btn btn-primary">Shop Now</a>
        </div>
      } @else if (orderSuccess) {
        <div class="order-success">
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order. Your order has been received and is being processed.</p>
          <p>You can view your order status in your profile.</p>
          <div class="order-actions">
            <a routerLink="/profile" class="btn btn-primary">View Orders</a>
            <a routerLink="/products" class="btn btn-outline">Continue Shopping</a>
          </div>
        </div>
      } @else {
        <div class="checkout-content">
          <div class="checkout-form-container">
            <h2>Shipping Information</h2>
            
            @if (errorMessage) {
              <div class="alert alert-danger">{{ errorMessage }}</div>
            }
            
            <form [formGroup]="checkoutForm" (ngSubmit)="placeOrder()">
              <div class="form-group">
                <label for="fullName">Full Name</label>
                <input 
                  type="text" 
                  id="fullName" 
                  formControlName="fullName" 
                  class="form-control"
                />
                @if (fullName?.invalid && (fullName?.dirty || fullName?.touched)) {
                  <div class="form-error">
                    @if (fullName?.errors?.['required']) {
                      <span>Full name is required</span>
                    }
                  </div>
                }
              </div>
              
              <div class="form-group">
                <label for="address">Address</label>
                <input 
                  type="text" 
                  id="address" 
                  formControlName="address" 
                  class="form-control"
                />
                @if (address?.invalid && (address?.dirty || address?.touched)) {
                  <div class="form-error">
                    @if (address?.errors?.['required']) {
                      <span>Address is required</span>
                    }
                  </div>
                }
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="city">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    formControlName="city" 
                    class="form-control"
                  />
                  @if (city?.invalid && (city?.dirty || city?.touched)) {
                    <div class="form-error">
                      @if (city?.errors?.['required']) {
                        <span>City is required</span>
                      }
                    </div>
                  }
                </div>
                
                <div class="form-group">
                  <label for="zipCode">Zip Code</label>
                  <input 
                    type="text" 
                    id="zipCode" 
                    formControlName="zipCode" 
                    class="form-control"
                  />
                  @if (zipCode?.invalid && (zipCode?.dirty || zipCode?.touched)) {
                    <div class="form-error">
                      @if (zipCode?.errors?.['required']) {
                        <span>Zip code is required</span>
                      }
                    </div>
                  }
                </div>
              </div>
              
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  formControlName="phone" 
                  class="form-control"
                />
                @if (phone?.invalid && (phone?.dirty || phone?.touched)) {
                  <div class="form-error">
                    @if (phone?.errors?.['required']) {
                      <span>Phone number is required</span>
                    }
                  </div>
                }
              </div>
              
              <h2>Payment Information</h2>
              
              <div class="form-group">
                <label for="cardHolder">Card Holder Name</label>
                <input 
                  type="text" 
                  id="cardHolder" 
                  formControlName="cardHolder" 
                  class="form-control"
                />
                @if (cardHolder?.invalid && (cardHolder?.dirty || cardHolder?.touched)) {
                  <div class="form-error">
                    @if (cardHolder?.errors?.['required']) {
                      <span>Card holder name is required</span>
                    }
                  </div>
                }
              </div>
              
              <div class="form-group">
                <label for="cardNumber">Card Number</label>
                <input 
                  type="text" 
                  id="cardNumber" 
                  formControlName="cardNumber" 
                  class="form-control"
                  placeholder="XXXX XXXX XXXX XXXX"
                />
                @if (cardNumber?.invalid && (cardNumber?.dirty || cardNumber?.touched)) {
                  <div class="form-error">
                    @if (cardNumber?.errors?.['required']) {
                      <span>Card number is required</span>
                    }
                  </div>
                }
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="expiration">Expiration (MM/YY)</label>
                  <input 
                    type="text" 
                    id="expiration" 
                    formControlName="expiration" 
                    class="form-control"
                    placeholder="MM/YY"
                  />
                  @if (expiration?.invalid && (expiration?.dirty || expiration?.touched)) {
                    <div class="form-error">
                      @if (expiration?.errors?.['required']) {
                        <span>Expiration date is required</span>
                      }
                    </div>
                  }
                </div>
                
                <div class="form-group">
                  <label for="cvv">CVV</label>
                  <input 
                    type="text" 
                    id="cvv" 
                    formControlName="cvv" 
                    class="form-control"
                    placeholder="XXX"
                  />
                  @if (cvv?.invalid && (cvv?.dirty || cvv?.touched)) {
                    <div class="form-error">
                      @if (cvv?.errors?.['required']) {
                        <span>CVV is required</span>
                      }
                    </div>
                  }
                </div>
              </div>
              
              <div class="form-actions">
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  [disabled]="checkoutForm.invalid || isLoading"
                >
                  {{ isLoading ? 'Processing...' : 'Place Order' }}
                </button>
              </div>
            </form>
          </div>
          
          <div class="order-summary">
            <h2>Order Summary</h2>
            
            <div class="summary-items">
              @for (item of cart.items; track item.product.id) {
                <div class="summary-item">
                  <div class="item-info">
                    <img [src]="item.product.imageUrl" [alt]="item.product.title" />
                    <div>
                      <h4>{{ item.product.title }}</h4>
                      <p>Quantity: {{ item.quantity }}</p>
                    </div>
                  </div>
                  <div class="item-price">
                    {{ ((item.product.promotionPrice || item.product.price) * item.quantity).toFixed(2) }}
                  </div>
                </div>
              }
            </div>
            
            <div class="summary-totals">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>{{ cart.totalPrice.toFixed(2) }}</span>
              </div>
              
              <div class="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <div class="summary-total">
                <span>Total</span>
                <span>{{ cart.totalPrice.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .checkout-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    h1 {
      margin-bottom: 2rem;
      color: #333;
    }
    
    .empty-cart, .order-success {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 3rem;
      text-align: center;
    }
    
    .empty-cart p, .order-success p {
      font-size: 1.1rem;
      color: #666;
      margin-bottom: 1.5rem;
    }
    
    .order-success h2 {
      color: #28a745;
      margin-bottom: 1.5rem;
    }
    
    .order-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }
    
    .checkout-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }
    
    .checkout-form-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }
    
    .checkout-form-container h2 {
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
      margin-top: 2rem;
    }
    
    .order-summary {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      height: fit-content;
    }
    
    .order-summary h2 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      color: #333;
    }
    
    .summary-items {
      margin-bottom: 1.5rem;
      max-height: 300px;
      overflow-y: auto;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .summary-item:last-child {
      border-bottom: none;
    }
    
    .item-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .item-info img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .item-info h4 {
      font-size: 1rem;
      margin-bottom: 0.25rem;
      color: #333;
    }
    
    .item-info p {
      font-size: 0.875rem;
      color: #666;
    }
    
    .item-price {
      font-weight: 600;
      color: #333;
    }
    
    .summary-totals {
      border-top: 1px solid #eee;
      padding-top: 1rem;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      color: #666;
    }
    
    .summary-total {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
      font-weight: 600;
      color: #333;
      font-size: 1.15rem;
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
      .checkout-content {
        grid-template-columns: 1fr;
      }
      
      .order-summary {
        order: -1;
      }
    }
    
    @media (max-width: 480px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cart: Cart = { items: [], totalPrice: 0 };
  isLoading = false;
  errorMessage = '';
  orderSuccess = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      phone: ['', Validators.required],
      cardHolder: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expiration: ['', Validators.required],
      cvv: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      
      // Redirect to products if cart is empty
      if (cart.items.length === 0 && !this.orderSuccess) {
        this.router.navigate(['/products']);
      }
    });
  }

  get fullName() { return this.checkoutForm.get('fullName'); }
  get address() { return this.checkoutForm.get('address'); }
  get city() { return this.checkoutForm.get('city'); }
  get zipCode() { return this.checkoutForm.get('zipCode'); }
  get phone() { return this.checkoutForm.get('phone'); }
  get cardHolder() { return this.checkoutForm.get('cardHolder'); }
  get cardNumber() { return this.checkoutForm.get('cardNumber'); }
  get expiration() { return this.checkoutForm.get('expiration'); }
  get cvv() { return this.checkoutForm.get('cvv'); }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.checkoutForm.controls).forEach(key => {
        this.checkoutForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // In a real app, you would process payment here

    this.orderService.createOrder().subscribe({
      next: () => {
        this.isLoading = false;
        this.orderSuccess = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to place order. Please try again.';
      }
    });
  }
}