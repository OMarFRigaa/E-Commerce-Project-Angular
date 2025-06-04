import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Order, OrderStatus, CreateOrderRequest, OrderItem, UpdateOrderStatusRequest } from '../models/order.model';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';

// Mock data
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    userId: '2',
    items: [
      {
        productId: '1',
        productTitle: 'Smartphone X',
        price: 899.99,
        quantity: 1
      }
    ],
    totalPrice: 899.99,
    status: 'pending',
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-06-01')
  },
  {
    id: '2',
    userId: '2',
    items: [
      {
        productId: '3',
        productTitle: 'Wireless Headphones',
        price: 249.99,
        quantity: 1
      }
    ],
    totalPrice: 249.99,
    status: 'accepted',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-16')
  }
];

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) { }

  getOrders(): Observable<Order[]> {
    return of(MOCK_ORDERS).pipe(delay(500));
  }

  getUserOrders(): Observable<Order[]> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('User not logged in'));
    }
    
    const userOrders = MOCK_ORDERS.filter(order => order.userId === currentUser.id);
    return of(userOrders).pipe(delay(500));
  }

  getOrderById(id: string): Observable<Order> {
    const order = MOCK_ORDERS.find(o => o.id === id);
    
    if (order) {
      return of(order).pipe(delay(300));
    }
    
    return throwError(() => new Error('Order not found'));
  }

  createOrder(): Observable<Order> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('User not logged in'));
    }
    
    const cart = this.cartService.getCart();
    
    if (cart.items.length === 0) {
      return throwError(() => new Error('Cart is empty'));
    }
    
    // Convert cart items to order items
    const orderItems: OrderItem[] = cart.items.map(item => ({
      productId: item.product.id,
      productTitle: item.product.title,
      price: item.product.promotionPrice || item.product.price,
      quantity: item.quantity
    }));
    
    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      items: orderItems,
      totalPrice: cart.totalPrice,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to mock database
    MOCK_ORDERS.push(newOrder);
    
    // Clear cart after successful order
    this.cartService.clearCart();
    
    return of(newOrder).pipe(delay(800));
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<Order> {
    const orderIndex = MOCK_ORDERS.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      return throwError(() => new Error('Order not found'));
    }
    
    const updatedOrder = {
      ...MOCK_ORDERS[orderIndex],
      status,
      updatedAt: new Date()
    };
    
    MOCK_ORDERS[orderIndex] = updatedOrder;
    
    return of(updatedOrder).pipe(delay(500));
  }

  cancelOrder(orderId: string): Observable<Order> {
    const orderIndex = MOCK_ORDERS.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      return throwError(() => new Error('Order not found'));
    }
    
    const order = MOCK_ORDERS[orderIndex];
    
    // Only pending orders can be cancelled
    if (order.status !== 'pending') {
      return throwError(() => new Error('Only pending orders can be cancelled'));
    }
    
    // Check if user owns the order
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || (order.userId !== currentUser.id && !currentUser.isAdmin)) {
      return throwError(() => new Error('Unauthorized'));
    }
    
    const updatedOrder = {
      ...order,
      status: 'rejected' as OrderStatus,
      updatedAt: new Date()
    };
    
    MOCK_ORDERS[orderIndex] = updatedOrder;
    
    return of(updatedOrder).pipe(delay(500));
  }

  getAllOrders(): Observable<Order[]> {
    return of(MOCK_ORDERS).pipe(delay(500));
  }
}